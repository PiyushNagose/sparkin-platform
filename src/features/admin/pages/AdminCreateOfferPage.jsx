import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { offersApi } from "@/features/admin/api/offersApi";
import { useScrollToError } from "@/shared/hooks/useScrollToError";

// ─── constants ────────────────────────────────────────────────────────────────

const USER_OPTIONS = ["Leads", "Vendors", "Customers", "All Users"];

const USER_KEY_MAP = {
  Leads: "leads",
  Vendors: "vendors",
  Customers: "customers",
  "All Users": "allUsers",
};

const EMPTY_FORM = {
  name: "",
  description: "",
  couponCode: "",
  discountType: "percentage",
  discountValue: "",
  minOrderValue: "",
  maxDiscountCap: "",
  usageLimitPerUser: "1",
  totalUsageLimit: "",
  applicableUsers: {
    leads: true,
    customers: true,
    vendors: false,
    allUsers: false,
  },
  validFrom: "",
  validTo: "",
  campaignType: "public",
  tags: [],
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function getPreviewTitle(form) {
  if (!form.discountValue) return "Flat 15% OFF";
  if (form.discountType === "percentage")
    return `Flat ${form.discountValue}% OFF`;
  if (form.discountType === "flat")
    return `₹${Number(form.discountValue).toLocaleString("en-IN")} OFF`;
  return `₹${Number(form.discountValue).toLocaleString("en-IN")} CREDIT`;
}

function getApplicableUsersLabel(applicableUsers) {
  if (applicableUsers.allUsers) return "All Users";
  const parts = [];
  if (applicableUsers.leads) parts.push("Leads");
  if (applicableUsers.customers) parts.push("Customers");
  if (applicableUsers.vendors) parts.push("Vendors");
  return parts.join(", ") || "None";
}

function getSelectedUserChips(applicableUsers) {
  return USER_OPTIONS.filter((u) => applicableUsers[USER_KEY_MAP[u]]);
}

function getUnselectedUserOptions(applicableUsers) {
  return USER_OPTIONS.filter((u) => !applicableUsers[USER_KEY_MAP[u]]);
}

function validateForm(form) {
  const errors = [];
  if (!form.name.trim() || form.name.trim().length < 2)
    errors.push("Offer name must be at least 2 characters");
  if (!form.couponCode.trim() || form.couponCode.trim().length < 3)
    errors.push("Coupon code must be at least 3 characters");
  if (!/^[A-Z0-9]+$/i.test(form.couponCode.trim()))
    errors.push("Coupon code can only contain letters and numbers");
  if (!form.discountValue || Number(form.discountValue) <= 0)
    errors.push("Discount value must be positive");
  if (form.discountType === "percentage" && Number(form.discountValue) > 100)
    errors.push("Percentage cannot exceed 100");
  if (!form.validFrom) errors.push("Valid from date is required");
  if (!form.validTo) errors.push("Valid to date is required");
  if (
    form.validFrom &&
    form.validTo &&
    new Date(form.validFrom) >= new Date(form.validTo)
  )
    errors.push("Valid from must be before valid to");
  const hasUser = Object.values(form.applicableUsers).some(Boolean);
  if (!hasUser) errors.push("Select at least one applicable user group");
  return errors;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function FieldLabel({ children, required }) {
  return (
    <Typography
      sx={{
        color: adminUi.colors.muted,
        fontSize: "0.78rem",
        fontWeight: 800,
        mb: 0.6,
      }}
    >
      {children}
      {required ? " *" : ""}
    </Typography>
  );
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.75rem",
    bgcolor: "#F7F9FC",
    fontSize: "0.88rem",
  },
};

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminCreateOfferPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formError, setFormError] = useState("");
  const errorRef = useScrollToError(formError);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleUser(userLabel) {
    const key = USER_KEY_MAP[userLabel];
    setForm((f) => ({
      ...f,
      applicableUsers: { ...f.applicableUsers, [key]: !f.applicableUsers[key] },
    }));
  }

  async function handleGenerateCode() {
    setIsGenerating(true);
    try {
      const code = await offersApi.generateCode();
      update("couponCode", code);
    } catch {
      setToast({
        open: true,
        message: "Could not generate code. Try again.",
        severity: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function copyCode() {
    if (!form.couponCode) return;
    navigator.clipboard.writeText(form.couponCode).catch(() => {});
    setToast({
      open: true,
      message: `Code "${form.couponCode}" copied.`,
      severity: "success",
    });
  }

  async function handleSubmit(saveAsDraft = false) {
    if (!saveAsDraft) {
      const errors = validateForm(form);
      if (errors.length) {
        setFormError(errors[0]);
        return;
      }
    }
    setFormError("");
    if (saveAsDraft) setIsSavingDraft(true);
    else setIsSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        couponCode: form.couponCode.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
        maxDiscountCap: form.maxDiscountCap
          ? Number(form.maxDiscountCap)
          : null,
        usageLimitPerUser: form.usageLimitPerUser
          ? Number(form.usageLimitPerUser)
          : 1,
        totalUsageLimit: form.totalUsageLimit
          ? Number(form.totalUsageLimit)
          : null,
        applicableUsers: form.applicableUsers,
        validFrom: form.validFrom
          ? new Date(form.validFrom).toISOString()
          : new Date().toISOString(),
        validTo: form.validTo
          ? new Date(form.validTo).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        campaignType: form.campaignType,
        saveAsDraft,
      };
      await offersApi.create(payload);
      setToast({
        open: true,
        message: saveAsDraft ? "Draft saved." : "Offer created successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/offers"), 1200);
    } catch (err) {
      setFormError(err?.response?.data?.message || "Could not create offer.");
    } finally {
      setIsSubmitting(false);
      setIsSavingDraft(false);
    }
  }

  const previewTitle = getPreviewTitle(form);
  const selectedUsers = getSelectedUserChips(form.applicableUsers);
  const unselectedUsers = getUnselectedUserOptions(form.applicableUsers);

  return (
    <AdminPageShell>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "flex-start" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            sx={{
              color: adminUi.colors.text,
              fontSize: { xs: "1.9rem", md: "2.3rem" },
              fontWeight: 850,
              lineHeight: 1,
            }}
          >
            Offers & Coupons Management
          </Typography>
          <Typography
            sx={{
              mt: 0.7,
              maxWidth: 520,
              color: adminUi.colors.muted,
              fontSize: "0.94rem",
              lineHeight: 1.55,
            }}
          >
            Configure promotional campaigns, discount logic, and vendor
            incentives to drive solar adoption across the network.
          </Typography>
        </Box>
        <Stack
          direction="row"
          sx={{
            border: "1px solid rgba(225,232,241,0.96)",
            borderRadius: "0.85rem",
            overflow: "hidden",
            flexShrink: 0,
            alignSelf: { xs: "flex-start", md: "center" },
          }}
        >
          <Button
            sx={{
              px: 2.2,
              py: 1,
              borderRadius: 0,
              bgcolor: "#0E56C8",
              color: "#FFFFFF",
              fontSize: "0.84rem",
              fontWeight: 800,
              textTransform: "none",
              "&:hover": { bgcolor: "#0B49AD" },
            }}
          >
            Create Offer
          </Button>
          <Button
            onClick={() => navigate("/admin/offers")}
            sx={{
              px: 2.2,
              py: 1,
              borderRadius: 0,
              bgcolor: "#FFFFFF",
              color: adminUi.colors.muted,
              fontSize: "0.84rem",
              fontWeight: 800,
              textTransform: "none",
              "&:hover": { bgcolor: "#F4F7FB" },
            }}
          >
            Offers List
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" },
          gap: 2.5,
          alignItems: "start",
        }}
      >
        {/* Left — form panels */}
        <Stack spacing={2.5}>
          {/* Basic Details */}
          <AdminPanel sx={{ p: 2.8 }}>
            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{ mb: 2.4 }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "0.65rem",
                  bgcolor: "#EEF4FF",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <LocalOfferOutlinedIcon
                  sx={{ color: "#0E56C8", fontSize: "1.1rem" }}
                />
              </Box>
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "1.05rem",
                  fontWeight: 900,
                }}
              >
                Basic Details
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <FieldLabel required>Offer Name</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g. Diwali Solar Bonanza"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  sx={inputSx}
                />
              </Box>
              <Box>
                <FieldLabel required>Coupon Code</FieldLabel>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    value={form.couponCode}
                    onChange={(e) =>
                      update("couponCode", e.target.value.toUpperCase())
                    }
                    inputProps={{
                      style: {
                        fontFamily: "monospace",
                        fontWeight: 800,
                        textTransform: "uppercase",
                      },
                    }}
                    sx={inputSx}
                  />
                  <Button
                    onClick={handleGenerateCode}
                    disabled={isGenerating}
                    startIcon={
                      isGenerating ? null : (
                        <AutorenewRoundedIcon
                          sx={{ fontSize: "0.85rem !important" }}
                        />
                      )
                    }
                    sx={{
                      minWidth: 100,
                      borderRadius: "0.75rem",
                      bgcolor: "#D7E600",
                      color: "#4D5800",
                      fontSize: "0.72rem",
                      fontWeight: 900,
                      textTransform: "none",
                      flexShrink: 0,
                      "&:hover": { bgcolor: "#C8D800" },
                    }}
                  >
                    {isGenerating ? "…" : "GENERATE"}
                  </Button>
                </Stack>
              </Box>
              <Box sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}>
                <FieldLabel>Description (optional)</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Brief description of this offer"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  sx={inputSx}
                />
              </Box>
            </Box>
          </AdminPanel>

          {/* Discount Logic */}
          <AdminPanel sx={{ p: 2.8 }}>
            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{ mb: 2.4 }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "0.65rem",
                  bgcolor: "#DDF8E7",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <DiscountOutlinedIcon
                  sx={{ color: "#239654", fontSize: "1.1rem" }}
                />
              </Box>
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "1.05rem",
                  fontWeight: 900,
                }}
              >
                Discount Logic
              </Typography>
            </Stack>

            <FieldLabel>Discount Type</FieldLabel>
            <Stack direction="row" spacing={1} sx={{ mb: 2.4 }}>
              {[
                ["percentage", "Percentage (%)"],
                ["flat", "Flat (₹)"],
                ["credit", "Credit (₹)"],
              ].map(([val, label]) => (
                <Button
                  key={val}
                  onClick={() => update("discountType", val)}
                  sx={{
                    px: 2,
                    py: 0.7,
                    borderRadius: "0.75rem",
                    bgcolor: form.discountType === val ? "#EEF4FF" : "#F4F7FB",
                    color:
                      form.discountType === val
                        ? "#0E56C8"
                        : adminUi.colors.muted,
                    border: `1.5px solid ${form.discountType === val ? "#0E56C8" : "transparent"}`,
                    fontSize: "0.84rem",
                    fontWeight: 800,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#EEF4FF" },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <FieldLabel required>Discount Value</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => update("discountValue", e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography
                          sx={{
                            color: "#A0ACBA",
                            fontSize: "0.84rem",
                            fontWeight: 700,
                          }}
                        >
                          {form.discountType === "percentage" ? "%" : "₹"}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>
              <Box>
                <FieldLabel>Min. Order Value</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={form.minOrderValue}
                  onChange={(e) => update("minOrderValue", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ color: "#A0ACBA", fontSize: "0.84rem" }}
                        >
                          ₹
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>
              <Box>
                <FieldLabel>Max. Discount Cap</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={form.maxDiscountCap}
                  onChange={(e) => update("maxDiscountCap", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ color: "#A0ACBA", fontSize: "0.84rem" }}
                        >
                          ₹
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>
            </Box>
          </AdminPanel>

          {/* Usage & Validity */}
          <AdminPanel sx={{ p: 2.8 }}>
            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{ mb: 2.4 }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "0.65rem",
                  bgcolor: "#FFF4D6",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <CalendarTodayOutlinedIcon
                  sx={{ color: "#D97706", fontSize: "1.1rem" }}
                />
              </Box>
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "1.05rem",
                  fontWeight: 900,
                }}
              >
                Usage & Validity
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <FieldLabel>Usage Limit (per user)</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={form.usageLimitPerUser}
                  onChange={(e) => update("usageLimitPerUser", e.target.value)}
                  sx={inputSx}
                />

                <FieldLabel>Total Usage Limit</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="Leave blank for unlimited"
                  value={form.totalUsageLimit}
                  onChange={(e) => update("totalUsageLimit", e.target.value)}
                  sx={inputSx}
                />

                <Box sx={{ mt: 2 }}>
                  <FieldLabel>Applicable Users</FieldLabel>
                  <Stack
                    direction="row"
                    spacing={0.8}
                    flexWrap="wrap"
                    useFlexGap
                  >
                    {selectedUsers.map((user) => (
                      <Chip
                        key={user}
                        label={`${user} ×`}
                        size="small"
                        onClick={() => toggleUser(user)}
                        sx={{
                          bgcolor: "#EEF4FF",
                          color: "#0E56C8",
                          fontWeight: 800,
                          fontSize: "0.76rem",
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#DCE9FF" },
                        }}
                      />
                    ))}
                    {unselectedUsers.map((user) => (
                      <Chip
                        key={user}
                        label={`${user} +`}
                        size="small"
                        onClick={() => toggleUser(user)}
                        sx={{
                          bgcolor: "#F4F7FB",
                          color: adminUi.colors.muted,
                          fontWeight: 700,
                          fontSize: "0.76rem",
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#EEF4FF", color: "#0E56C8" },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>

              <Box>
                <FieldLabel required>Valid From</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={form.validFrom}
                  onChange={(e) => update("validFrom", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={inputSx}
                />

                <Box sx={{ mt: 2 }}>
                  <FieldLabel required>Valid To</FieldLabel>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    value={form.validTo}
                    onChange={(e) => update("validTo", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={inputSx}
                  />
                </Box>

                {form.validFrom && form.validTo && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.4,
                      borderRadius: "0.75rem",
                      bgcolor: "#F7F9FC",
                      border: "1px solid rgba(225,232,241,0.96)",
                    }}
                  >
                    <Typography
                      sx={{
                        color: adminUi.colors.text,
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        mb: 0.8,
                      }}
                    >
                      From:{" "}
                      {new Date(form.validFrom).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      &nbsp;→&nbsp; To:{" "}
                      {new Date(form.validTo).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>
                    <Box
                      sx={{
                        height: 8,
                        borderRadius: 9,
                        bgcolor: "#E5EAF1",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: "60%",
                          borderRadius: 9,
                          bgcolor: "#0E56C8",
                          ml: "20%",
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            {formError ? (
              <Alert
                ref={errorRef}
                severity="error"
                sx={{ mt: 2, borderRadius: "0.75rem" }}
                icon={<WarningAmberRoundedIcon />}
              >
                {formError}
              </Alert>
            ) : null}
          </AdminPanel>
        </Stack>

        {/* Right column */}
        <Stack spacing={2} sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}>
          {/* Live preview card */}
          <Box
            sx={{
              p: 2.4,
              borderRadius: "1.2rem",
              bgcolor: "#0E56C8",
              backgroundImage:
                "linear-gradient(135deg, #0E56C8 0%, #1A3A8F 100%)",
              color: "#FFFFFF",
            }}
          >
            <Box sx={{ mb: 1.5 }}>
              <Box
                sx={{
                  px: 1,
                  py: 0.3,
                  borderRadius: "999px",
                  bgcolor: "#D7E600",
                  color: "#4D5800",
                  fontSize: "0.58rem",
                  fontWeight: 900,
                  display: "inline-flex",
                }}
              >
                NEW CAMPAIGN
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: 900,
                lineHeight: 1.1,
                mb: 0.6,
              }}
            >
              {previewTitle}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.82rem",
                lineHeight: 1.5,
                mb: 2,
              }}
            >
              {form.description ||
                "Empowering residential solar setups with exclusive benefits."}
            </Typography>
            {form.couponCode && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  p: 1.2,
                  borderRadius: "0.75rem",
                  bgcolor: "rgba(255,255,255,0.12)",
                  display: "inline-flex",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.58rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Use Code
                  </Typography>
                  <Typography
                    sx={{
                      color: "#FFFFFF",
                      fontSize: "1rem",
                      fontWeight: 900,
                      fontFamily: "monospace",
                    }}
                  >
                    {form.couponCode}
                  </Typography>
                </Box>
                <Tooltip title="Copy code">
                  <IconButton
                    size="small"
                    onClick={copyCode}
                    sx={{ color: "rgba(255,255,255,0.7)", p: 0.4 }}
                  >
                    <ContentCopyOutlinedIcon sx={{ fontSize: "0.9rem" }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Box>

          {/* Offer Summary */}
          <AdminPanel sx={{ p: 2.4 }}>
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "1rem",
                fontWeight: 900,
                mb: 1.8,
              }}
            >
              Offer Summary
            </Typography>
            <Stack spacing={1.2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{ color: adminUi.colors.muted, fontSize: "0.8rem" }}
                >
                  Campaign Type
                </Typography>
                <Typography
                  sx={{
                    color: adminUi.colors.text,
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    textTransform: "capitalize",
                  }}
                >
                  {form.campaignType} Promo
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{ color: adminUi.colors.muted, fontSize: "0.8rem" }}
                >
                  Target Users
                </Typography>
                <Typography
                  sx={{
                    color: adminUi.colors.text,
                    fontSize: "0.82rem",
                    fontWeight: 800,
                  }}
                >
                  {getApplicableUsersLabel(form.applicableUsers)}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{ color: adminUi.colors.muted, fontSize: "0.8rem" }}
                >
                  Discount
                </Typography>
                <Typography
                  sx={{
                    color: "#239654",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                  }}
                >
                  {previewTitle}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{ color: adminUi.colors.muted, fontSize: "0.8rem" }}
                >
                  Status
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#239654",
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#239654",
                      fontSize: "0.82rem",
                      fontWeight: 800,
                    }}
                  >
                    Ready to Launch
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Divider sx={{ my: 2, borderColor: "rgba(225,232,241,0.96)" }} />

            <Stack spacing={1.2}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<RocketLaunchOutlinedIcon />}
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting || isSavingDraft}
                sx={{
                  minHeight: 48,
                  borderRadius: "0.9rem",
                  bgcolor: "#0E56C8",
                  fontSize: "0.88rem",
                  fontWeight: 900,
                  textTransform: "none",
                  boxShadow: "0 8px 20px rgba(14,86,200,0.22)",
                  "&:hover": { bgcolor: "#0B49AD" },
                }}
              >
                {isSubmitting ? "Creating…" : "Create Promotional Offer"}
              </Button>
              <Button
                fullWidth
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting || isSavingDraft}
                sx={{
                  minHeight: 44,
                  borderRadius: "0.9rem",
                  bgcolor: "#F4F7FB",
                  color: adminUi.colors.text,
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  textTransform: "none",
                  border: "1px solid rgba(225,232,241,0.96)",
                  "&:hover": { bgcolor: "#E5EAF1" },
                }}
              >
                {isSavingDraft ? "Saving…" : "Save as Draft"}
              </Button>
              <Button
                fullWidth
                onClick={() => navigate("/admin/offers")}
                disabled={isSubmitting || isSavingDraft}
                sx={{
                  minHeight: 44,
                  borderRadius: "0.9rem",
                  color: adminUi.colors.muted,
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#FFF1F1", color: "#D94444" },
                }}
              >
                Cancel & Discard
              </Button>
            </Stack>
          </AdminPanel>

          {/* Growth tip */}
          <AdminPanel
            sx={{ p: 2, bgcolor: "#F0FAF4", border: "1px solid #C6EDD6" }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <TipsAndUpdatesOutlinedIcon
                sx={{
                  color: "#239654",
                  fontSize: "1.1rem",
                  mt: 0.1,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography
                  sx={{
                    color: "#1A6B3C",
                    fontSize: "0.78rem",
                    fontWeight: 900,
                    mb: 0.3,
                  }}
                >
                  Growth Tip
                </Typography>
                <Typography
                  sx={{
                    color: "#2D7A4F",
                    fontSize: "0.76rem",
                    lineHeight: 1.55,
                  }}
                >
                  Personalized vendor codes typically see a 24% higher
                  conversion rate than generic site-wide codes.
                </Typography>
              </Box>
            </Stack>
          </AdminPanel>
        </Stack>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{
            borderRadius: "0.9rem",
            fontWeight: 700,
            boxShadow: "0 12px 28px rgba(16,29,51,0.14)",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </AdminPageShell>
  );
}
