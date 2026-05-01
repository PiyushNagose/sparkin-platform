import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Drawer,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useEffect, useState } from "react";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import { publicPrimaryNav } from "@/shared/config/navigation";
import logoPlaceholder from "@/shared/assets/logo-placeholder.png";
import styles from "@/app/layouts/PublicLayout.module.css";
import { AppFooter } from "@/shared/components/AppFooter";

export function PublicLayout() {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setMobileMenuOpen(false);
  }, [pathname]);

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
              component={RouterLink}
              to="/"
              direction="row"
              spacing={1.5}
              alignItems="center"
              className={styles.brandSlot}
              sx={{ textDecoration: "none" }}
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

            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
              className={styles.mobileMenuButton}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                ml: "auto",
                width: 42,
                height: 42,
                borderRadius: "0.75rem",
                color: "#0E56C8",
                bgcolor: "rgba(14,86,200,0.08)",
                border: "1px solid rgba(14,86,200,0.12)",
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
          </Container>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ className: styles.mobileDrawer }}
      >
        <Stack spacing={2.4} sx={{ p: 2.4, height: "100%" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box
              component="img"
              src={logoPlaceholder}
              alt="Sparkin logo"
              sx={{ width: 108, height: 56, objectFit: "contain" }}
            />
            <IconButton
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "0.75rem",
                color: "#10192F",
                bgcolor: "#F2F6FC",
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          <Stack spacing={0.7}>
            {publicPrimaryNav.map((item) => (
              <Typography
                key={item.label}
                component={RouterLink}
                to={item.href}
                sx={{
                  px: 1.35,
                  py: 1.2,
                  borderRadius: "0.85rem",
                  color: pathname === item.href ? "#0E56C8" : "#10192F",
                  bgcolor:
                    pathname === item.href ? "rgba(14,86,200,0.08)" : "transparent",
                  fontSize: "0.96rem",
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>

          <Stack spacing={1.1} sx={{ mt: "auto" }}>
            <Button
              component={RouterLink}
              to="/auth/login"
              variant="outlined"
              sx={{
                minHeight: 46,
                borderRadius: "0.85rem",
                borderColor: "#0E56C8",
                color: "#10192F",
                fontWeight: 800,
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
                minHeight: 46,
                borderRadius: "0.85rem",
                background: "linear-gradient(180deg, #1A66E8 0%, #0E56C8 100%)",
                fontWeight: 800,
                textTransform: "none",
                boxShadow: "0 14px 28px rgba(14,86,200,0.22)",
              }}
            >
              Get a Quote
            </Button>
          </Stack>
        </Stack>
      </Drawer>

      <Outlet />
      <AppFooter />
    </Box>
  );
}
