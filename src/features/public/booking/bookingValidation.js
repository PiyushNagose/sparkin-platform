// Validates each step's data from the draft and returns { valid: boolean, errors: Record<string, string> }

export function validateStep1(draft) {
  const errors = {};
  if (!draft.contact.fullName.trim())
    errors["contact.fullName"] = "Full name is required";
  if (!draft.contact.phoneNumber.trim())
    errors["contact.phoneNumber"] = "Phone number is required";
  else if (!/^\+?[\d\s\-()]{8,20}$/.test(draft.contact.phoneNumber.trim()))
    errors["contact.phoneNumber"] = "Enter a valid phone number";
  if (
    draft.contact.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contact.email.trim())
  )
    errors["contact.email"] = "Enter a valid email address";
  if (!draft.installationAddress.street.trim())
    errors["installationAddress.street"] = "Street address is required";
  if (!draft.installationAddress.city.trim())
    errors["installationAddress.city"] = "City is required";
  if (!draft.installationAddress.state.trim())
    errors["installationAddress.state"] = "State is required";
  if (!draft.installationAddress.pincode.trim())
    errors["installationAddress.pincode"] = "Pincode is required";
  else if (!/^\d{4,12}$/.test(draft.installationAddress.pincode.trim()))
    errors["installationAddress.pincode"] = "Enter a valid pincode";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStep2(draft) {
  const errors = {};
  if (!draft.property.type) errors["property.type"] = "Select a property type";
  if (!draft.property.ownership)
    errors["property.ownership"] = "Select ownership status";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStep3(draft) {
  const errors = {};
  if (!draft.property.roofType)
    errors["property.roofType"] = "Select a roof type";
  if (!draft.roof.sizeRange) errors["roof.sizeRange"] = "Select a roof size";
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
