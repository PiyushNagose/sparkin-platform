import { businessClient } from "@/shared/lib/http/businessClient";

function requireId(id, label) {
  if (!id || id === "undefined") {
    throw new Error(`${label} is required`);
  }

  return id;
}

export const leadsApi = {
  async createLead(payload) {
    const { data } = await businessClient.post("/leads", payload);
    return data.lead;
  },

  async listLeads() {
    const { data } = await businessClient.get("/leads");
    return data.leads;
  },

  async getLead(leadId) {
    const { data } = await businessClient.get(`/leads/${requireId(leadId, "Lead id")}`);
    return data.lead;
  },
};

export const quotesApi = {
  async createQuote(leadId, payload) {
    const { data } = await businessClient.post(`/quotes/leads/${requireId(leadId, "Lead id")}`, payload);
    return data.quote;
  },

  async listQuotes(params = {}) {
    const { data } = await businessClient.get("/quotes", { params });
    return data.quotes;
  },

  async getQuote(quoteId) {
    const { data } = await businessClient.get(`/quotes/${requireId(quoteId, "Quote id")}`);
    return data.quote;
  },

  async acceptQuote(quoteId) {
    const { data } = await businessClient.post(`/quotes/${requireId(quoteId, "Quote id")}/accept`);
    return data;
  },

  async getMyQuoteForLead(leadId) {
    const quotes = await this.listQuotes({ leadId });
    return quotes[0] ?? null;
  },
};
