/**
 * usePlatformStates — loads admin-configured states (with their cities)
 * from the platform-settings API. Components use this to drive
 * state/city cascading dropdowns.
 *
 * Returns:
 *   stateOptions  — [{ id, key, name, rate, cities }]
 *   getCities(key) — () => string[]  (cities for a state key)
 *   loading       — boolean
 *   error         — string | null
 */
import { useCallback, useEffect, useState } from "react";
import { publicPlatformSettingsApi } from "@/features/public/api/platformSettingsApi";
import { getCitiesForState as getStaticCities } from "@/shared/data/stateCities";

export function usePlatformStates() {
  const [stateOptions, setStateOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    publicPlatformSettingsApi
      .getStates({ ttlMs: 60_000 })
      .then((states) => {
        if (cancelled) return;
        if (states?.length) {
          setStateOptions(states);
        }
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[usePlatformStates] Failed to load states:", err);
        setError("Could not load state list. Using defaults.");
        // Keep whatever stateOptions already loaded (possibly empty)
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Get the city list for a given state key.
   * Uses the live API data first; falls back to static data.
   */
  const getCities = useCallback(
    (stateKey) => {
      if (!stateKey) return [];
      const match = stateOptions.find((s) => s.key === stateKey);
      if (match?.cities?.length) return match.cities;
      // Fallback to bundled static list
      return getStaticCities(stateKey);
    },
    [stateOptions],
  );

  return { stateOptions, getCities, loading, error };
}
