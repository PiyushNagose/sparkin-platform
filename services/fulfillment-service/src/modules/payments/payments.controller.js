import { paymentsService } from "./payments.service.js";

export const paymentsController = {
  async create(req, res) {
    const payment = await paymentsService.createInvoice(req.auth, req.body);
    res.status(201).json({ payment });
  },

  async list(req, res) {
    const payments = await paymentsService.listPayments(req.auth);
    const page = parseInt(req.query.page, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;

    if (page > 0 && limit > 0) {
      const total = payments.length;
      const start = (page - 1) * limit;
      const paginated = payments.slice(start, start + limit);
      return res.status(200).json({
        payments: paginated,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    res.status(200).json({ payments });
  },

  async getById(req, res) {
    const payment = await paymentsService.getPayment(
      req.auth,
      req.params.paymentId,
    );
    res.status(200).json({ payment });
  },

  async updateStatus(req, res) {
    const payment = await paymentsService.updateStatus(
      req.auth,
      req.params.paymentId,
      req.body,
    );
    res.status(200).json({ payment });
  },
};
