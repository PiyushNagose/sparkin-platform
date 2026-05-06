import { fulfillmentClient } from "@/shared/lib/http/fulfillmentClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

function requireId(id, label) {
  if (!id || id === "undefined") {
    throw new Error(`${label} is required`);
  }

  return id;
}

export const serviceRequestsApi = {
  async createRequest(payload) {
    const { data } = await fulfillmentClient.post("/service-requests", payload);
    invalidateRequestCache("/service-requests");
    return data.request;
  },

  async listRequests(options = {}) {
    const { data } = await cachedGet(fulfillmentClient, "/service-requests", options);
    return data.requests;
  },

  async getRequest(requestId, options = {}) {
    const { data } = await cachedGet(
      fulfillmentClient,
      `/service-requests/${requireId(requestId, "Service request id")}`,
      options,
    );
    return data.request;
  },

  async updateStatus(requestId, payload) {
    const { data } = await fulfillmentClient.patch(
      `/service-requests/${requireId(requestId, "Service request id")}/status`,
      payload,
    );
    invalidateRequestCache("/service-requests");
    return data.request;
  },
};
