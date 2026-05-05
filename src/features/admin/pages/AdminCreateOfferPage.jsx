import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";

function generateCode() {
  return "SPARKIN" + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export default function AdminCreateOfferPage() {
  const navigate = useNavigate();
  const [offerName, setOfferName] = useState("");
  const [couponCode, setCouponCode] = useState("SPARKIN50");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("15");
  const [minOrder, setMinOrder] = useState("8,000");
  const [maxCap, setMaxCap] = useState("6,000");
  const [usageLimit, setUsageLimit] = useState("1");
  const [applicableUsers, setApplicableUsers] = useState(["Leads", "Vendors", "Customers"]);
  const [validityFrom] = useState("Oct 24, 2023");
  const [validityTo] = useState("Nov 24, 2023");

  function removeUser(user) {
    setApplicableUsers((prev) => prev.filter((u) => u !== user));
  }

  const previewTitle = offerName
    ? `Flat ${discountValue}% OFF`
    : "Flat 15% OFF";

  return (
    <AdminPageShell>
      {/* Page header with tab toggle */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-start" }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ color: adminUi.colors.text, fontSize: { xs: "1.9rem", md: "2.3rem" }, fontWeight: 850, lineHeight: 1 }}>
            Offers & Coupons Management
          </Typography>
          <Typography sx={{ mt: 0.7, maxWidth: 520, color: adminUi.colors.muted, fontSize: "0.94rem", lineHeight: 1.55 }}>
            Configure promotional campaigns, discount logic, and vendor incentives to drive solar adoption across the network.
          </Typography>
        </Box>

        {/* Tab toggle */}
        <Stack direction="row" sx={{ border: "1px solid rgba(225,232,241,0.96)", borderRadius: "0.85rem", overflow: "hidden", flexShrink: 0, alignSelf: { xs: "flex-start", md: "center" } }}>
          <Button
            sx={{ px: 2.2, py: 1, borderRadius: 0, bgcolor: "#0E56C8", color: "#FFFFFF", fontSize: "0.84rem", fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#0B49AD" } }}
          >
            Create Offer
          </Button>
          <Button
            onClick={() => navigate("/admin/offers")}
            sx={{ px: 2.2, py: 1, borderRadius: 0, bgcolor: "#FFFFFF", color: adminUi.colors.muted, fontSize: "0.84rem", fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#F4F7FB" } }}
          >
            Offers List
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" }, gap: 2.5, alignItems: "start" }}>
        {/* Left — form panels */}
        <Stack spacing={2.5}>
          {/* Basic Details */}
          <AdminPanel sx={{ p: 2.8 }}>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2.4 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: "0.65rem", bgcolor: "#EEF4FF", display: "grid", placeItems: "center" }}>
                <LocalOfferOutlinedIcon sx={{ color: "#0E56C8", fontSize: "1.1rem" }} />
              </Box>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "1.05rem", fontWeight: 900 }}>Basic Details</Typography>
            </Stack>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <Box>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem", fontWeight: 800, mb: 0.6 }}>Offer Name</Typography>
                <TextField
                  fullWidth size="small"
                  placeholder="e.g. Diwali Solar Bonanza"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem", bgcolor: "#F7F9FC", fontSize: "0.88rem" } }}
                />
              </Box>
              <Box>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem", fontWeight: 800, mb: 0.6 }}>Coupon Code</Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth size="small"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem", bgcolor: "#F7F9FC", fontSize: "0.88rem", fontFamily: "monospace", fontWeight: 800 } }}
                  />
                  <Button
                    onClick={() => setCouponCode(generateCode())}
                    sx={{ minWidth: 90, borderRadius: "0.75rem", bgcolor: "#D7E600", color: "#4D5800", fontSize: "0.72rem", fontWeight: 900, textTransform: "none", flexShrink: 0, "&:hover": { bgcolor: "#C8D800" } }}
                  >
                    GENERATE
                  </Button>
                </Stack>
              </Box>
            </Box>
          </AdminPanel>

          {/* Discount Logic */}
          <AdminPanel sx={{ p: 2.8 }}>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2.4 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: "0.65rem", bgcolor: "#DDF8E7", display: "grid", placeItems: "center" }}>
                <DiscountOutlinedIcon sx={{ color: "#239654", fontSize: "1.1rem" }} />
              </Box>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "1.05rem", fontWeight: 900 }}>Discount Logic</Typography>
            </Stack>

            <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem", fontWeight: 800, mb: 1 }}>Discount Type</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2.4 }}>
              {[["percentage", "Percentage (%)"], ["flat", "Flat (₹)"]].map(([val, label]) => (
                <Button
                  key={val}
                  onClick={() => setDiscountType(val)}
                  sx={{
                    px: 2, py: 0.7, borderRadius: "0.75rem",
                    bgcolor: discountType === val ? "#EEF4FF" : "#F4F7FB",
                    color: discountType === val ? "#0E56C8" : adminUi.colors.muted,
                    border: `1.5px solid ${discountType === val ? "#0E56C8" : "transparent"}`,
                    fontSize: "0.84rem", fontWeight: 800, textTransform: "none",
                    "&:hover": { bgcolor: "#EEF4FF" },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Stack>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
              <Box>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem", fontWeight: 800, mb: 0.6 }}>Discount Value</Typography>
                <TextField
                  fullWidth size="small"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  InputProps={{ endAdornment: <Typography sx={{ color: "#A0ACBA", fontSize: "0.84rem", fontWeight: 700 }}>{discountType === "percentage" ? "%" : "₹"}</Typography> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem", bgcolor: "#F7F9FC", fontSize: "0.88rem" } }}
                />
              </Box>
              <Box>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem", fontWeight: 800, mb: 0.6 }}>Min. Order Value</Typography>
                <TextField
                  fullWidth size="small"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  InputProps={{ startAdornment: <Typography sx={{ color: "#A0ACBA", fontSize: "0.84rem" }}>₹</Typography> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem", bgcolor: "#F7F9FC", fontSize: "0.88rem" } }}
                />
              </Box>
              <Box>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem", fontWeight: 800, mb: 0.6 }}>Max. Discount Cap</Typography>
                <TextField
                  fullWidth size="small"
                  value={maxCap}
                  onChange={(e) => setMaxCap(e.target.value)}
                  InputProps={{ startAdornment: <Typography sx={{ color: "#A0ACBA", fontSize: "0.84rem" }}>₹</Typography> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem", bgcolor: "#F7F9FC", fontSize: "0.88rem" } }}
                />
              </Box>
            </Box>
          </AdminPanel>

          {/* Usage & Validity */}
          <AdminPanel sx={{ p: 2.8 }}>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2.4 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: "0.65rem", bgcolor: "#FFF4D6", display: "grid", placeItems: "center" }}>
                <CalendarTodayOutlinedIcon sx={{ color: "#D97706", fontSize: "1.1rem" }} />
              </Box>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "1.05rem", fontWeight: 900 }}>Usage & Validity</Typography>
            </Stack>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <Box>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem", fontWeight: 800, mb: 0.6 }}>Usage Limit (per user)</Typography>
                <TextField
                  fullWidth size="small"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem", bgcolor: "#F7F9FC", fontSize: "0.88rem" } }}
                />

                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem", fontWeight: 800, mt: 2, mb: 0.8 }}>Applicable Users</Typography>
                <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                  {applicableUsers.map((user) => (
                    <Chip
                      key={user}
                      label={user}
                      onDelete={() => removeUser(user)}
                      size="small"
                      sx={{ bgcolor: "#EEF4FF", color: "#0E56C8", fontWeight: 800, fontSize: "0.76rem", "& .MuiChip-deleteIcon": { color: "#0E56C8", fontSize: "0.9rem" } }}
                    />
                  ))}
                  <Chip
                    label="+"
                    size="small"
                    onClick={() => {}}
                    sx={{ bgcolor: "#F4F7FB", color: adminUi.colors.muted, fontWeight: 800, fontSize: "0.76rem", cursor: "pointer" }}
                  />
                </Stack>
              </Box>

              <Box>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem", fontWeight: 800, mb: 0.6 }}>Validity Period</Typography>
                <Box sx={{ p: 1.4, borderRadius: "0.75rem", bgcolor: "#F7F9FC", border: "1px solid rgba(225,232,241,0.96)" }}>
                  <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 700, mb: 1 }}>
                    From: {validityFrom} To: {validityTo}
                  </Typography>
                  {/* Simple visual date range bar */}
                  <Box sx={{ height: 8, borderRadius: 9, bgcolor: "#E5EAF1", overflow: "hidden", mb: 1 }}>
                    <Box sx={{ height: "100%", width: "60%", borderRadius: 9, bgcolor: "#0E56C8", ml: "20%" }} />
                  </Box>
                  <Button
                    size="small"
                    startIcon={<CalendarTodayOutlinedIcon sx={{ fontSize: "0.8rem" }} />}
                    sx={{ color: adminUi.colors.muted, fontSize: "0.74rem", fontWeight: 700, textTransform: "none", px: 0 }}
                  >
                    Open Date Range Picker
                  </Button>
                </Box>
              </Box>
            </Box>
          </AdminPanel>
        </Stack>

        {/* Right column */}
        <Stack spacing={2}>
          {/* Live preview card */}
          <Box sx={{ p: 2.4, borderRadius: "1.2rem", bgcolor: "#0E56C8", backgroundImage: "linear-gradient(135deg, #0E56C8 0%, #1A3A8F 100%)", color: "#FFFFFF" }}>
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ px: 1, py: 0.3, borderRadius: "999px", bgcolor: "#D7E600", color: "#4D5800", fontSize: "0.58rem", fontWeight: 900, display: "inline-flex" }}>
                NEW CAMPAIGN
              </Box>
            </Box>
            <Typography sx={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1.1, mb: 0.6 }}>{previewTitle}</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.82rem", lineHeight: 1.5, mb: 2 }}>
              Empowering residential solar setups with exclusive Diwali benefits.
            </Typography>
            <Box sx={{ p: 1.2, borderRadius: "0.75rem", bgcolor: "rgba(255,255,255,0.12)", display: "inline-flex", alignItems: "center", gap: 1 }}>
              <Box>
                <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.58rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>Use Code</Typography>
                <Typography sx={{ color: "#FFFFFF", fontSize: "1rem", fontWeight: 900, fontFamily: "monospace" }}>{couponCode}</Typography>
              </Box>
              <IconButton size="small" sx={{ color: "rgba(255,255,255,0.7)", p: 0.4 }}>
                <ContentCopyOutlinedIcon sx={{ fontSize: "0.9rem" }} />
              </IconButton>
            </Box>
          </Box>

          {/* Offer Summary */}
          <AdminPanel sx={{ p: 2.4 }}>
            <Typography sx={{ color: adminUi.colors.text, fontSize: "1rem", fontWeight: 900, mb: 1.8 }}>Offer Summary</Typography>
            <Stack spacing={1.2}>
              {[
                { label: "Campaign Type", value: "Public Promo" },
                { label: "Target Users", value: applicableUsers.join(", ") || "None" },
              ].map(({ label, value }) => (
                <Stack key={label} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.8rem" }}>{label}</Typography>
                  <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 800 }}>{value}</Typography>
                </Stack>
              ))}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.8rem" }}>Status</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#239654" }} />
                  <Typography sx={{ color: "#239654", fontSize: "0.82rem", fontWeight: 800 }}>Ready to Launch</Typography>
                </Stack>
              </Stack>
            </Stack>

            <Stack spacing={1.2} sx={{ mt: 2.5 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<RocketLaunchOutlinedIcon />}
                sx={{ minHeight: 48, borderRadius: "0.9rem", bgcolor: "#0E56C8", fontSize: "0.88rem", fontWeight: 900, textTransform: "none", boxShadow: "0 8px 20px rgba(14,86,200,0.22)", "&:hover": { bgcolor: "#0B49AD" } }}
              >
                Create Promotional Offer
              </Button>
              <Button
                fullWidth
                sx={{ minHeight: 44, borderRadius: "0.9rem", bgcolor: "#F4F7FB", color: adminUi.colors.text, fontSize: "0.88rem", fontWeight: 800, textTransform: "none", border: "1px solid rgba(225,232,241,0.96)", "&:hover": { bgcolor: "#E5EAF1" } }}
              >
                Save as Draft
              </Button>
              <Button
                fullWidth
                sx={{ minHeight: 44, borderRadius: "0.9rem", color: adminUi.colors.muted, fontSize: "0.88rem", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#FFF1F1", color: "#D94444" } }}
              >
                Cancel & Discard
              </Button>
            </Stack>
          </AdminPanel>

          {/* Growth tip */}
          <AdminPanel sx={{ p: 2, bgcolor: "#F0FAF4", border: "1px solid #C6EDD6" }}>
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <TipsAndUpdatesOutlinedIcon sx={{ color: "#239654", fontSize: "1.1rem", mt: 0.1, flexShrink: 0 }} />
              <Box>
                <Typography sx={{ color: "#1A6B3C", fontSize: "0.78rem", fontWeight: 900, mb: 0.3 }}>Growth Tip</Typography>
                <Typography sx={{ color: "#2D7A4F", fontSize: "0.76rem", lineHeight: 1.55 }}>
                  Personalized vendor codes typically see a 24% higher conversion rate than generic site-wide codes.
                </Typography>
              </Box>
            </Stack>
          </AdminPanel>
        </Stack>
      </Box>
    </AdminPageShell>
  );
}
