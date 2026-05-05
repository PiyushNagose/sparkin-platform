import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { ChatMessage, ChatRoom } from "./chat.model.js";

export function createChatRouter(io) {
  const chatRouter = Router();

  // GET /api/v1/chat/rooms — list rooms for the current user
  chatRouter.get("/rooms", requireAuth, asyncHandler(async (req, res) => {
    const userId = req.auth.userId;
    const rooms = await ChatRoom.find({ participantIds: userId }).sort({ lastMessageAt: -1 }).lean();
    res.json(rooms);
  }));

  // GET /api/v1/chat/rooms/:roomId/messages — paginated message history
  chatRouter.get("/rooms/:roomId/messages", requireAuth, asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const before = req.query.before ? new Date(req.query.before) : new Date();

    const messages = await ChatMessage.find({ roomId, createdAt: { $lt: before } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(messages.reverse());
  }));

  // POST /api/v1/chat/rooms — create or get a room between two users
  chatRouter.post("/rooms", requireAuth, asyncHandler(async (req, res) => {
    const { targetUserId, targetRole, targetName } = req.body;
    const userId = req.auth.userId;
    const role = req.auth.role;
    const name = req.auth.name || req.auth.email || "User";

    if (!targetUserId) {
      return res.status(400).json({ message: "targetUserId is required" });
    }

    const ids = [userId, targetUserId].sort();
    const roomId = ids.join("_");

    let room = await ChatRoom.findOne({ roomId });
    const isNew = !room;

    if (!room) {
      const nameMap = { [userId]: name, [targetUserId]: targetName || targetUserId };
      const roleMap = { [userId]: role, [targetUserId]: targetRole || "user" };

      room = await ChatRoom.create({
        roomId,
        participantIds: ids,
        participantRoles: ids.map((id) => roleMap[id]),
        participantNames: ids.map((id) => nameMap[id]),
      });
    }

    // Notify the other participant via socket so their sidebar updates immediately
    if (isNew && io) {
      const otherIds = ids.filter((id) => id !== userId);
      otherIds.forEach((otherId) => {
        io.to(`user:${otherId}`).emit("new:room", room.toObject ? room.toObject() : room);
      });
    }

    res.json(room);
  }));

  // PATCH /api/v1/chat/rooms/:roomId/read — mark messages as read
  chatRouter.patch("/rooms/:roomId/read", requireAuth, asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const userId = req.auth.userId;

    await ChatMessage.updateMany(
      { roomId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } },
    );

    await ChatRoom.updateOne({ roomId }, { $set: { [`unreadCount.${userId}`]: 0 } });

    res.json({ ok: true });
  }));

  // GET /api/v1/chat/admin-contact — returns the active admin's userId/name
  chatRouter.get("/admin-contact", requireAuth, asyncHandler(async (req, res) => {
    const registry = await ChatRoom.findOne({ roomId: "__admin_registry__" }).lean();

    if (registry && registry.participantIds?.length) {
      const adminId = registry.participantIds[0];
      const adminName = registry.participantNames?.[0] || "Sparkin Admin";
      return res.json({ adminId, adminName });
    }

    const adminRoom = await ChatRoom.findOne({
      participantRoles: "admin",
      roomId: { $ne: "__admin_registry__" },
    }).sort({ updatedAt: -1 }).lean();

    if (adminRoom) {
      const adminIdx = adminRoom.participantRoles.indexOf("admin");
      const adminId = adminRoom.participantIds[adminIdx];
      const adminName = adminRoom.participantNames?.[adminIdx] || "Sparkin Admin";
      return res.json({ adminId, adminName });
    }

    res.json({ adminId: null, adminName: "Sparkin Admin" });
  }));

  // POST /api/v1/chat/register-admin — admin calls this on page load to register their real userId
  chatRouter.post("/register-admin", requireAuth, asyncHandler(async (req, res) => {
    if (req.auth.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const adminId = req.auth.userId;
    const adminName = req.auth.name || req.auth.email || "Sparkin Admin";

    await ChatRoom.findOneAndUpdate(
      { roomId: "__admin_registry__" },
      {
        $set: {
          roomId: "__admin_registry__",
          participantIds: [adminId],
          participantRoles: ["admin"],
          participantNames: [adminName],
        },
      },
      { upsert: true, new: true },
    );

    res.json({ ok: true, adminId, adminName });
  }));

  return chatRouter;
}
