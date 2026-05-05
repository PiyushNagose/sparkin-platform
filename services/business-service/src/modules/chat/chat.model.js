import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    senderRole: { type: String, enum: ["admin", "vendor", "customer"], required: true },
    senderName: { type: String, required: true },
    text: { type: String, default: "" },
    attachmentUrl: { type: String, default: null },
    attachmentName: { type: String, default: null },
    readBy: [{ type: String }],
  },
  { timestamps: true },
);

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    participantIds: [{ type: String }],
    participantRoles: [{ type: String }],
    participantNames: [{ type: String }],
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: null },
    unreadCount: { type: Map, of: Number, default: {} },
  },
  { timestamps: true },
);

export const ChatMessage = mongoose.model("ChatMessage", messageSchema);
export const ChatRoom = mongoose.model("ChatRoom", roomSchema);
