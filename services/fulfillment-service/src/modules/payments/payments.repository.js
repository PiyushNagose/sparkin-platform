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
  async create(payment) {
    const created = await PaymentModel.create(payment);
    return normalizePayment(created);
  },

  async createMany(payments) {
    const created = await PaymentModel.insertMany(payments, { ordered: true });
    return normalizePayments(created);
  },

  async findForProject(projectId) {
    const payments = await PaymentModel.find({ projectId })
      .sort({ dueAt: 1 })
      .lean({ virtuals: true });
    return normalizePayments(payments);
  },

  async findById(paymentId) {
    const payment = await PaymentModel.findById(paymentId).lean({
      virtuals: true,
    });
    return normalizePayment(payment);
  },

  async findForCustomer(customerId) {
    const payments = await PaymentModel.find({ customerId })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });
    return normalizePayments(payments);
  },

  async findForVendor(vendorId) {
    const payments = await PaymentModel.find({ vendorId })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });
    return normalizePayments(payments);
  },

  async findAll() {
    const payments = await PaymentModel.find({})
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });
    return normalizePayments(payments);
  },

  async update(paymentId, updates) {
    const payment = await PaymentModel.findByIdAndUpdate(
      paymentId,
      { $set: updates },
      { new: true },
    ).lean({ virtuals: true });
    return normalizePayment(payment);
  },

  // Atomic upsert for the booking advance milestone — prevents duplicate schedules
  // under concurrent requests. Returns { payment, wasNew }.
  async findOrCreateBookingAdvance(project) {
    const invoiceNumber = `SPK-${String(project.id || project._id)
      .slice(-6)
      .toUpperCase()}-01`;
    const doc = {
      projectId: project.id,
      quoteId: project.quoteId,
      customerId: project.customerId,
      vendorId: project.vendorId,
      customer: {
        fullName: project.customer.fullName,
        email: project.customer.email ?? null,
      },
      vendorEmail: project.vendorEmail ?? null,
      invoiceNumber,
      milestone: { key: "booking_advance", title: "Booking Advance" },
      amount: Math.round(project.pricing.totalPrice * 0.1),
      status: "pending",
      dueAt: new Date(),
      paidAt: null,
    };

    // findOneAndUpdate with upsert — only inserts if no document with this invoiceNumber exists
    const result = await PaymentModel.findOneAndUpdate(
      { invoiceNumber },
      { $setOnInsert: doc },
      { upsert: true, new: false, lean: true },
    );

    // result is null when a new doc was inserted (upsert happened)
    return { wasNew: result === null };
  },
};
