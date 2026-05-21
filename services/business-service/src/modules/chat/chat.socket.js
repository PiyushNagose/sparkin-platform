import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { ChatMessage, ChatRoom } from "./chat.model.js";

function serializeRoom(room) {
  if (!room) return null;
  if (typeof room.toObject === "function") {
    return room.toObject({ flattenMaps: true });
  }
  if (room.unreadCount instanceof Map) {
    return {
      ...room,
      unreadCount: Object.fromEntries(room.unreadCount.entries()),
    };
  }
  return room;
}

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

        const updatedRoom = serializeRoom(await ChatRoom.findOne({ roomId }));
        const messagePayload = message.toObject();

        // Broadcast to the active room and to each participant's personal
        // channel so sidebars update before the recipient opens the room.
        io.to(roomId).emit("new:message", messagePayload);
        (room.participantIds || []).forEach((participantId) => {
          io.to(`user:${participantId}`).emit("new:message", messagePayload);
          io.to(`user:${participantId}`).emit("room:updated", updatedRoom);
        });

        // If this is a new room, notify all other participants so their sidebar refreshes
        if (isNewRoom) {
          otherIds.forEach((otherId) => {
            // Emit to the personal room each user is subscribed to
            io.to(`user:${otherId}`).emit("new:room", updatedRoom);
          });
        }

        ack?.({ ok: true, messageId: message._id });
      } catch (err) {
        ack?.({ error: "Failed to send message" });
      }
    });

    // ── typing indicators ─────────────────────────────────────────────────
    socket.on("typing:start", ({ roomId }) => {
      socket.to(roomId).emit("typing:start", { roomId, userId, name });
    });

    socket.on("typing:stop", ({ roomId }) => {
      socket.to(roomId).emit("typing:stop", { roomId, userId });
    });

    socket.on("disconnect", () => {
      // cleanup handled automatically by socket.io
    });
  });
}
