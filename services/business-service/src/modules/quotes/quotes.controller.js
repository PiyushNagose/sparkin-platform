import { quotesService } from "./quotes.service.js";

export const quotesController = {
  async createForLead(req, res) {
    const quote = await quotesService.createQuote(req.auth, req.params.leadId, req.body);
    res.status(201).json({ quote });
  },

  async list(req, res) {
    const quotes = await quotesService.listQuotes(req.auth, req.query.leadId ?? null);
    res.status(200).json({ quotes });
  },

  async getById(req, res) {
    const quote = await quotesService.getQuote(req.auth, req.params.quoteId);
    res.status(200).json({ quote });
  },

  async accept(req, res) {
    const result = await quotesService.acceptQuote(req.auth, req.params.quoteId, req.headers.authorization);
    res.status(200).json(result);
  },
};
