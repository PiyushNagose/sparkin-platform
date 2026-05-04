import { calculatorService } from "./calculator.service.js";

export const calculatorController = {
  async serviceability(req, res) {
    const serviceability = calculatorService.getServiceability(req.query);
    res.status(200).json({ serviceability });
  },

  async estimate(req, res) {
    const estimate = calculatorService.buildEstimate(req.body);
    res.status(200).json({ estimate });
  },
};
