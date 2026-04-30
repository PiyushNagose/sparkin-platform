import { paymentsService } from "./payments.service.js";

export const paymentsController = {
  async list(req, res) {
    const payments = await paymentsService.listPayments(req.auth);
    res.status(200).json({ payments });
  },

  async getById(req, res) {
    const payment = await paymentsService.getPayment(req.auth, req.params.paymentId);
    res.status(200).json({ payment });
  },
};
