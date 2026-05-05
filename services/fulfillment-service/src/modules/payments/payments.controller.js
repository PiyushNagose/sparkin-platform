import { paymentsService } from "./payments.service.js";

export const paymentsController = {
  async create(req, res) {
    const payment = await paymentsService.createInvoice(req.auth, req.body);
    res.status(201).json({ payment });
  },

  async list(req, res) {
    const payments = await paymentsService.listPayments(req.auth);
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
