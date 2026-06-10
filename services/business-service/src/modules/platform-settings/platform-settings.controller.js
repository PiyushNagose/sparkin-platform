import { AppError } from "../../common/errors/app-error.js";
import { platformSettingsService } from "./platform-settings.service.js";

export const platformSettingsController = {
  async get(req, res) {
    const settings = await platformSettingsService.getSettings();
    res.status(200).json({ settings });
  },

  async getStates(req, res) {
    const settings = await platformSettingsService.getSettings();
    // Return lightweight state list: id, key, name, rate, cities
    const states = (settings.states || []).map((s) => ({
      id: s.id,
      key: s.key,
      name: s.name,
      rate: s.rate,
      cities: s.cities || [],
    }));
    res.status(200).json({ states });
  },

  async getCitiesForState(req, res) {
    const { stateKey } = req.params;
    if (!stateKey || !/^[a-z0-9_]+$/.test(stateKey)) {
      throw new AppError(400, "Invalid state key");
    }
    const settings = await platformSettingsService.getSettings();
    const state = (settings.states || []).find((s) => s.key === stateKey);
    if (!state) {
      throw new AppError(
        404,
        `State '${stateKey}' is not configured. Ask an admin to add it in Platform Settings.`,
      );
    }
    res
      .status(200)
      .json({ stateKey, stateName: state.name, cities: state.cities || [] });
  },

  async update(req, res) {
    const settings = await platformSettingsService.updateSettings(
      req.auth,
      req.body,
    );
    res.status(200).json({ settings });
  },
};
