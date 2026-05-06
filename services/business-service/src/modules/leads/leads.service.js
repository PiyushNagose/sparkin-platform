import { AppError } from "../../common/errors/app-error.js";
import { leadsRepository } from "./leads.repository.js";
import { platformSettingsService } from "../platform-settings/platform-settings.service.js";
import mongoose from "mongoose";

function roundToNearest(value, step = 1000) {
  return Math.round(Number(value || 0) / step) * step;
}

function getLeadSystemSizeKw(lead) {
  const directSize = Number(
    lead?.adminSystemSizeKw ||
      lead?.calculatorEstimate?.system?.recommendedSizeKw ||
      lead?.property?.sanctionedLoadKw ||
      0,
  );

  if (directSize > 0) return directSize;
  if (lead?.roof?.sizeRange === "under_500") return 3;
  if (lead?.roof?.sizeRange === "over_1000") return 10;
  return 5;
}

async function buildCommercialRange(lead, input = {}) {
  const settings = await platformSettingsService.getSettings();
  const sizeKw = Number(input.adminSystemSizeKw || getLeadSystemSizeKw(lead));
  const estimatedCost = Number(
    input.estimatedCost ||
      lead?.estimatedCost ||
      lead?.calculatorEstimate?.investment?.grossCost ||
      sizeKw * Number(settings.pricing.standardCostPerKw),
  );
  const minAmount = Number(
    input.bidRange?.minAmount ||
      lead?.bidRange?.minAmount ||
      roundToNearest(sizeKw * Number(settings.pricing.minBidAmount)),
  );
  const maxAmount = Number(
    input.bidRange?.maxAmount ||
      lead?.bidRange?.maxAmount ||
      roundToNearest(sizeKw * Number(settings.pricing.maxBidAmount)),
  );

  if (minAmount >= maxAmount) {
    throw new AppError(400, "Minimum bid amount must be less than maximum bid amount");
  }

  return {
    adminSystemSizeKw: Number(sizeKw.toFixed(2)),
    estimatedCost: roundToNearest(estimatedCost),
    bidRange: {
      minAmount: roundToNearest(minAmount),
      maxAmount: roundToNearest(maxAmount),
    },
  };
}

export const leadsService = {
  async createLead(user, input) {
    if (!["customer", "vendor", "admin"].includes(user.role)) {
      throw new AppError(403, "You do not have permission to create leads");
    }

    const isVendorCreated = user.role === "vendor";
    const isAdminCreated = user.role === "admin";
    const isManualLead = isVendorCreated || isAdminCreated;

    // Idempotency guard for customers: block duplicate submissions within 60 seconds
    if (!isManualLead) {
      const recentLeads = await leadsRepository.findLeadsForCustomer(
        user.userId,
      );
      const sixtySecondsAgo = new Date(Date.now() - 60_000);
      const recentDuplicate = recentLeads.find(
        (lead) =>
          lead.status === "submitted" &&
          new Date(lead.submittedAt || lead.createdAt) > sixtySecondsAgo &&
          lead.contact?.phoneNumber === input.contact?.phoneNumber,
      );
      if (recentDuplicate) {
        return recentDuplicate; // return existing lead silently — idempotent
      }
    }

    const lead = await leadsRepository.createLead({
      ...input,
      customerId: isManualLead
        ? `manual:${user.userId}:${input.contact.phoneNumber}`
        : user.userId,
      createdByVendorId: isVendorCreated ? user.userId : null,
      source: isAdminCreated
        ? "admin_manual"
        : isVendorCreated
          ? "vendor_manual"
          : "customer_booking",
      status: "submitted",
      submittedAt: new Date(),
    });

    if (isManualLead) {
      return leadsRepository.updateStatus(lead.id, "reviewing");
    }

    return lead;
  },

  async listLeads(user) {
    if (user.role === "admin") {
      return leadsRepository.findAll();
    }

    if (user.role === "vendor") {
      return leadsRepository.findVendorVisibleLeads(user.userId);
    }

    return leadsRepository.findLeadsForCustomer(user.userId);
  },

  async getLead(user, leadId) {
    if (!mongoose.isValidObjectId(leadId)) {
      throw new AppError(400, "Invalid lead id");
    }

    const lead = await leadsRepository.findLeadById(leadId);

    if (!lead) {
      throw new AppError(404, "Lead not found");
    }

    const canView =
      user.role === "admin" ||
      (user.role === "vendor" &&
        (lead.assignedVendorIds?.includes(user.userId) ||
          lead.createdByVendorId === user.userId)) ||
      lead.customerId === user.userId;

    if (!canView) {
      throw new AppError(403, "You do not have access to this lead");
    }

    return lead;
  },

  async updateLeadStatus(user, leadId, input) {
    if (user.role !== "vendor" && user.role !== "admin") {
      throw new AppError(403, "Only vendors can update lead status");
    }

    const lead = await this.getLead(user, leadId);

    if (lead.status === "quote_selected" && input.status !== "closed") {
      throw new AppError(
        409,
        "Selected leads cannot be moved back into review",
      );
    }

    if (input.status === "open_for_quotes") {
      await leadsRepository.updateDetails(
        leadId,
        await buildCommercialRange(lead),
      );
    }

    return leadsRepository.updateStatus(leadId, input.status);
  },

  async assignVendors(user, leadId, input) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can assign vendors to leads");
    }

    const lead = await this.getLead(user, leadId);

    if (lead.status === "closed") {
      throw new AppError(409, "Closed leads cannot be assigned to vendors");
    }

    const vendorIds = [...new Set(input.vendorIds)];
    const settings = await platformSettingsService.getSettings();
    const windowHours = Number(settings.bidding.windowHours || 48);
    const biddingStartsAt = new Date();
    const biddingEndsAt = new Date(
      biddingStartsAt.getTime() + windowHours * 60 * 60 * 1000,
    );
    const bidDetails = await buildCommercialRange(lead);

    return leadsRepository.assignVendors(leadId, vendorIds, {
      ...bidDetails,
      biddingWindowHours: windowHours,
      biddingEndsAt,
    });
  },

  async updateDetails(user, leadId, input) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can update lead details");
    }

    const lead = await this.getLead(user, leadId);

    const updates = await buildCommercialRange(lead, input);

    return leadsRepository.updateDetails(leadId, updates);
  },

  async markCommitmentPaid(user, leadId) {
    // Customers mark their own lead payment; admins can mark any
    const lead = await this.getLead(user, leadId);

    if (user.role === "customer" && lead.customerId !== user.userId) {
      throw new AppError(403, "You can only update your own lead");
    }

    return leadsRepository.markCommitmentPaid(leadId);
  },
};
