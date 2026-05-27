import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#FBFCFE",
      }}
    >
      <Outlet />
    </Box>
  );
}
