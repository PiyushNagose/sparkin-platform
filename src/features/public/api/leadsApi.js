import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

function requireId(id, label) {
  if (!id || id === "undefined") {
    throw new Error(`${label} is required`);
  }

  return id;
}

export const leadsApi = {
  async createLead(payload) {
    const { data } = await businessClient.post("/leads", payload);
    invalidateRequestCache((key) => key.includes("/leads") || key.includes("/quotes"));
    return data.lead;
  },

  async listLeads(options = {}) {
    const { data } = await cachedGet(businessClient, "/leads", options);
    return data.leads;
  },

  async getLead(leadId, options = {}) {
    const { data } = await cachedGet(
      businessClient,
      `/leads/${requireId(leadId, "Lead id")}`,
      options,
    );
    return data.lead;
  },

  async updateLeadStatus(leadId, payload) {
    const { data } = await businessClient.patch(
      `/leads/${requireId(leadId, "Lead id")}/status`,
      payload,
    );
    invalidateRequestCache((key) => key.includes("/leads") || key.includes("/quotes"));
    return data.lead;
  },

  async assignVendors(leadId, payload) {
    const { data } = await businessClient.patch(
      `/leads/${requireId(leadId, "Lead id")}/vendors`,
      payload,
    );
    invalidateRequestCache((key) => key.includes("/leads") || key.includes("/quotes"));
    return data.lead;
  },

  async updateLeadDetails(leadId, payload) {
    const { data } = await businessClient.patch(
      `/leads/${requireId(leadId, "Lead id")}/details`,
      payload,
    );
    invalidateRequestCache((key) => key.includes("/leads") || key.includes("/quotes"));
    return data.lead;
  },

  async markCommitmentPaid(leadId) {
    const { data } = await businessClient.patch(
      `/leads/${requireId(leadId, "Lead id")}/commitment-paid`,
      { paid: true },
    );
    invalidateRequestCache((key) => key.includes("/leads") || key.includes("/quotes"));
    return data.lead;
  },
};

export const quotesApi = {
  async createQuote(leadId, payload) {
    const { data } = await businessClient.post(
      `/quotes/leads/${requireId(leadId, "Lead id")}`,
      payload,
    );
    invalidateRequestCache((key) => key.includes("/quotes") || key.includes("/leads"));
    return data.quote;
  },

  async listQuotes(params = {}, options = {}) {
    const { data } = await cachedGet(businessClient, "/quotes", { ...options, params });
    return data.quotes;
  },

  async getQuote(quoteId, options = {}) {
    const { data } = await cachedGet(
      businessClient,
      `/quotes/${requireId(quoteId, "Quote id")}`,
      options,
    );
    return data.quote;
  },

  async acceptQuote(quoteId) {
    const { data } = await businessClient.post(
      `/quotes/${requireId(quoteId, "Quote id")}/accept`,
    );
    invalidateRequestCache((key) =>
      key.includes("/quotes") ||
      key.includes("/leads") ||
      key.includes("/projects") ||
      key.includes("/payments"),
    );
    return data;
  },

  async getMyQuoteForLead(leadId) {
    const quotes = await this.listQuotes({ leadId });
    return quotes[0] ?? null;
  },
};
