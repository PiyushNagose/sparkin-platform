import { Suspense } from "react";
import { Box, Stack } from "@mui/material";

// ── Shimmer keyframe injected once ────────────────────────────────────────────
const shimmerStyle = `
@keyframes sparkin-shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("sparkin-shimmer-style")
) {
  const tag = document.createElement("style");
  tag.id = "sparkin-shimmer-style";
  tag.textContent = shimmerStyle;
  document.head.appendChild(tag);
}

const SHIMMER = {
  background: "linear-gradient(90deg, #EEF2F8 25%, #E2E8F2 50%, #EEF2F8 75%)",
  backgroundSize: "600px 100%",
  animation: "sparkin-shimmer 1.4s ease-in-out infinite",
  borderRadius: "0.85rem",
};

function ShimmerBlock({ h = 48, w = "100%", r = "0.85rem" }) {
  return (
    <Box
      sx={{ ...SHIMMER, height: h, width: w, borderRadius: r, flexShrink: 0 }}
    />
  );
}

function PageSkeleton() {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        px: { xs: 2.4, md: 6 },
        py: { xs: 4, md: 6 },
        maxWidth: 900,
        mx: "auto",
        width: "100%",
      }}
    >
      {/* Fake heading */}
      <Stack spacing={1.4} alignItems="center" sx={{ mb: 5 }}>
        <ShimmerBlock h={14} w={80} r="999px" />
        <ShimmerBlock h={36} w="55%" r="0.6rem" />
        <ShimmerBlock h={18} w="38%" r="0.5rem" />
      </Stack>

      {/* Fake card */}
      <Box
        sx={{
          borderRadius: "1.35rem",
          border: "1px solid #EEF2F8",
          bgcolor: "rgba(255,255,255,0.92)",
          boxShadow: "0 18px 44px rgba(20,34,56,0.06)",
          p: { xs: 2.4, md: 3.4 },
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={3.5}>
          {/* Left col */}
          <Stack spacing={2.2} sx={{ flex: 1 }}>
            <ShimmerBlock h={14} w="40%" r="0.5rem" />
            <ShimmerBlock h={48} />
            <ShimmerBlock h={14} w="40%" r="0.5rem" />
            <ShimmerBlock h={48} />
            <ShimmerBlock h={14} w="40%" r="0.5rem" />
            <ShimmerBlock h={48} />
          </Stack>

          {/* Right col */}
          <Stack spacing={2.2} sx={{ flex: 1 }}>
            <ShimmerBlock h={14} w="40%" r="0.5rem" />
            <ShimmerBlock h={48} />
            <ShimmerBlock h={14} w="40%" r="0.5rem" />
            <ShimmerBlock h={48} />
            <ShimmerBlock h={14} w="40%" r="0.5rem" />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 1.2,
              }}
            >
              <ShimmerBlock h={48} />
              <ShimmerBlock h={48} />
              <ShimmerBlock h={48} />
            </Box>
          </Stack>
        </Stack>

        {/* Footer row */}
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3.5 }}>
          <ShimmerBlock h={50} w={180} r="0.85rem" />
        </Stack>
      </Box>
    </Box>
  );
}

export function LazyRoute({ component: Component }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Component />
    </Suspense>
  );
}
