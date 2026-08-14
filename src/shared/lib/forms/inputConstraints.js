const EMAIL_ENDINGS = [
  "co.in",
  "com",
  "in",
  "gov",
  "org",
  "net",
  "edu",
  "co",
  "io",
  "ai",
  "biz",
  "info",
  "dev",
  "app",
];

export function limitPhoneNumber(value) {
  return String(value || "")
    .replace(/\D/g, "")
    .slice(0, 10);
}

export function limitEmailInput(value) {
  const input = String(value || "").replace(/\s/g, "");
  const lower = input.toLowerCase();

  if (!lower.includes("@")) {
    return input;
  }

  const domainStart = lower.indexOf("@") + 1;
  const domainPart = lower.slice(domainStart);
  if (!domainPart.includes(".")) {
    return input;
  }

  const endingMatch = EMAIL_ENDINGS
    .map((ending) => ({
      ending,
      index: domainPart.indexOf(`.${ending}`),
    }))
    .filter(({ index }) => index !== -1)
    .sort((a, b) => a.index - b.index || b.ending.length - a.ending.length)[0];

  if (!endingMatch) {
    return input;
  }

  const endIndex =
    domainStart + endingMatch.index + 1 + endingMatch.ending.length;
  return input.slice(0, endIndex);
}

export const PHONE_INPUT_PROPS = {
  inputMode: "numeric",
  maxLength: 10,
};
