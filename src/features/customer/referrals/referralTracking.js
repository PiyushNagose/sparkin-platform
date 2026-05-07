const REFERRAL_STORAGE_KEY = "sparkin.referral.attribution";

export function buildReferralUrl(referralLink) {
  if (!referralLink) return "";
  if (/^https?:\/\//i.test(referralLink)) return referralLink;
  return `${window.location.origin}${referralLink.startsWith("/") ? "" : "/"}${referralLink}`;
}

export function saveReferralAttribution({ referralCode, channel = "direct_invite" }) {
  if (!referralCode) return;

  localStorage.setItem(
    REFERRAL_STORAGE_KEY,
    JSON.stringify({
      referralCode: String(referralCode).trim().toUpperCase(),
      channel,
      capturedAt: new Date().toISOString(),
    }),
  );
}

export function getReferralAttribution() {
  try {
    const value = JSON.parse(localStorage.getItem(REFERRAL_STORAGE_KEY) || "null");
    return value?.referralCode ? value : null;
  } catch {
    return null;
  }
}

export function clearReferralAttribution() {
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
}
