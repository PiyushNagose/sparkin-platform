import { Box, Stack, Typography } from "@mui/material";

// step.state: "complete" | "active" | "upcoming"
const STEPS = [
  { label: "Basic Info" },
  { label: "Property Info" },
  { label: "Roof Info" },
  { label: "Document Info" },
];

// progressWidth[activeIndex] = how far the filled bar reaches
// Visually: step dots sit at 12.5%, 37.5%, 62.5%, 87.5% of the track width
// Track spans from 12.5% to 87.5% (i.e. left: 12.5%, right: 12.5%)
// Bar fills to the center of the active dot
const BAR_FILL_BY_ACTIVE = ["0%", "33.33%", "66.67%", "100%"];

export default function BookingStepper({ activeStep }) {
  // activeStep is 0-indexed (0 = Basic Info, 3 = Document Info)
  const fillWidth = BAR_FILL_BY_ACTIVE[activeStep] ?? "0%";

  return (
    <Box sx={{ width: "100%", px: { xs: 0.5, md: 0 } }}>
      <Box sx={{ position: "relative", mb: 0.5 }}>
        {/* Background track */}
        <Box
          sx={{
            position: "absolute",
            left: "12.5%",
            right: "12.5%",
            top: 17,
            height: 3,
            borderRadius: 999,
            bgcolor: "#E7ECF3",
            zIndex: 0,
          }}
        />
        {/* Filled progress */}
        <Box
          sx={{
            position: "absolute",
            left: "12.5%",
            width: fillWidth,
            maxWidth: "75%",
            top: 17,
            height: 3,
            borderRadius: 999,
            background: "linear-gradient(90deg, #0E56C8 0%, #4F89FF 100%)",
            zIndex: 0,
            transition: "width 0.35s ease",
          }}
        />

        {/* Step dots row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {STEPS.map((step, idx) => {
            const state =
              idx < activeStep
                ? "complete"
                : idx === activeStep
                  ? "active"
                  : "upcoming";

            return (
              <Stack key={step.label} alignItems="center" spacing={0.85}>
                {/* Circle */}
                <Box
                  sx={{
                    width: state === "active" ? 34 : 30,
                    height: state === "active" ? 34 : 30,
                    borderRadius: "50%",
                    border: state === "active" ? "3px solid #0E56C8" : "none",
                    bgcolor:
                      state === "complete"
                        ? "#0E56C8"
                        : state === "active"
                          ? "#FFFFFF"
                          : "#EEF3FA",
                    boxShadow:
                      state === "active"
                        ? "0 0 0 5px rgba(14,86,200,0.10), 0 8px 20px rgba(14,86,200,0.16)"
                        : state === "complete"
                          ? "0 4px 12px rgba(14,86,200,0.22)"
                          : "0 4px 10px rgba(17,31,54,0.04)",
                    display: "grid",
                    placeItems: "center",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  {state === "complete" ? (
                    <Typography
                      sx={{
                        color: "#FFFFFF",
                        fontSize: "0.88rem",
                        fontWeight: 900,
                        lineHeight: 1,
                      }}
                    >
                      ✓
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        width: state === "active" ? 9 : 7,
                        height: state === "active" ? 9 : 7,
                        borderRadius: "50%",
                        bgcolor: state === "active" ? "#0E56C8" : "#C8D4E8",
                        transition: "all 0.2s",
                      }}
                    />
                  )}
                </Box>

                {/* Label */}
                <Typography
                  sx={{
                    color:
                      state === "active"
                        ? "#0E56C8"
                        : state === "complete"
                          ? "#18253A"
                          : "#8F9AAC",
                    fontSize: "0.72rem",
                    fontWeight: state === "active" ? 800 : 600,
                    lineHeight: 1.2,
                    textAlign: "center",
                  }}
                >
                  {step.label}
                </Typography>

                {/* Status pill */}
                <Box
                  sx={{
                    px: 0.9,
                    py: 0.25,
                    borderRadius: 999,
                    bgcolor:
                      state === "active"
                        ? "#EEF4FF"
                        : state === "complete"
                          ? "#E8FAEF"
                          : "transparent",
                    minHeight: 18,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color:
                        state === "active"
                          ? "#0E56C8"
                          : state === "complete"
                            ? "#239654"
                            : "transparent",
                      fontSize: "0.52rem",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      lineHeight: 1,
                    }}
                  >
                    {state === "active"
                      ? "In Progress"
                      : state === "complete"
                        ? "Done"
                        : "·"}
                  </Typography>
                </Box>
              </Stack>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
