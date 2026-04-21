import { Grid, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <Grid container sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Grid
        size={{ xs: 12, md: 7 }}
        sx={{
          display: { xs: "none", md: "block" },
          background:
            "linear-gradient(135deg, rgba(14,86,200,0.96) 0%, rgba(11,66,145,0.92) 38%, rgba(14,199,132,0.84) 100%)",
        }}
      />
      <Grid size={{ xs: 12, md: 5 }} sx={{ display: "grid", placeItems: "center", p: 3 }}>
        <Paper sx={{ width: "100%", maxWidth: 520, p: { xs: 3, md: 5 } }}>
          <Outlet />
        </Paper>
      </Grid>
    </Grid>
  );
}

