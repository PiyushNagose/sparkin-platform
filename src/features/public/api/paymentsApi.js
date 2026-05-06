import { fulfillmentClient } from "@/shared/lib/http/fulfillmentClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

function requireId(id, label) {
  if (!id || id === "undefined") {
    throw new Error(`${label} is required`);
  }

  return id;
}

export const paymentsApi = {
  async listPayments(options = {}) {
    const { data } = await cachedGet(fulfillmentClient, "/payments", options);
    return data.payments;
  },

  async createInvoice(payload) {
    const { data } = await fulfillmentClient.post("/payments", payload);
    invalidateRequestCache("/payments");
    return data.payment;
  },

  async getPayment(paymentId, options = {}) {
    const { data } = await cachedGet(
      fulfillmentClient,
      `/payments/${requireId(paymentId, "Payment id")}`,
      options,
    );
    return data.payment;
  },

  async updatePaymentStatus(paymentId, payload) {
    const { data } = await fulfillmentClient.patch(
      `/payments/${requireId(paymentId, "Payment id")}/status`,
      payload,
    );
    invalidateRequestCache("/payments");
    return data.payment;
  },

  // Razorpay — create an order for a pending payment
  async createRazorpayOrder(paymentId) {
    const { data } = await fulfillmentClient.post(
      `/payments/razorpay/order/${requireId(paymentId, "Payment id")}`,
    );
    return data.order;
  },

  // Razorpay — verify signature and capture payment
  async verifyRazorpayPayment(payload) {
    const { data } = await fulfillmentClient.post("/payments/razorpay/verify", payload);
    invalidateRequestCache("/payments");
    return data.payment;
  },

  // COD — confirm booking advance as cash on delivery
  async confirmCodPayment(paymentId) {
    const { data } = await fulfillmentClient.post(
      `/payments/razorpay/cod/${requireId(paymentId, "Payment id")}`,
    );
    invalidateRequestCache("/payments");
    return data.payment;
  },
};
