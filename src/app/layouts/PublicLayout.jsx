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
          <Container maxWidth={false} disableGutters className={styles.navContainer}>
            <Stack direction="row" spacing={1.5} alignItems="center" className={styles.brandSlot}>
              <Box component="img" src={logoPlaceholder} alt="Sparkin logo" className={styles.brandImage} />
            </Stack>

            <Stack direction="row" spacing={4} className={styles.navLinks} sx={{ display: { xs: "none", md: "flex" } }}>
              {publicPrimaryNav.map((item) => (
                <Typography
                  key={item.label}
                  component={RouterLink}
                  to={item.href}
                  variant="body2"
                  color="text.primary"
                  sx={{ fontWeight: 600 }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>

            <Stack direction="row" spacing={1.5} className={styles.navActions} sx={{ display: { xs: "none", sm: "flex" } }}>
              <Button
                component={RouterLink}
                to="/auth/login"
                variant="outlined"
                color="inherit"
                sx={{
                  minWidth: 128,
                  minHeight: 40,
                  px: 2.5,
                  py: 0.25,
                  borderRadius: "0.5rem",
                }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/booking"
                variant="contained"
                sx={{
                  minWidth: 130,
                  minHeight: 40,
                  px: 2.5,
                  py: 0.25,
                  borderRadius: "0.5rem",
                  background: "linear-gradient(90deg, #0E56C8 0%, #13C784 100%)",
                }}
              >
                Get a Quote
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Outlet />

      <Box component="footer" sx={{ py: 8, bgcolor: "#0F1830", color: "white" }}>
        <Container maxWidth={false} disableGutters className={styles.footerContainer}>
          <Box className={styles.footerTop}>
            <Box className={styles.footerBrand}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                Sparkin Solar
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.68, lineHeight: 1.8 }}>
                Making solar simple and affordable. Luminous stewardship for a greener planet.
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                {[ShareOutlinedIcon, CameraAltOutlinedIcon, SmsOutlinedIcon].map((Icon, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Stack>
            </Box>

            {[
              { title: "Product", items: ["Calculator", "Booking", "Services", "Refer & Earn"] },
              { title: "Company", items: ["About Us", "Why Choose Us", "Articles", "Blog"] },
              { title: "Support", items: ["Contact Us", "FAQs", "Terms", "Privacy"] },
            ].map((group) => (
              <Box key={group.title}>
                <Typography sx={{ fontWeight: 700, mb: 2.5 }}>{group.title}</Typography>
                <Stack spacing={1.4}>
                  {group.items.map((item) => (
                    <Typography key={item} variant="body2" sx={{ opacity: 0.72 }}>
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.08)" }} />

          <Box className={styles.footerBottom}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} className={styles.footerMeta} sx={{ color: "rgba(255,255,255,0.75)" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <MailOutlineRoundedIcon sx={{ fontSize: 18, color: "#13C784" }} />
                <Typography variant="body2">hello@sparkin.com</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneEnabledOutlinedIcon sx={{ fontSize: 18, color: "#13C784" }} />
                <Typography variant="body2">+91 1800-000-000</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceOutlinedIcon sx={{ fontSize: 18, color: "#13C784" }} />
                <Typography variant="body2">Hyderabad, India</Typography>
              </Stack>
            </Stack>
            <Typography variant="body2" sx={{ opacity: 0.56 }}>
              (c) 2026 Sparkin Inc. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
