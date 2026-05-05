import crypto from "node:crypto";
import { AppError } from "../../common/errors/app-error.js";
import { offersRepository } from "./offers.repository.js";

function makeOfferId() {
  return `OFR-${Date.now()}-${crypto.randomInt(100, 999)}`;
}

function generateCouponCode(prefix = "SPARKIN") {
  return `${prefix}${crypto.randomInt(10, 99)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

function resolveStatus(input) {
  if (input.status === "draft") return "draft";
  const now = new Date();
  const from = new Date(input.validFrom);
  if (from > now) return "scheduled";
  return "active";
}

export const offersService = {
  async createOffer(user, input) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can create offers");

    if (new Date(input.validFrom) >= new Date(input.validTo)) {
      throw new AppError(400, "validFrom must be before validTo");
    }

    // Check coupon code uniqueness
    const existing = await offersRepository.findByCouponCode(input.couponCode);
    if (existing)
      throw new AppError(
        409,
        `Coupon code "${input.couponCode}" is already in use`,
      );

    const status = input.saveAsDraft ? "draft" : resolveStatus(input);

    const offer = await offersRepository.create({
      offerId: makeOfferId(),
      createdBy: user.userId,
      name: input.name.trim(),
      description: (input.description || "").trim(),
      couponCode: input.couponCode.trim().toUpperCase(),
      discountType: input.discountType,
      discountValue: Number(input.discountValue),
      minOrderValue: Number(input.minOrderValue || 0),
      maxDiscountCap: input.maxDiscountCap
        ? Number(input.maxDiscountCap)
        : null,
      usageLimitPerUser: Number(input.usageLimitPerUser || 1),
      totalUsageLimit: input.totalUsageLimit
        ? Number(input.totalUsageLimit)
        : null,
      applicableUsers: input.applicableUsers || {
        leads: false,
        customers: false,
        vendors: false,
        allUsers: false,
      },
      validFrom: new Date(input.validFrom),
      validTo: new Date(input.validTo),
      status,
      campaignType: input.campaignType || "public",
      tags: input.tags || [],
    });

    return offer;
  },

  async listOffers(user, query = {}) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can list offers");
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));
    return offersRepository.findAll({
      page,
      limit,
      status: query.status,
      search: query.search,
    });
  },

  async getOffer(user, offerId) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can view offers");
    const offer = await offersRepository.findByOfferId(offerId);
    if (!offer) throw new AppError(404, "Offer not found");
    return offer;
  },

  async updateOffer(user, offerId, input) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can update offers");
    const offer = await offersRepository.findByOfferId(offerId);
    if (!offer) throw new AppError(404, "Offer not found");

    // If coupon code is changing, check uniqueness
    if (
      input.couponCode &&
      input.couponCode.toUpperCase() !== offer.couponCode
    ) {
      const existing = await offersRepository.findByCouponCode(
        input.couponCode,
      );
      if (existing)
        throw new AppError(
          409,
          `Coupon code "${input.couponCode}" is already in use`,
        );
    }

    const updates = {};
    const allowed = [
      "name",
      "description",
      "couponCode",
      "discountType",
      "discountValue",
      "minOrderValue",
      "maxDiscountCap",
      "usageLimitPerUser",
      "totalUsageLimit",
      "applicableUsers",
      "validFrom",
      "validTo",
      "status",
      "campaignType",
      "tags",
    ];
    for (const key of allowed) {
      if (input[key] !== undefined) updates[key] = input[key];
    }
    if (updates.couponCode)
      updates.couponCode = updates.couponCode.toUpperCase();
    if (updates.validFrom) updates.validFrom = new Date(updates.validFrom);
    if (updates.validTo) updates.validTo = new Date(updates.validTo);

    return offersRepository.update(offer.id, updates);
  },

  async toggleStatus(user, offerId, status) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can change offer status");
    const offer = await offersRepository.findByOfferId(offerId);
    if (!offer) throw new AppError(404, "Offer not found");
    return offersRepository.update(offer.id, { status });
  },

  async deleteOffer(user, offerId) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can delete offers");
    const offer = await offersRepository.findByOfferId(offerId);
    if (!offer) throw new AppError(404, "Offer not found");
    if (offer.status === "active" && offer.usedCount > 0) {
      throw new AppError(
        409,
        "Cannot delete an active offer that has been redeemed. Disable it first.",
      );
    }
    await offersRepository.delete(offer.id);
  },

  async generateCode(user) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can generate codes");
    let code;
    let attempts = 0;
    do {
      code = generateCouponCode();
      attempts++;
      if (attempts > 10)
        throw new AppError(500, "Could not generate a unique code. Try again.");
    } while (await offersRepository.findByCouponCode(code));
    return { code };
  },

  async getStats(user) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can view stats");
    return offersRepository.getStats();
  },
};
