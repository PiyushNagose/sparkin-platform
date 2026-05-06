import { platformSettingsService } from "./platform-settings.service.js";

export const platformSettingsController = {
  async get(req, res) {
    const settings = await platformSettingsService.getSettings();
    res.status(200).json({ settings });
  },

  async update(req, res) {
    const settings = await platformSettingsService.updateSettings(req.auth, req.body);
    res.status(200).json({ settings });
  },
};
