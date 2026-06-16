import { AppError } from "../../common/errors/app-error.js";
import { leadsRepository } from "./leads.repository.js";
import { platformSettingsService } from "../platform-settings/platform-settings.service.js";
import { vendorsRepository } from "../vendors/vendors.repository.js";
import { quotesRepository } from "../quotes/quotes.repository.js";
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

function roofSizePotential(sizeRange) {
  if (sizeRange === "under_500") return 3;
  if (sizeRange === "over_1000") return 12;
  return 6;
}

function scoreRoof({
  attachment,
  roof = {},
  property = {},
  calculatorEstimate = null,
}) {
  const isImage = String(attachment?.mimeType || "").startsWith("image/");
  const hasCaptureContext = Boolean(
    attachment?.capturedAt || attachment?.location?.latitude,
  );
  const imageQualityScore = isImage ? (attachment.size > 80_000 ? 20 : 14) : 6;
  const shadowScore =
    roof.shadow === "none" ? 28 : roof.shadow === "partial" ? 18 : 7;
  const conditionScore =
    roof.condition === "excellent" ? 24 : roof.condition === "average" ? 17 : 8;
  const contextScore = hasCaptureContext ? 14 : 9;
  const roofTypeScore = property.roofType === "flat" ? 12 : 10;
  const accuracyPercent = Math.min(
    98,
    Math.max(
      58,
      imageQualityScore +
        shadowScore +
        conditionScore +
        contextScore +
        roofTypeScore,
    ),
  );
  const basePotential =
    Number(calculatorEstimate?.system?.recommendedSizeKw) ||
    Number(property.sanctionedLoadKw) ||
    roofSizePotential(roof.sizeRange);
  const shadowFactor =
    roof.shadow === "heavy" ? 0.62 : roof.shadow === "partial" ? 0.82 : 1;
  const conditionFactor =
    roof.condition === "needs_repair"
      ? 0.72
      : roof.condition === "average"
        ? 0.9
        : 1;
  const potentialKw = Number(
    (basePotential * shadowFactor * conditionFactor).toFixed(1),
  );
  const status =
    accuracyPercent >= 90 && potentialKw >= 3
      ? "ideal"
      : accuracyPercent >= 78
        ? "good"
        : potentialKw < 2
          ? "limited"
          : "needs_review";
  const statusLabel = {
    ideal: "Ideal",
    good: "Good",
    needs_review: "Needs Review",
    limited: "Limited",
  }[status];

  const findings = [
    isImage
      ? "Roof reference image detected"
      : "PDF/reference document uploaded",
    roof.shadow === "heavy"
      ? "Heavy shadow may reduce generation"
      : roof.shadow === "partial"
        ? "Partial shade considered in estimate"
        : "Clear solar exposure indicated",
    roof.condition === "needs_repair"
      ? "Roof condition needs engineer review"
      : "Roof condition supports design planning",
  ];

  return {
    status,
    statusLabel,
    accuracyPercent,
    potentialKw,
    message:
      status === "ideal"
        ? "High potential for solar efficiency at your location."
        : status === "good"
          ? "Good solar potential. Engineer will validate exact layout."
          : status === "limited"
            ? "Solar potential is limited from the current roof inputs."
            : "Photo received. Expert review will confirm final fitment.",
    findings,
    image: {
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      size: attachment.size,
      capturedAt: attachment.capturedAt || null,
    },
    evaluatedAt: new Date().toISOString(),
  };
}

async function buildBiddingMeta(lead) {
  const settings = await platformSettingsService.getSettings();
  const windowHours = Number(settings.bidding.windowHours || 48);
  const biddingStartsAt = new Date();
  const biddingEndsAt = new Date(
    biddingStartsAt.getTime() + windowHours * 60 * 60 * 1000,
  );

  return {
    biddingWindowHours: windowHours,
    biddingEndsAt,
  };
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
    throw new AppError(
      400,
      "Minimum bid amount must be less than maximum bid amount",
    );
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

function isBiddingExpired(lead) {
  if (!lead?.biddingEndsAt) return false;
  if (!["vendors_assigned", "open_for_quotes"].includes(lead.status))
    return false;

  return new Date(lead.biddingEndsAt).getTime() <= Date.now();
}

async function closeExpiredLeadIfNeeded(lead) {
  if (!lead || !isBiddingExpired(lead)) return lead;
  return leadsRepository.updateStatus(lead.id, "closed");
}

async function closeExpiredLeads(leads = []) {
  return Promise.all(leads.map((lead) => closeExpiredLeadIfNeeded(lead)));
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

  async analyzeRoof(user, input) {
    if (!["customer", "vendor", "admin"].includes(user.role)) {
      throw new AppError(
        403,
        "You do not have permission to analyze roof images",
      );
    }

    return scoreRoof(input);
  },

  async listLeads(user) {
    if (user.role === "admin") {
      return closeExpiredLeads(await leadsRepository.findAll());
    }

    if (user.role === "vendor") {
      const vendorProfile = await vendorsRepository.findByVendorId(user.userId);

      if (vendorProfile?.verificationStatus !== "verified") {
        throw new AppError(403, "Vendor account is waiting for admin approval");
      }

      return closeExpiredLeads(
        await leadsRepository.findVendorVisibleLeads(user.userId),
      );
    }

    return closeExpiredLeads(
      await leadsRepository.findLeadsForCustomer(user.userId),
    );
  },

  async getLead(user, leadId) {
    if (!mongoose.isValidObjectId(leadId)) {
      throw new AppError(400, "Invalid lead id");
    }

    const rawLead = await leadsRepository.findLeadById(leadId);
    const lead = await closeExpiredLeadIfNeeded(rawLead);

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
    if (user.role === "vendor" && input.status === "reviewing") {
      return this.getLead(user, leadId);
    }

    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can update lead status");
    }

    const lead = await this.getLead(user, leadId);

    if (lead.status === "rejected") {
      throw new AppError(409, "Rejected leads cannot be updated");
    }

    if (lead.status === "quote_selected" && input.status !== "closed") {
      throw new AppError(
        409,
        "Selected leads cannot be moved back into review",
      );
    }

    if (input.status === "rejected") {
      return leadsRepository.updateStatus(leadId, "rejected");
    }

    if (input.status === "verified") {
      await leadsRepository.updateDetails(
        leadId,
        await buildCommercialRange(lead),
      );
      return leadsRepository.updateStatus(leadId, "verified");
    }

    if (input.status === "open_for_quotes") {
      if (!lead.assignedVendorIds?.length) {
        throw new AppError(409, "Assign vendors before opening bidding");
      }
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

    if (lead.status === "closed" || lead.status === "rejected") {
      throw new AppError(409, "This lead cannot be assigned to vendors");
    }
    if (
      !lead.verifiedAt &&
      ![
        "verified",
        "vendors_assigned",
        "open_for_quotes",
        "quote_selected",
      ].includes(lead.status)
    ) {
      throw new AppError(409, "Verify this lead before assigning vendors");
    }

    let vendorIds = input.vendorIds || [];

    // If selectAll is true, fetch all verified vendors
    if (input.selectAll) {
      const allVendors = await vendorsRepository.findAll();
      vendorIds = allVendors
        .filter((vendor) => vendor.verificationStatus === "verified")
        .map((vendor) => vendor.vendorId);

      if (!vendorIds.length) {
        throw new AppError(400, "No verified vendors available to assign");
      }
    } else {
      vendorIds = [...new Set(vendorIds)];
      if (!vendorIds.length) {
        throw new AppError(400, "At least one vendor must be specified");
      }
    }

    const vendorProfiles = await Promise.all(
      vendorIds.map((vendorId) => vendorsRepository.findByVendorId(vendorId)),
    );
    const unapprovedVendor = vendorProfiles.find(
      (profile) => !profile || profile.verificationStatus !== "verified",
    );

    if (unapprovedVendor) {
      throw new AppError(
        400,
        "Only approved partners can be assigned to leads",
      );
    }

    const bidDetails = await buildCommercialRange(lead);
    const biddingMeta = await buildBiddingMeta(lead);

    return leadsRepository.assignVendors(leadId, vendorIds, {
      ...bidDetails,
      ...biddingMeta,
      status: "vendors_assigned",
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

  async rejectLead(user, leadId, input) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can reject leads");
    }

    const lead = await this.getLead(user, leadId);

    if (lead.status === "rejected") {
      throw new AppError(409, "Lead is already rejected");
    }

    if (lead.status === "quote_selected" || lead.status === "closed") {
      throw new AppError(409, "Cannot reject leads in this status");
    }

    return leadsRepository.rejectLead(leadId, {
      rejectedBy: user.userId,
      reason: input.reason || null,
      rejectedByRole: "admin",
    });
  },

  async reassignLeadToVendors(user, leadId, input) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can reassign leads");
    }

    const lead = await this.getLead(user, leadId);

    // Allow reassignment from rejected or open_for_quotes status
    if (
      ![
        "rejected",
        "open_for_quotes",
        "vendors_assigned",
        "quote_selected",
      ].includes(lead.status)
    ) {
      throw new AppError(
        409,
        "Lead must be in rejected, open_for_quotes, or vendors_assigned status to reassign",
      );
    }

    if (!lead.verifiedAt) {
      throw new AppError(409, "Verify this lead before reassigning vendors");
    }

    let vendorIds = input.vendorIds || [];

    if (input.selectAll) {
      const allVendors = await vendorsRepository.findAll();
      vendorIds = allVendors
        .filter((vendor) => vendor.verificationStatus === "verified")
        .map((vendor) => vendor.vendorId);

      if (!vendorIds.length) {
        throw new AppError(400, "No verified vendors available to reassign");
      }
    } else {
      vendorIds = [...new Set(vendorIds)];
      if (!vendorIds.length) {
        throw new AppError(400, "At least one vendor must be specified");
      }
    }

    const vendorProfiles = await Promise.all(
      vendorIds.map((vendorId) => vendorsRepository.findByVendorId(vendorId)),
    );
    const unapprovedVendor = vendorProfiles.find(
      (profile) => !profile || profile.verificationStatus !== "verified",
    );

    if (unapprovedVendor) {
      throw new AppError(
        400,
        "Only approved partners can be assigned to leads",
      );
    }

    const bidDetails = await buildCommercialRange(lead);
    const biddingMeta = await buildBiddingMeta(lead);

    return leadsRepository.reassignLeadToVendor(leadId, vendorIds, {
      reassignedBy: user.userId,
      reassignmentReason: input.reason || "Manual reassignment by admin",
      ...bidDetails,
      ...biddingMeta,
    });
  },

  async updateLeadStatusWithContext(user, leadId, input) {
    // Enhanced status update that handles rejection and reassignment context
    if (input.status === "rejected") {
      return this.rejectLead(user, leadId, input);
    }

    return this.updateLeadStatus(user, leadId, input);
  },
};
