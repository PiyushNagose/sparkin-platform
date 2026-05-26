/**
 * Poll a function until it returns a truthy value or timeout is reached
 * Useful for waiting for async operations to complete (e.g., project creation after quote acceptance)
 */
export async function pollUntil(checkFn, options = {}) {
  const {
    maxAttempts = 30,
    delayMs = 500,
    backoffMultiplier = 1,
    timeoutMs = 15000,
  } = options;

  let attempt = 0;
  let delay = delayMs;
  const startTime = Date.now();

  while (attempt < maxAttempts) {
    try {
      const result = await checkFn();
      if (result) {
        return result;
      }
    } catch (err) {
      console.warn(`Poll attempt ${attempt + 1} failed:`, err.message);
    }

    // Check timeout
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(
        `Polling timeout after ${timeoutMs}ms (${attempt} attempts)`,
      );
    }

    // Wait before next attempt
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay = Math.min(delay * backoffMultiplier, 2000); // Cap at 2s
    attempt++;
  }

  throw new Error(
    `Polling failed after ${maxAttempts} attempts (${timeoutMs}ms timeout)`,
  );
}
