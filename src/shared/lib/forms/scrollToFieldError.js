const FOCUSABLE_SELECTOR = [
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "button:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function escapeAttributeValue(value) {
  if (typeof window !== "undefined" && window.CSS?.escape) {
    return window.CSS.escape(value);
  }

  return String(value).replace(/["\\]/g, "\\$&");
}

function findFieldTarget(fieldKey) {
  if (!fieldKey || typeof document === "undefined") {
    return null;
  }

  const escaped = escapeAttributeValue(fieldKey);

  return (
    document.querySelector(`[data-field="${escaped}"]`) ||
    document.querySelector(`[name="${escaped}"]`) ||
    document.getElementById(fieldKey)
  );
}

export function scrollToFieldError(fieldKey, options = {}) {
  const { behavior = "smooth", block = "center", focus = true } = options;
  const target = findFieldTarget(fieldKey);

  if (!target) {
    return false;
  }

  target.scrollIntoView({ behavior, block, inline: "nearest" });

  if (focus) {
    window.setTimeout(() => {
      const focusTarget =
        target.matches?.(FOCUSABLE_SELECTOR)
          ? target
          : target.querySelector?.(FOCUSABLE_SELECTOR);

      focusTarget?.focus?.({ preventScroll: true });
    }, 180);
  }

  return true;
}

export function scrollToFirstFieldError(errors, options = {}) {
  const firstKey = Object.keys(errors || {}).find((key) => Boolean(errors[key]));

  if (!firstKey) {
    return false;
  }

  return scrollToFieldError(firstKey, options);
}
