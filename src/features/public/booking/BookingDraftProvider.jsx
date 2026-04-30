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
    preferredTimeSlot: "morning",
  },
  property: {
    type: "independent_house",
    roofType: "flat",
    ownership: "owned",
    distributionCompany: "",
    connectionType: "single_phase",
    consumerNumber: "",
    sanctionedLoadKw: "",
  },
  roof: {
    sizeRange: "500_1000",
    shadow: "none",
    condition: "average",
  },
  notes: "",
  specialInstructions: "",
};

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

  const resetDraft = React.useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setDraft(initialDraft);
  }, []);

  const value = React.useMemo(
    () => ({
      draft,
      updateDraft,
      updateField,
      resetDraft,
    }),
    [draft, resetDraft, updateDraft, updateField],
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
