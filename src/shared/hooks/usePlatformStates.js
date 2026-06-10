/**
 * usePlatformStates — loads admin-configured states (with their cities)
 * from the platform-settings API. Components use this to drive
 * state/city cascading dropdowns.
 *
 * Returns:
 *   stateOptions  — [{ id, key, name, rate, cities }]
 *   getCities(key) — string[]   (cities for a given state key)
 *   loading       — boolean     (true while the first fetch is in flight)
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
        if (states?.length) setStateOptions(states);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[usePlatformStates] Failed to load states:", err);
        setError("Could not load state list. Using defaults.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * City list for a given state key.
   * Prefers live API data; falls back to bundled static list.
   * Returns [] when no cities exist for the state at all.
   */
  const getCities = useCallback(
    (stateKey) => {
      if (!stateKey) return [];
      const match = stateOptions.find((s) => s.key === stateKey);
      if (match) return match.cities?.length ? match.cities : [];
      // Fallback for states not yet in the API response
      return getStaticCities(stateKey);
    },
    [stateOptions],
  );

  return { stateOptions, getCities, loading, error };
}
