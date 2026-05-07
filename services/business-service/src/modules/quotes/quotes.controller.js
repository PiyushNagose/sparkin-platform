import { quotesService } from "./quotes.service.js";

export const quotesController = {
  async createForLead(req, res) {
    const quote = await quotesService.createQuote(
      req.auth,
      req.params.leadId,
      req.body,
    );
    res.status(201).json({ quote });
  },

  async list(req, res) {
    const quotes = await quotesService.listQuotes(
      req.auth,
      req.query.leadId ?? null,
    );
    const page = parseInt(req.query.page, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;

    if (page > 0 && limit > 0) {
      const total = quotes.length;
      const start = (page - 1) * limit;
      const paginated = quotes.slice(start, start + limit);
      return res.status(200).json({
        quotes: paginated,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    res.status(200).json({ quotes });
  },

  async getById(req, res) {
    const quote = await quotesService.getQuote(req.auth, req.params.quoteId);
    res.status(200).json({ quote });
  },

  async accept(req, res) {
    const result = await quotesService.acceptQuote(
      req.auth,
      req.params.quoteId,
      req.headers.authorization,
    );
    res.status(200).json(result);
  },
};
