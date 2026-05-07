import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet } from "@/shared/lib/http/requestCache";

export const publicPlatformSettingsApi = {
  async getSettings(options = {}) {
    const { data } = await cachedGet(businessClient, "/platform-settings", options);
    return data.settings;
  },
};
