import { authService } from "./auth.service.js";

export const authController = {
  async register(req, res) {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  },

  async login(req, res) {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  },

  async refresh(req, res) {
    const result = await authService.refresh(req.body.refreshToken);
    res.status(200).json(result);
  },

  async logout(req, res) {
    const result = await authService.logout(req.body.refreshToken);
    res.status(200).json(result);
  },

  async me(req, res) {
    const user = await authService.getCurrentUser(req.auth.userId);
    res.status(200).json({ user });
  },
};
