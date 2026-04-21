import { Avatar, Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { portalNavigation } from "@/shared/config/navigation";

export function PortalLayout({ portal }) {
  const navItems = portalNavigation[portal];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex" }}>
      <Box
        component="aside"
        sx={{
          width: 248,
          borderRight: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(255,255,255,0.72)",
          p: 3,
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mb: 2 }}>
          SPARKIN
        </Typography>
        {navItems.map((item) => (
          <Button key={item.label} variant="text" color="inherit" sx={{ justifyContent: "flex-start" }}>
            {item.label}
          </Button>
        ))}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          component="header"
          sx={{
            px: { xs: 2, md: 4 },
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(14px)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <TextField
            size="small"
            placeholder="Search leads, projects, bookings..."
            sx={{ maxWidth: 520, flex: 1, bgcolor: "background.paper" }}
          />
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="body2">Support</Typography>
            <Avatar sx={{ width: 40, height: 40 }}>S</Avatar>
          </Stack>
        </Box>
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
          <Outlet />
        </Container>
        <Box component="footer" sx={{ mt: 6, py: 6, bgcolor: "#0F1830", color: "white" }}>
          <Container maxWidth="xl">
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Shared portal footer scaffold for customer and vendor surfaces.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

