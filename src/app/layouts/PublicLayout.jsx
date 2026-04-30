import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { publicPrimaryNav } from "@/shared/config/navigation";
import logoPlaceholder from "@/shared/assets/logo-placeholder.png";
import styles from "@/app/layouts/PublicLayout.module.css";
import { AppFooter } from "@/shared/components/AppFooter";

export function PublicLayout() {
  return (
    <Box className={styles.shell} sx={{ bgcolor: "background.default" }}>
      <AppBar
        color="transparent"
        elevation={0}
        position="sticky"
        sx={{
          backdropFilter: "blur(14px)",
          bgcolor: "rgba(255,255,255,0.9)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ minHeight: 72, px: 0 }}>
          <Container
            maxWidth={false}
            disableGutters
            className={styles.navContainer}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              className={styles.brandSlot}
            >
              <Box
                component="img"
                src={logoPlaceholder}
                alt="Sparkin logo"
                className={styles.brandImage}
              />
            </Stack>

            <Stack
              direction="row"
              spacing={2.4}
              className={styles.navLinks}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {publicPrimaryNav.map((item) => (
                <Typography
                  key={item.label}
                  component={RouterLink}
                  to={item.href}
                  variant="body2"
                  color="text.primary"
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    lineHeight: 1,
                    "&:hover": { color: "#0E56C8" },
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>

            <Stack
              direction="row"
              spacing={1.9}
              className={styles.navActions}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Button
                component={RouterLink}
                to="/auth/login"
                variant="outlined"
                color="inherit"
                sx={{
                  minWidth: 136,
                  minHeight: 36,
                  px: 3.7,
                  py: 0.25,
                  borderRadius: "0.35rem",
                  borderColor: "#0E56C8",
                  color: "#10192F",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/booking"
                variant="contained"
                sx={{
                  minWidth: 136,
                  minHeight: 36,
                  px: 3.7,
                  py: 0.25,
                  borderRadius: "0.35rem",
                  background:
                    "linear-gradient(180deg, #1A66E8 0%, #0E56C8 100%)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "0 10px 22px rgba(14,86,200,0.18)",
                  "&:hover": {
                    background:
                      "linear-gradient(180deg, #2C76F0 0%, #145FCF 100%)",
                    boxShadow: "0 16px 30px rgba(14,86,200,0.22)",
                  },
                }}
              >
                Get a Quote
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Outlet />
      <AppFooter />
    </Box>
  );
}
