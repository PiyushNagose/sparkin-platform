import { QuoteModel } from "./quote.model.js";

const LIST_QUERY_MAX_TIME_MS = 8_000;

function normalizeQuote(quote) {
  const value = quote?.toObject ? quote.toObject() : quote;

  if (!value) {
    return value;
  }

  return {
    ...value,
    id: value.id || value._id?.toString(),
  };
}

function normalizeQuotes(quotes) {
  return quotes.map((quote) => normalizeQuote(quote));
}

export const quotesRepository = {
  async createQuote(quote) {
    const created = await QuoteModel.create(quote);
    return normalizeQuote(created);
  },

  async findQuoteByVendorAndLead(vendorId, leadId) {
    const quote = await QuoteModel.findOne({ vendorId, leadId }).lean({
      virtuals: true,
    });
    return normalizeQuote(quote);
  },

  async findQuoteById(quoteId) {
    const quote = await QuoteModel.findById(quoteId).lean({ virtuals: true });
    return normalizeQuote(quote);
  },

  async updateQuoteByVendorAndLead(vendorId, leadId, quote) {
    const updated = await QuoteModel.findOneAndUpdate(
      { vendorId, leadId },
      {
        $set: {
          pricing: quote.pricing,
          system: quote.system,
          timeline: quote.timeline,
          proposalNotes: quote.proposalNotes ?? null,
          customerId: quote.customerId,
          status: "submitted",
          submittedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    ).lean({ virtuals: true });

    return normalizeQuote(updated);
  },

  async findQuotesByLeadId(leadId) {
    const quotes = await QuoteModel.find({ leadId })
      .sort({ createdAt: -1 })
      .maxTimeMS(LIST_QUERY_MAX_TIME_MS)
      .lean({ virtuals: true });
    return normalizeQuotes(quotes);
  },

  async findAll() {
    const quotes = await QuoteModel.find({})
      .sort({ createdAt: -1 })
      .maxTimeMS(LIST_QUERY_MAX_TIME_MS)
      .lean({ virtuals: true });
    return normalizeQuotes(quotes);
  },

  async findQuotesByLeadIds(leadIds) {
    const quotes = await QuoteModel.find({ leadId: { $in: leadIds } })
      .sort({ createdAt: -1 })
      .maxTimeMS(LIST_QUERY_MAX_TIME_MS)
      .lean({ virtuals: true });
    return normalizeQuotes(quotes);
  },

  async findQuotesByCustomer(customerId, leadIds = []) {
    const query =
      leadIds.length > 0
        ? { $or: [{ customerId }, { leadId: { $in: leadIds } }] }
        : { customerId };

    const quotes = await QuoteModel.find(query)
      .sort({ createdAt: -1 })
      .maxTimeMS(LIST_QUERY_MAX_TIME_MS)
      .lean({ virtuals: true });
    return normalizeQuotes(quotes);
  },

  async findQuotesByVendor(vendorId) {
    const quotes = await QuoteModel.find({ vendorId })
      .sort({ createdAt: -1 })
      .maxTimeMS(LIST_QUERY_MAX_TIME_MS)
      .lean({ virtuals: true });
    return normalizeQuotes(quotes);
  },

  async acceptQuote(quoteId, leadId) {
    await QuoteModel.updateMany(
      { leadId, _id: { $ne: quoteId }, status: { $nin: ["withdrawn"] } },
      { $set: { status: "rejected" } },
    );

    const quote = await QuoteModel.findByIdAndUpdate(
      quoteId,
      { $set: { status: "accepted" } },
      { returnDocument: "after" },
    ).lean({ virtuals: true });

    return normalizeQuote(quote);
  },

  // Rollback: revert a quote from "accepted" back to "submitted" and un-reject
  // the other quotes for the same lead. Called when project creation fails.
  async revertQuoteAcceptance(quoteId) {
    const quote = await QuoteModel.findById(quoteId).lean({ virtuals: true });
    if (!quote) return;

    // Restore the accepted quote to submitted
    await QuoteModel.findByIdAndUpdate(quoteId, {
      $set: { status: "submitted" },
    });

    // Restore other quotes for the same lead from rejected back to submitted
    await QuoteModel.updateMany(
      { leadId: quote.leadId, _id: { $ne: quoteId }, status: "rejected" },
      { $set: { status: "submitted" } },
    );
  },
};
