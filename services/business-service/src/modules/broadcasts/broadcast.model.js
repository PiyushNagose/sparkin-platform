import mongoose from "mongoose";

const broadcastSchema = new mongoose.Schema(
  {
    broadcastId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    createdBy: { type: String, required: true, index: true },
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    messageType: {
      type: String,
      enum: ["info", "alert", "reminder"],
      default: "info",
      index: true,
    },
    audience: {
      leads: { type: Boolean, default: false },
      customers: { type: Boolean, default: false },
      vendors: { type: Boolean, default: false },
      allUsers: { type: Boolean, default: false },
    },
    channels: {
      notification: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
    },
    timing: {
      type: String,
      enum: ["now", "scheduled"],
      default: "now",
    },
    scheduledAt: { type: Date, default: null },
    sentAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sent", "failed", "cancelled"],
      default: "draft",
      index: true,
    },
    recipientCount: { type: Number, min: 0, default: 0 },
    failureReason: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

export const BroadcastModel =
  mongoose.models.Broadcast ?? mongoose.model("Broadcast", broadcastSchema);
