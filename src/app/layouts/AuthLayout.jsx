import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PageTransition } from "@/shared/ui/transition/PageTransition";

export function AuthLayout() {
  return (
    <Box sx={{ height: "100vh", overflow: "hidden", bgcolor: "#FBFCFE" }}>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </Box>
  );
}
