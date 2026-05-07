import * as React from "react";
import { useAuth } from "@/features/auth/AuthProvider";

const STORAGE_KEY = "sparkin.bookingDraft";

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
  calculatorEstimate: null,
  notes: "",
  specialInstructions: "",
};

function stateLabelFromEstimate(estimate) {
  return (
    estimate?.serviceability?.stateName ||
    String(estimate?.input?.state || "")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
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
  if (connectionType === "three_phase" || connectionType === "ht" || connectionType === "lt") {
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

function defaultRoofTypeFromEstimate(estimate) {
  return estimate?.input?.propertyType === "commercial" ? "flat" : "flat";
}

function defaultOwnershipFromEstimate() {
  return "owned";
}

function defaultShadowFromEstimate() {
  return "partial";
}

function defaultRoofConditionFromEstimate() {
  return "average";
}

const BookingDraftContext = React.createContext(null);

function readDraft() {
  const value = window.localStorage.getItem(STORAGE_KEY);

  if (!value) {
    return initialDraft;
  }

  try {
    return { ...initialDraft, ...JSON.parse(value) };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return initialDraft;
  }
}

export function BookingDraftProvider({ children }) {
  const { user } = useAuth();
  const [draft, setDraft] = React.useState(readDraft);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    setDraft((current) => ({
      ...current,
      contact: {
        ...current.contact,
        fullName: current.contact.fullName || user.fullName || "",
        email: current.contact.email || user.email || "",
      },
    }));
  }, [user]);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const updateDraft = React.useCallback((section, values) => {
    setDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        ...values,
      },
    }));
  }, []);

  const updateField = React.useCallback((field, value) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }, []);

  const applyCalculatorEstimate = React.useCallback((estimate) => {
    setDraft((current) => {
      const roofArea =
        estimate?.input?.roofAreaSqFt ||
        estimate?.system?.requiredRoofAreaSqFt ||
        null;

      return {
        ...current,
        installationAddress: {
          ...current.installationAddress,
          city: estimate?.input?.city || current.installationAddress.city,
          state: stateLabelFromEstimate(estimate) || current.installationAddress.state,
          pincode: estimate?.input?.pincode || current.installationAddress.pincode,
        },
        property: {
          ...current.property,
          type: propertyTypeFromEstimate(estimate),
          roofType: current.property.roofType || defaultRoofTypeFromEstimate(estimate),
          ownership: current.property.ownership || defaultOwnershipFromEstimate(estimate),
          connectionType: connectionTypeFromEstimate(estimate),
          distributionCompany:
            distributionCompanyFromEstimate(estimate) ||
            current.property.distributionCompany,
          sanctionedLoadKw: calculatorSystemSizeFromEstimate(estimate),
        },
        roof: {
          ...current.roof,
          sizeRange: roofSizeRangeFromArea(roofArea),
          shadow: current.roof.shadow || defaultShadowFromEstimate(estimate),
          condition: current.roof.condition || defaultRoofConditionFromEstimate(estimate),
        },
        calculatorEstimate: estimate,
      };
    });
  }, []);

  const resetDraft = React.useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setDraft(initialDraft);
  }, []);

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

  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft() {
  const context = React.useContext(BookingDraftContext);

  if (!context) {
    throw new Error("useBookingDraft must be used inside BookingDraftProvider");
  }

  return context;
}
