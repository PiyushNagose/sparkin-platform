import { PlatformSettingsModel } from "./platform-settings.model.js";

async function findGlobal() {
  return PlatformSettingsModel.findOne({ settingsId: "global" }).lean();
}

async function upsertGlobal(settings) {
  return PlatformSettingsModel.findOneAndUpdate(
    { settingsId: "global" },
    { $set: { ...settings, settingsId: "global" } },
    { new: true, upsert: true, runValidators: true },
  ).lean();
}

export const platformSettingsRepository = {
  findGlobal,
  upsertGlobal,
};
