import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { publicPrimaryNav } from "@/shared/config/navigation";
import logoPlaceholder from "@/shared/assets/logo-placeholder.png";
import styles from "@/app/layouts/PublicLayout.module.css";

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
              spacing={2.5}
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
              spacing={1.5}
              className={styles.navActions}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Button
                component={RouterLink}
                to="/auth/login"
                variant="outlined"
                color="inherit"
                sx={{
                  minWidth: 98,
                  minHeight: 36,
                  px: 2.1,
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
                  minWidth: 112,
                  minHeight: 36,
                  px: 2.1,
                  py: 0.25,
                  borderRadius: "0.35rem",
                  background:
                    "linear-gradient(90deg, #0E56C8 0%, #13C784 100%)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Get a Quote
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Outlet />

      <Box
        component="footer"
        sx={{ py: { xs: 6.5, md: 7.5 }, bgcolor: "#121C32", color: "white" }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.footerContainer}
        >
          <Box className={styles.footerTop}>
            <Box className={styles.footerBrand}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, mb: 2.2, fontSize: "1.1rem" }}
              >
                Sparkin Solar
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.68, lineHeight: 1.7, maxWidth: 230 }}
              >
                Making solar simple and affordable. Luminous stewardship for a
                greener planet.
              </Typography>
              <Stack direction="row" spacing={1.15} sx={{ mt: 3.1 }}>
                {[
                  ShareOutlinedIcon,
                  CameraAltOutlinedIcon,
                  SmsOutlinedIcon,
                ].map((Icon, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      p: 0,
                      width: 26,
                      height: 26,
                      borderRadius: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                ))}
              </Stack>
            </Box>

            {[
              {
                title: "Product",
                items: [
                  { label: "Calculator", href: "/calculator" },
                  { label: "Booking", href: "/booking" },
                  { label: "Services", href: "/service-support" },
                  { label: "Refer & Earn", href: "/refer-earn" },
                ],
              },
              {
                title: "Company",
                items: [
                  { label: "About Us", href: "/about-us" },
                  { label: "Why Choose Us", href: "/why-choose-us" },
                  { label: "Articles", href: "/articles" },
                  { label: "Blog", href: "/blog" },
                ],
              },
              {
                title: "Support",
                items: [
                  { label: "Contact Us", href: "/contact-us" },
                  { label: "FAQs", href: "/faqs" },
                  { label: "Terms", href: "/terms" },
                  { label: "Privacy", href: "/privacy" },
                ],
              },
            ].map((group) => (
              <Box key={group.title}>
                <Typography
                  sx={{ fontWeight: 700, mb: 2.4, fontSize: "0.98rem" }}
                >
                  {group.title}
                </Typography>
                <Stack spacing={1.5}>
                  {group.items.map((item) => (
                    <Typography
                      key={item.label}
                      component={RouterLink}
                      to={item.href}
                      variant="body2"
                      sx={{
                        opacity: 0.66,
                        fontSize: "0.95rem",
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": { opacity: 1, color: "#FFFFFF" },
                      }}
                    >
                      {item.label}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 4.5, borderColor: "rgba(255,255,255,0.06)" }} />

          <Box className={styles.footerBottom}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              className={styles.footerMeta}
              sx={{ color: "rgba(255,255,255,0.72)" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <MailOutlineRoundedIcon
                  sx={{ fontSize: 18, color: "#13C784" }}
                />
                <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                  hello@sparkin.com
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneEnabledOutlinedIcon
                  sx={{ fontSize: 18, color: "#13C784" }}
                />
                <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                  +911800-000-000
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceOutlinedIcon sx={{ fontSize: 18, color: "#13C784" }} />
                <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                  Hyderabad, India
                </Typography>
              </Stack>
            </Stack>
            <Typography
              variant="body2"
              sx={{ opacity: 0.5, fontSize: "0.95rem" }}
            >
              © 2026 Sparkin Inc. All rights reserved..
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
