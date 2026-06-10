// Validates each step's data from the draft and returns { valid: boolean, errors: Record<string, string> }

export function validateStep1(draft) {
  const errors = {};

  // ── Contact ────────────────────────────────────────────────────────────────
  const fullName = draft.contact.fullName.trim();
  if (!fullName) errors["contact.fullName"] = "Full name is required";
  else if (fullName.length < 2)
    errors["contact.fullName"] = "Full name must be at least 2 characters";
  else if (fullName.length > 120)
    errors["contact.fullName"] = "Full name is too long";

  const phone = draft.contact.phoneNumber.trim();
  if (!phone) errors["contact.phoneNumber"] = "Phone number is required";
  else if (!/^\d{10}$/.test(phone))
    errors["contact.phoneNumber"] = "Enter a valid 10-digit mobile number";

  const email = draft.contact.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors["contact.email"] = "Enter a valid email address";

  // ── Installation Address ───────────────────────────────────────────────────
  const street = draft.installationAddress.street.trim();
  if (!street)
    errors["installationAddress.street"] = "Street address is required";
  else if (street.length < 5)
    errors["installationAddress.street"] =
      "Please enter a complete street address";

  const city = draft.installationAddress.city.trim();
  if (!city) errors["installationAddress.city"] = "Please select a city";

  const state = draft.installationAddress.state.trim();
  if (!state) errors["installationAddress.state"] = "State is required";

  const pincode = draft.installationAddress.pincode.trim();
  if (!pincode) errors["installationAddress.pincode"] = "Pincode is required";
  else if (!/^\d{6}$/.test(pincode))
    errors["installationAddress.pincode"] = "Enter a valid 6-digit pincode";

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStep2(draft) {
  const errors = {};

  if (!draft.property.type) errors["property.type"] = "Select a property type";

  if (!draft.property.ownership)
    errors["property.ownership"] = "Select ownership status";

  // Only require distribution company if one was actually provided
  // (it may be empty when admin hasn't configured any for this state)
  // We never block progress when none are available — admin message handles that UX
  if (
    draft.property.distributionCompany === undefined ||
    draft.property.distributionCompany === null
  ) {
    // skip — field was never shown
  }

  if (!draft.property.connectionType)
    errors["property.connectionType"] = "Select a connection type";

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStep3(draft) {
  const errors = {};

  if (!draft.property.roofType)
    errors["property.roofType"] = "Select a roof type";

  if (!draft.roof.sizeRange)
    errors["roof.sizeRange"] = "Select a roof size range";

  if (!draft.roof.shadow) errors["roof.shadow"] = "Select shadow availability";

  if (!draft.roof.condition) errors["roof.condition"] = "Select roof condition";

  return { valid: Object.keys(errors).length === 0, errors };
}

export function isStep1Complete(draft) {
  return validateStep1(draft).valid;
}

export function isStep2Complete(draft) {
  return validateStep2(draft).valid;
}

export function isStep3Complete(draft) {
  return validateStep3(draft).valid;
}
