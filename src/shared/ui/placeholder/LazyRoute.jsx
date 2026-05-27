import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

export function LazyRoute({ component: Component }) {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "40vh",
            display: "grid",
            placeItems: "center",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      }
    >
      <Component />
    </Suspense>
  );
}
