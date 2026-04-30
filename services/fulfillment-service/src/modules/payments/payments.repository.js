import { PaymentModel } from "./payment.model.js";

function normalizePayment(payment) {
  const value = payment?.toObject ? payment.toObject() : payment;

  if (!value) {
    return value;
  }

  return {
    ...value,
    id: value.id || value._id?.toString(),
  };
}

function normalizePayments(payments) {
  return payments.map((payment) => normalizePayment(payment));
}

export const paymentsRepository = {
  async createMany(payments) {
    const created = await PaymentModel.insertMany(payments, { ordered: true });
    return normalizePayments(created);
  },

  async findForProject(projectId) {
    const payments = await PaymentModel.find({ projectId }).sort({ dueAt: 1 }).lean({ virtuals: true });
    return normalizePayments(payments);
  },

  async findById(paymentId) {
    const payment = await PaymentModel.findById(paymentId).lean({ virtuals: true });
    return normalizePayment(payment);
  },

  async findForCustomer(customerId) {
    const payments = await PaymentModel.find({ customerId }).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizePayments(payments);
  },

  async findForVendor(vendorId) {
    const payments = await PaymentModel.find({ vendorId }).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizePayments(payments);
  },

  async findAll() {
    const payments = await PaymentModel.find({}).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizePayments(payments);
  },
};
