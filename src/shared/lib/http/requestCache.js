const DEFAULT_TTL_MS = 10000;
const cache = new Map();

function normalizeValue(value) {
  if (value instanceof URLSearchParams) {
    return Object.fromEntries(value.entries());
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((result, key) => {
        const nextValue = value[key];
        if (nextValue !== undefined && nextValue !== null && nextValue !== "") {
          result[key] = normalizeValue(nextValue);
        }
        return result;
      }, {});
  }

  return value;
}

function createCacheKey(client, url, params) {
  const baseURL = client?.defaults?.baseURL || "";
  return `${baseURL}|${url}|${JSON.stringify(normalizeValue(params || {}))}`;
}

export async function cachedGet(client, url, options = {}) {
  const {
    allowStaleOnError = true,
    ttlMs = DEFAULT_TTL_MS,
    force = false,
    params,
    ...axiosOptions
  } = options;
  const key = createCacheKey(client, url, params);
  const now = Date.now();
  const entry = cache.get(key);

  if (!force && entry) {
    if (entry.promise) {
      return entry.promise;
    }

    if (entry.expiresAt > now) {
      return entry.response;
    }
  }

  const promise = client
    .get(url, { ...axiosOptions, params })
    .then((response) => {
      cache.set(key, {
        response,
        expiresAt: Date.now() + ttlMs,
      });
      return response;
    })
    .catch((error) => {
      if (allowStaleOnError && entry?.response) {
        return entry.response;
      }

      cache.delete(key);
      throw error;
    });

  cache.set(key, {
    promise,
    expiresAt: now + ttlMs,
  });

  return promise;
}

export function invalidateRequestCache(match) {
  if (!match) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (typeof match === "string" ? key.includes(match) : match(key)) {
      cache.delete(key);
    }
  }
}
