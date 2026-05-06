import crypto from "node:crypto";
import Razorpay from "razorpay";
import { AppError } from "../../common/errors/app-error.js";
import { env } from "../../config/env.js";
import { paymentsRepository } from "../payments/payments.repository.js";

const razorpay = new Razorpay({
  key_id: env.razorpayKeyId,
  key_secret: env.razorpayKeySecret,
});

export const razorpayService = {
  /**
   * Creates a Razorpay order for the given payment record.
   * The payment must be in "pending" status and belong to the requesting user.
   */
  async createOrder(user, paymentId) {
    const payment = await paymentsRepository.findById(paymentId);

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    const canPay =
      user.role === "admin" || payment.customerId === user.userId;

    if (!canPay) {
      throw new AppError(403, "You do not have access to this payment");
    }

    if (payment.status === "paid") {
      throw new AppError(409, "This payment has already been completed");
    }

    if (payment.status === "cancelled") {
      throw new AppError(409, "This payment has been cancelled");
    }

    // Amount in paise (Razorpay requires smallest currency unit)
    const amountInPaise = payment.amount * 100;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: payment.invoiceNumber,
      notes: {
        paymentId: String(payment.id),
        invoiceNumber: payment.invoiceNumber,
        milestone: payment.milestone.key,
      },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: env.razorpayKeyId,
      invoiceNumber: payment.invoiceNumber,
      customerName: payment.customer.fullName,
      customerEmail: payment.customer.email ?? "",
    };
  },

  /**
   * Marks a booking advance payment as COD (Cash on Delivery).
   * Only the customer who owns the payment can call this.
   */
  async confirmCod(user, paymentId) {
    const payment = await paymentsRepository.findById(paymentId);

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    const canPay =
      user.role === "admin" || payment.customerId === user.userId;

    if (!canPay) {
      throw new AppError(403, "You do not have access to this payment");
    }

    if (payment.status === "paid") {
      return payment; // idempotent
    }

    if (payment.milestone?.key !== "booking_advance") {
      throw new AppError(400, "COD confirmation is only allowed for the booking advance");
    }

    return paymentsRepository.update(payment.id, {
      status: "paid",
      method: "cod",
      paidAt: new Date(),
    });
  },
  async verifyAndCapture(user, input) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = input;

    // Signature verification — HMAC-SHA256 of "orderId|paymentId"
    const expectedSignature = crypto
      .createHmac("sha256", env.razorpayKeySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      throw new AppError(400, "Payment verification failed: invalid signature");
    }

    const payment = await paymentsRepository.findById(paymentId);

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    const canPay =
      user.role === "admin" || payment.customerId === user.userId;

    if (!canPay) {
      throw new AppError(403, "You do not have access to this payment");
    }

    if (payment.status === "paid") {
      // Idempotent — already captured, just return
      return payment;
    }

    return paymentsRepository.update(payment.id, {
      status: "paid",
      method: "razorpay",
      paidAt: new Date(),
      razorpayOrderId,
      razorpayPaymentId,
    });
  },
};
