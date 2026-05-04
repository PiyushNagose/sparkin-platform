import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { useState } from "react";
import {
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import solarBannerImg from "@/shared/assets/images/public/vendors/tata-power-spec-placeholder.png";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.85rem",
    bgcolor: "#F7F9FC",
    fontSize: "0.92rem",
  },
};

function SectionRow({ title, description, children }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
        gap: { xs: 2, md: 4 },
        alignItems: "start",
      }}
    >
      <Box>
        <Typography sx={{ color: adminUi.colors.text, fontSize: "1.05rem", fontWeight: 900 }}>{title}</Typography>
        <Typography sx={{ mt: 0.6, color: adminUi.colors.muted, fontSize: "0.82rem", lineHeight: 1.65 }}>{description}</Typography>
      </Box>
      <AdminPanel sx={{ p: { xs: 2, md: 2.4 } }}>{children}</AdminPanel>
    </Box>
  );
}

function Divider() {
  return <Box sx={{ borderTop: "1px solid rgba(225,232,241,0.96)", my: { xs: 3, md: 3.5 } }} />;
}

export default function AdminSettingsPage() {
  const [pricing, setPricing] = useState({ standardCost: "55,000", minBid: "45,000", maxBid: "85,000" });
  const [bidding, setBidding] = useState({ window: "48" });
  const [subsidy, setSubsidy] = useState({ centralPct: "40", maxAmount: "78,000" });
  const [states, setStates] = useState([
    { state: "Andhra Pradesh", rate: "7.50" },
    { state: "Telangana", rate: "6.20" },
    { state: "Karnataka", rate: "8.10" },
  ]);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function updateRate(index, value) {
    setStates((prev) => prev.map((s, i) => (i === index ? { ...s, rate: value } : s)));
  }

  function addState() {
    setStates((prev) => [...prev, { state: "", rate: "" }]);
  }

  function removeState(index) {
    setStates((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Platform Settings"
        subtitle="Configure global thresholds, subsidies, and regional parameters for the Sparkin ecosystem."
      />

      {/* System Pricing Thresholds */}
      <SectionRow
        title="System Pricing Thresholds"
        description="Establish the core financial baseline for solar installations. These values act as guardrails for all vendor bids."
      >
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <Box>
            <Typography sx={{ mb: 0.6, color: "#8B97A8", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Standard Cost Per kW (₹)
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={pricing.standardCost}
              onChange={(e) => setPricing((p) => ({ ...p, standardCost: e.target.value }))}
              sx={inputSx}
            />
          </Box>
          <Box>
            <Typography sx={{ mb: 0.6, color: "#8B97A8", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Minimum Bid Amount (₹)
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={pricing.minBid}
              onChange={(e) => setPricing((p) => ({ ...p, minBid: e.target.value }))}
              sx={inputSx}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}>
            <Typography sx={{ mb: 0.6, color: "#8B97A8", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Maximum Bid Amount (₹)
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={pricing.maxBid}
              onChange={(e) => setPricing((p) => ({ ...p, maxBid: e.target.value }))}
              sx={inputSx}
            />
            <Typography sx={{ mt: 0.8, color: "#8B97A8", fontSize: "0.72rem" }}>
              Bids exceeding this amount will be automatically flagged for review.
            </Typography>
          </Box>
        </Box>
      </SectionRow>

      <Divider />

      {/* Bidding Rules */}
      <SectionRow
        title="Bidding Rules"
        description="Define the duration and automation logic for the auction process to ensure fair competition."
      >
        <Box>
          <Typography sx={{ mb: 0.6, color: "#8B97A8", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Bidding Window (Hours)
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <TextField
              size="small"
              value={bidding.window}
              onChange={(e) => setBidding({ window: e.target.value })}
              sx={{ ...inputSx, width: 120 }}
            />
            <Typography sx={{ color: "#8B97A8", fontSize: "0.88rem", fontWeight: 700 }}>HRS</Typography>
          </Stack>
        </Box>
      </SectionRow>

      <Divider />

      {/* Subsidy Configuration */}
      <SectionRow
        title="Subsidy Configuration"
        description="Adjust the central government financial assistance parameters for residential rooftop solar."
      >
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <Box>
            <Typography sx={{ mb: 0.6, color: "#8B97A8", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Central Subsidy Percentage (%)
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                size="small"
                value={subsidy.centralPct}
                onChange={(e) => setSubsidy((s) => ({ ...s, centralPct: e.target.value }))}
                sx={{ ...inputSx, flex: 1 }}
              />
              <Typography sx={{ color: "#8B97A8", fontSize: "0.88rem", fontWeight: 700 }}>%</Typography>
            </Stack>
          </Box>
          <Box>
            <Typography sx={{ mb: 0.6, color: "#8B97A8", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Max Subsidy Amount (₹)
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={subsidy.maxAmount}
              onChange={(e) => setSubsidy((s) => ({ ...s, maxAmount: e.target.value }))}
              sx={inputSx}
            />
          </Box>
        </Box>
      </SectionRow>

      <Divider />

      {/* State Electricity Rates */}
      <SectionRow
        title="State Electricity Rates"
        description="Regional unit rates used to calculate projected savings and ROI for customers in different states."
      >
        <Box>
          {/* Header */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 140px 80px", gap: 1.5, mb: 1 }}>
            {["State / UT", "Rate Per Unit (₹)", "Actions"].map((h) => (
              <Typography key={h} sx={{ color: "#8B97A8", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</Typography>
            ))}
          </Box>

          <Stack spacing={1.2}>
            {states.map((row, index) => (
              <Box key={index} sx={{ display: "grid", gridTemplateColumns: "1fr 140px 80px", gap: 1.5, alignItems: "center" }}>
                <TextField
                  size="small"
                  value={row.state}
                  onChange={(e) => setStates((prev) => prev.map((s, i) => (i === index ? { ...s, state: e.target.value } : s)))}
                  placeholder="State name"
                  sx={inputSx}
                />
                <TextField
                  size="small"
                  value={row.rate}
                  onChange={(e) => updateRate(index, e.target.value)}
                  placeholder="0.00"
                  sx={inputSx}
                />
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Button
                    sx={{ px: 0, color: "#0E56C8", fontSize: "0.8rem", fontWeight: 800, textTransform: "none", minWidth: 0 }}
                    onClick={() => {}}
                  >
                    Update
                  </Button>
                  <Button
                    sx={{ minWidth: 28, width: 28, height: 28, p: 0, color: "#D74C4C", borderRadius: "50%" }}
                    onClick={() => removeState(index)}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>

          <Button
            startIcon={<AddRoundedIcon />}
            onClick={addState}
            sx={{ mt: 1.8, color: "#0E56C8", fontSize: "0.82rem", fontWeight: 800, textTransform: "none", px: 0 }}
          >
            + Add New State
          </Button>
        </Box>
      </SectionRow>

      {/* Banner */}
      <Box
        sx={{
          mt: 4,
          position: "relative",
          borderRadius: "1.4rem",
          overflow: "hidden",
          height: { xs: 180, md: 220 },
          backgroundImage: `url(${solarBannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(10,30,70,0.82) 0%, rgba(10,30,70,0.4) 60%, transparent 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: { xs: 2.5, md: 3.5 },
          }}
        >
          <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", mb: 0.5 }}>
            Powered by your parameters
          </Typography>
          <Typography sx={{ color: "#FFFFFF", fontSize: { xs: "1.2rem", md: "1.6rem" }, fontWeight: 900 }}>
            Dynamic Pricing Engine
          </Typography>
          <Typography sx={{ mt: 0.5, color: "rgba(255,255,255,0.72)", fontSize: "0.84rem", maxWidth: 420 }}>
            Our AI pricing analytics is recalibrated daily to keep vendor bids competitive and thresholds every 24 hours.
          </Typography>
        </Box>
      </Box>

      {/* Sticky footer */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          mt: 4,
          mx: { xs: -2.2, md: -3.6, lg: -4.2 },
          px: { xs: 2.2, md: 3.6, lg: 4.2 },
          py: 2,
          bgcolor: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(225,232,241,0.96)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <SecurityOutlinedIcon sx={{ color: "#239654", fontSize: "1rem" }} />
          <Box>
            <Typography sx={{ color: adminUi.colors.text, fontSize: "0.8rem", fontWeight: 800 }}>Admin Session Active</Typography>
            <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.7rem" }}>Last saved 10 minutes ago by Admin</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1.2}>
          <Button
            variant="outlined"
            sx={{ minHeight: 44, px: 2.2, borderRadius: "0.9rem", borderColor: "rgba(225,232,241,0.96)", color: "#556478", fontSize: "0.86rem", fontWeight: 700, textTransform: "none" }}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ minHeight: 44, px: 2.8, borderRadius: "0.9rem", bgcolor: saved ? "#239654" : "#0E56C8", boxShadow: "0 10px 24px rgba(14,86,200,0.18)", fontSize: "0.86rem", fontWeight: 700, textTransform: "none" }}
          >
            {saved ? "Saved ✓" : "Save Global Settings"}
          </Button>
        </Stack>
      </Box>
    </AdminPageShell>
  );
}
