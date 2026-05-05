import crypto from "node:crypto";
import { AppError } from "../../common/errors/app-error.js";
import { broadcastsRepository } from "./broadcasts.repository.js";

function makeBroadcastId() {
  const year = new Date().getFullYear();
  const num = crypto.randomInt(100, 999);
  return `BRD-${year}-${num}`;
}

function buildAudienceLabel(audience) {
  if (audience.allUsers) return "All Users";
  const parts = [];
  if (audience.leads) parts.push("Leads");
  if (audience.customers) parts.push("Customers");
  if (audience.vendors) parts.push("Vendors");
  return parts.join(", ") || "None";
}

function estimateRecipients(audience) {
  // Placeholder — replace with real DB count when identity service is ready
  if (audience.allUsers) return 1000;
  let count = 0;
  if (audience.leads) count += 300;
  if (audience.customers) count += 450;
  if (audience.vendors) count += 80;
  return count;
}

export const broadcastsService = {
  async createBroadcast(user, input) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can create broadcasts");
    }

    const hasAudience =
      input.audience.allUsers ||
      input.audience.leads ||
      input.audience.customers ||
      input.audience.vendors;

    if (!hasAudience) {
      throw new AppError(400, "Select at least one audience group");
    }

    const hasChannel =
      input.channels.notification || input.channels.email || input.channels.sms;

    if (!hasChannel) {
      throw new AppError(400, "Select at least one delivery channel");
    }

    if (input.timing === "scheduled" && !input.scheduledAt) {
      throw new AppError(400, "Scheduled broadcasts require a date and time");
    }

    if (
      input.timing === "scheduled" &&
      new Date(input.scheduledAt) <= new Date()
    ) {
      throw new AppError(400, "Scheduled time must be in the future");
    }

    const broadcastId = makeBroadcastId();
    const status = input.timing === "scheduled" ? "scheduled" : "sent";
    const sentAt = input.timing === "now" ? new Date() : null;

    const broadcast = await broadcastsRepository.create({
      broadcastId,
      createdBy: user.userId,
      title: input.title.trim(),
      description: input.description.trim(),
      messageType: input.messageType || "info",
      audience: input.audience,
      channels: input.channels,
      timing: input.timing,
      scheduledAt:
        input.timing === "scheduled" ? new Date(input.scheduledAt) : null,
      sentAt,
      status,
      recipientCount: estimateRecipients(input.audience),
    });

    return broadcast;
  },

  async saveDraft(user, input) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can save broadcast drafts");
    }

    const broadcastId = makeBroadcastId();

    const broadcast = await broadcastsRepository.create({
      broadcastId,
      createdBy: user.userId,
      title: (input.title || "Untitled Draft").trim(),
      description: (input.description || "").trim(),
      messageType: input.messageType || "info",
      audience: input.audience || {
        leads: false,
        customers: false,
        vendors: false,
        allUsers: false,
      },
      channels: input.channels || {
        notification: true,
        email: false,
        sms: false,
      },
      timing: input.timing || "now",
      scheduledAt: null,
      sentAt: null,
      status: "draft",
      recipientCount: 0,
    });

    return broadcast;
  },

  async listBroadcasts(user, query = {}) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can view broadcasts");
    }

    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));
    const status = query.status || undefined;

    return broadcastsRepository.findAll({ page, limit, status });
  },

  async getBroadcast(user, broadcastId) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can view broadcasts");
    }

    const broadcast = await broadcastsRepository.findByBroadcastId(broadcastId);
    if (!broadcast) throw new AppError(404, "Broadcast not found");
    return broadcast;
  },

  async cancelBroadcast(user, broadcastId) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can cancel broadcasts");
    }

    const broadcast = await broadcastsRepository.findByBroadcastId(broadcastId);
    if (!broadcast) throw new AppError(404, "Broadcast not found");

    if (!["draft", "scheduled"].includes(broadcast.status)) {
      throw new AppError(
        409,
        "Only draft or scheduled broadcasts can be cancelled",
      );
    }

    return broadcastsRepository.update(broadcast.id, { status: "cancelled" });
  },

  async deleteBroadcast(user, broadcastId) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can delete broadcasts");
    }

    const broadcast = await broadcastsRepository.findByBroadcastId(broadcastId);
    if (!broadcast) throw new AppError(404, "Broadcast not found");

    if (broadcast.status === "sent") {
      throw new AppError(409, "Sent broadcasts cannot be deleted");
    }

    await broadcastsRepository.delete(broadcast.id);
  },
};
