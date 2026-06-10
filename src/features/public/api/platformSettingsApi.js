import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet } from "@/shared/lib/http/requestCache";

export const publicPlatformSettingsApi = {
  /**
   * Full platform settings (states + cities + pricing etc.)
   * Used by admin and calculator/booking pages that need the complete picture.
   */
  async getSettings(options = {}) {
    const { data } = await cachedGet(
      businessClient,
      "/platform-settings",
      options,
    );
    return data.settings;
  },

  /**
   * Lightweight states list: [{ id, key, name, rate, cities }]
   * Used by dropdowns that only need state options.
   */
  async getStates(options = {}) {
    const { data } = await cachedGet(
      businessClient,
      "/platform-settings/states",
      { ttlMs: 60_000, ...options },
    );
    return data.states ?? [];
  },

  /**
   * Cities for a specific state key.
   * Returns [] if the state is unknown or has no cities configured.
   */
  async getCitiesForState(stateKey, options = {}) {
    if (!stateKey) return [];
    try {
      const { data } = await cachedGet(
        businessClient,
        `/platform-settings/states/${stateKey}/cities`,
        { ttlMs: 60_000, ...options },
      );
      return data.cities ?? [];
    } catch {
      return [];
    }
  },
};
