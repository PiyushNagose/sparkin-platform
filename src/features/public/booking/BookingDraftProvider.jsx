import * as React from "react";
import { useAuth } from "@/features/auth/AuthProvider";

const STORAGE_KEY_PREFIX = "sparkin.bookingDraft";

const initialDraft = {
  contact: {
    fullName: "",
    phoneNumber: "",
    email: "",
  },
  installationAddress: {
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  },
  inspection: {
    preferredDate: "",
    preferredTimeSlot: "",
  },
  property: {
    type: "",
    roofType: "",
    ownership: "",
    distributionCompany: "",
    connectionType: "",
    consumerNumber: "",
    sanctionedLoadKw: "",
  },
  roof: {
    sizeRange: "",
    shadow: "",
    condition: "",
  },
  attachments: {
    roofPhotos: [],
    electricityBill: [],
    photoId: [],
  },
  roofAnalysis: null,
  calculatorEstimate: null,
  notes: "",
  specialInstructions: "",
  couponCode: "",
  appliedCoupon: null,
};

// ─── helpers ────────────────────────────────────────────────────────────────

function storageKey(userId) {
  return userId ? `${STORAGE_KEY_PREFIX}:${userId}` : null;
}

function readDraft(userId) {
  const key = storageKey(userId);
  if (!key) return structuredClone(initialDraft);
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return structuredClone(initialDraft);
    const parsed = JSON.parse(raw);
    // Deep-merge so new fields added to initialDraft are always present
    return {
      ...structuredClone(initialDraft),
      ...parsed,
      contact: { ...structuredClone(initialDraft.contact), ...parsed.contact },
      installationAddress: {
        ...structuredClone(initialDraft.installationAddress),
        ...parsed.installationAddress,
      },
      inspection: {
        ...structuredClone(initialDraft.inspection),
        ...parsed.inspection,
      },
      property: {
        ...structuredClone(initialDraft.property),
        ...parsed.property,
      },
      roof: { ...structuredClone(initialDraft.roof), ...parsed.roof },
      attachments: {
        ...structuredClone(initialDraft.attachments),
        ...parsed.attachments,
      },
    };
  } catch {
    window.localStorage.removeItem(storageKey(userId));
    return structuredClone(initialDraft);
  }
}

function writeDraft(userId, draft) {
  const key = storageKey(userId);
  if (!key) return;
  window.localStorage.setItem(key, JSON.stringify(draft));
}

function clearDraft(userId) {
  const key = storageKey(userId);
  if (key) window.localStorage.removeItem(key);
}

// ─── estimate helpers ────────────────────────────────────────────────────────

function stateLabelFromEstimate(estimate) {
  // Return state as a key (e.g. "andhra_pradesh") to match platform settings
  const rawState = estimate?.input?.state || "";
  if (rawState) return rawState; // already a key from calculator
  const stateName = estimate?.serviceability?.stateName || "";
  // Convert display name to key: "Andhra Pradesh" → "andhra_pradesh"
  return stateName.trim().toLowerCase().replaceAll(" ", "_") || "";
}

function roofSizeRangeFromArea(area) {
  const value = Number(area) || 0;
  if (value > 1000) return "over_1000";
  if (value >= 500) return "500_1000";
  return "under_500";
}

function propertyTypeFromEstimate(estimate) {
  return estimate?.input?.propertyType === "commercial"
    ? "commercial"
    : "independent_house";
}

function connectionTypeFromEstimate(estimate) {
  const connectionType = estimate?.input?.connectionType;
  if (
    connectionType === "three_phase" ||
    connectionType === "ht" ||
    connectionType === "lt"
  ) {
    return "three_phase";
  }
  return "single_phase";
}

function distributionCompanyFromEstimate(estimate) {
  return String(estimate?.serviceability?.discoms?.[0] || "").toLowerCase();
}

function calculatorSystemSizeFromEstimate(estimate) {
  return (
    estimate?.system?.recommendedSizeKw ||
    estimate?.input?.systemSizeKw ||
    estimate?.input?.sanctionedLoadKw ||
    ""
  );
}

// ─── context ─────────────────────────────────────────────────────────────────

const BookingDraftContext = React.createContext(null);

export function BookingDraftProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.userId || user?.id || null;

  // When userId changes (login / logout / switch account) reload the draft
  // for the new user from storage, or start fresh.
  const [draft, setDraft] = React.useState(() => readDraft(userId));

  // Re-load from storage whenever the logged-in user changes
  const prevUserIdRef = React.useRef(userId);
  React.useEffect(() => {
    if (prevUserIdRef.current === userId) return;
    prevUserIdRef.current = userId;
    setDraft(readDraft(userId));
  }, [userId]);

  // Prefill name + email from auth profile (only fill empty fields so manual
  // edits are never overwritten)
  React.useEffect(() => {
    if (!user) return;
    setDraft((current) => ({
      ...current,
      contact: {
        ...current.contact,
        fullName: current.contact.fullName || user.fullName || "",
        email: current.contact.email || user.email || "",
      },
    }));
  }, [user]);

  // Persist every draft change to the user-scoped storage key
  React.useEffect(() => {
    writeDraft(userId, draft);
  }, [userId, draft]);

  // ─── updaters ──────────────────────────────────────────────────────────────

  const updateDraft = React.useCallback((section, values) => {
    setDraft((current) => ({
      ...current,
      [section]: { ...current[section], ...values },
    }));
  }, []);

  const updateField = React.useCallback((field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  }, []);

  const applyCalculatorEstimate = React.useCallback((estimate) => {
    setDraft((current) => {
      const roofArea =
        estimate?.input?.roofAreaSqFt ||
        estimate?.system?.requiredRoofAreaSqFt ||
        null;

      const stateLabel = stateLabelFromEstimate(estimate);

      return {
        ...current,
        installationAddress: {
          ...current.installationAddress,
          city: estimate?.input?.city || current.installationAddress.city,
          state: stateLabel || current.installationAddress.state || "",
          pincode:
            estimate?.input?.pincode || current.installationAddress.pincode,
        },
        property: {
          ...current.property,
          type: propertyTypeFromEstimate(estimate),
          roofType: current.property.roofType || "flat",
          ownership: current.property.ownership || "owned",
          connectionType: connectionTypeFromEstimate(estimate),
          distributionCompany:
            distributionCompanyFromEstimate(estimate) ||
            current.property.distributionCompany,
          sanctionedLoadKw: calculatorSystemSizeFromEstimate(estimate),
        },
        roof: {
          ...current.roof,
          sizeRange: roofSizeRangeFromArea(roofArea),
          shadow: current.roof.shadow || "partial",
          condition: current.roof.condition || "average",
        },
        calculatorEstimate: estimate,
      };
    });
  }, []);

  const resetDraft = React.useCallback(() => {
    clearDraft(userId);
    setDraft(structuredClone(initialDraft));
  }, [userId]);

  const value = React.useMemo(
    () => ({
      draft,
      updateDraft,
      updateField,
      applyCalculatorEstimate,
      resetDraft,
    }),
    [applyCalculatorEstimate, draft, resetDraft, updateDraft, updateField],
  );

  return (
    <BookingDraftContext.Provider value={value}>
      {children}
    </BookingDraftContext.Provider>
  );
}

export function useBookingDraft() {
  const context = React.useContext(BookingDraftContext);
  if (!context) {
    throw new Error("useBookingDraft must be used inside BookingDraftProvider");
  }
  return context;
}
