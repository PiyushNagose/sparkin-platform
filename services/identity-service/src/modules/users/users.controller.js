import { usersService } from "./users.service.js";

export const usersController = {
  async getMe(req, res) {
    const user = await usersService.getProfile(req.auth.userId);
    res.status(200).json({ user });
  },

  async updateMe(req, res) {
    const user = await usersService.updateProfile(req.auth.userId, req.body);
    res.status(200).json({ user });
  },

  async updateAvatar(req, res) {
    const user = await usersService.updateAvatar(req.auth.userId, req.body);
    res.status(200).json({ user });
  },

  async changePassword(req, res) {
    await usersService.changePassword(req.auth.userId, req.body);
    res.status(200).json({ success: true });
  },
};
