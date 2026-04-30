import { fulfillmentClient } from "@/shared/lib/http/fulfillmentClient";

function requireId(id, label) {
  if (!id || id === "undefined") {
    throw new Error(`${label} is required`);
  }

  return id;
}

export const serviceRequestsApi = {
  async createRequest(payload) {
    const { data } = await fulfillmentClient.post("/service-requests", payload);
    return data.request;
  },

  async listRequests() {
    const { data } = await fulfillmentClient.get("/service-requests");
    return data.requests;
  },

  async getRequest(requestId) {
    const { data } = await fulfillmentClient.get(`/service-requests/${requireId(requestId, "Service request id")}`);
    return data.request;
  },

  async updateStatus(requestId, payload) {
    const { data } = await fulfillmentClient.patch(
      `/service-requests/${requireId(requestId, "Service request id")}/status`,
      payload,
    );
    return data.request;
  },
};
