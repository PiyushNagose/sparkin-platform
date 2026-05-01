import {
  Box,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { Link as RouterLink } from "react-router-dom";
import styles from "@/app/layouts/PublicLayout.module.css";

const footerGroups = [
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
      { label: "About Us", href: "/about" },
      { label: "Why Choose Us", href: "/why-choose-us" },
      { label: "Articles", href: "/articles" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function AppFooter() {
  return (
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
              {[ShareOutlinedIcon, CameraAltOutlinedIcon, SmsOutlinedIcon].map(
                (Icon, index) => (
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
                ),
              )}
            </Stack>
          </Box>

          {footerGroups.map((group) => (
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
              <MailOutlineRoundedIcon sx={{ fontSize: 18, color: "#13C784" }} />
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
            {"\u00A9"} 2026 Sparkin Inc. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
