import { fulfillmentClient } from "@/shared/lib/http/fulfillmentClient";

function requireId(id, label) {
  if (!id || id === "undefined") {
    throw new Error(`${label} is required`);
  }

  return id;
}

export const paymentsApi = {
  async listPayments() {
    const { data } = await fulfillmentClient.get("/payments");
    return data.payments;
  },

  async createInvoice(payload) {
    const { data } = await fulfillmentClient.post("/payments", payload);
    return data.payment;
  },

  async getPayment(paymentId) {
    const { data } = await fulfillmentClient.get(`/payments/${requireId(paymentId, "Payment id")}`);
    return data.payment;
  },
};
