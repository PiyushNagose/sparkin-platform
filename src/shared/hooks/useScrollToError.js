import { useEffect, useRef } from "react";

/**
 * Returns a ref to attach to an error container.
 * Whenever `error` becomes truthy the page (or portal scroll container) scrolls
 * to the top so the message is immediately visible without the user having to scroll.
 *
 * Usage:
 *   const errorRef = useScrollToError(error);
 *   <Alert ref={errorRef} severity="error">{error}</Alert>
 */
export function useScrollToError(error) {
  const ref = useRef(null);

  useEffect(() => {
    if (!error || !ref.current) return;

    // The portal layout uses a custom scroll container; fall back to window.
    const scrollContainer = document.getElementById("portal-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error]);

  return ref;
}
