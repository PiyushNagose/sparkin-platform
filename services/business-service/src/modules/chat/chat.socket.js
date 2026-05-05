import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { ChatMessage, ChatRoom } from "./chat.model.js";

/**
 * Attach Socket.io chat logic to an existing http.Server instance.
 * Called from server.js after the Express app is created.
 */
export function attachChatSocket(io) {
  // ── JWT auth middleware for socket connections ──────────────────────────
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "").trim();

    if (!token) {
      return next(new Error("Missing auth token"));
    }

    try {
      const payload = jwt.verify(token, env.jwtAccessSecret);
      socket.user = {
        userId: payload.sub,
        role: payload.role,
        name: payload.name || payload.email || "User",
        email: payload.email,
      };
      return next();
    } catch {
      return next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const { userId, role, name } = socket.user;

    // Each user joins their personal notification channel on connect
    socket.join(`user:${userId}`);

    // ── join:room — subscribe to a chat room ──────────────────────────────
    socket.on("join:room", async (roomId) => {
      socket.join(roomId);

      // Mark existing messages as read
      await ChatMessage.updateMany(
        { roomId, readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } },
      ).catch(() => {});

      await ChatRoom.updateOne(
        { roomId },
        { $set: { [`unreadCount.${userId}`]: 0 } },
      ).catch(() => {});
    });

    // ── leave:room ────────────────────────────────────────────────────────
    socket.on("leave:room", (roomId) => {
      socket.leave(roomId);
    });

    // ── send:message ──────────────────────────────────────────────────────
    socket.on("send:message", async (data, ack) => {
      try {
        const { roomId, text, attachmentUrl, attachmentName } = data;

        if (!roomId || (!text?.trim() && !attachmentUrl)) {
          return ack?.({ error: "Invalid message" });
        }

        // Ensure room exists
        let room = await ChatRoom.findOne({ roomId });
        const isNewRoom = !room;
        if (!room) {
          const ids = roomId.split("_");
          room = await ChatRoom.create({
            roomId,
            participantIds: ids,
            participantRoles: [],
            participantNames: ids.map((id) => (id === userId ? name : id)),
          });
        }

        const message = await ChatMessage.create({
          roomId,
          senderId: userId,
          senderRole: role,
          senderName: name,
          text: text?.trim() || "",
          attachmentUrl: attachmentUrl || null,
          attachmentName: attachmentName || null,
          readBy: [userId],
        });

        // Update room metadata
        const otherIds = (room.participantIds || []).filter((id) => id !== userId);
        const incUpdate = Object.fromEntries(otherIds.map((id) => [`unreadCount.${id}`, 1]));

        await ChatRoom.updateOne(
          { roomId },
          {
            $set: {
              lastMessage: message.text || "📎 Attachment",
              lastMessageAt: message.createdAt,
            },
            ...(Object.keys(incUpdate).length ? { $inc: incUpdate } : {}),
          },
        );

        // Broadcast message to everyone in the room
        io.to(roomId).emit("new:message", message.toObject());

        // If this is a new room, notify all other participants so their sidebar refreshes
        if (isNewRoom) {
          const updatedRoom = await ChatRoom.findOne({ roomId }).lean();
          otherIds.forEach((otherId) => {
            // Emit to the personal room each user is subscribed to
            io.to(`user:${otherId}`).emit("new:room", updatedRoom);
          });
        } else {
          // Notify other participants about the updated room (for sidebar refresh)
          otherIds.forEach((otherId) => {
            io.to(`user:${otherId}`).emit("room:updated", {
              roomId,
              lastMessage: message.text || "📎 Attachment",
              lastMessageAt: message.createdAt,
            });
          });
        }

        ack?.({ ok: true, messageId: message._id });
      } catch (err) {
        ack?.({ error: "Failed to send message" });
      }
    });

    // ── typing indicators ─────────────────────────────────────────────────
    socket.on("typing:start", ({ roomId }) => {
      socket.to(roomId).emit("typing:start", { userId, name });
    });

    socket.on("typing:stop", ({ roomId }) => {
      socket.to(roomId).emit("typing:stop", { userId });
    });

    socket.on("disconnect", () => {
      // cleanup handled automatically by socket.io
    });
  });
}
