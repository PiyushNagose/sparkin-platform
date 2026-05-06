import { razorpayService } from "./razorpay.service.js";

export const razorpayController = {
  async createOrder(req, res) {
    const order = await razorpayService.createOrder(req.auth, req.params.paymentId);
    res.status(200).json({ order });
  },

  async confirmCod(req, res) {
    const payment = await razorpayService.confirmCod(req.auth, req.params.paymentId);
    res.status(200).json({ payment });
  },

  async verifyPayment(req, res) {
    const payment = await razorpayService.verifyAndCapture(req.auth, req.body);
    res.status(200).json({ payment });
  },
};
