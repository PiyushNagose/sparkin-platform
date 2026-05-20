import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { useSocket } from "@/shared/websocket/SocketProvider";

export function AuthLayout() {
  const { refreshKey } = useSocket();
  const location = useLocation();

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#FBFCFE",
      }}
    >
      <Outlet key={`${location.pathname}${location.search}${refreshKey}`} />
    </Box>
  );
}
