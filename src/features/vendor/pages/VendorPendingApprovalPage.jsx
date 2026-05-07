import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AppFooter } from "@/shared/components/AppFooter";
import { useAuth } from "@/features/auth/AuthProvider";

export default function VendorPendingApprovalPage() {
  const location = useLocation();
  const { logout } = useAuth();
  const error = location.state?.error;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor:
          "radial-gradient(circle at top, rgba(220,234,250,0.9) 0%, rgba(245,249,252,0.96) 30%, #F7FAFC 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, md: 4 },
          py: { xs: 5, md: 7 },
          display: "grid",
          placeItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 760,
            p: { xs: 3, md: 4.5 },
            borderRadius: "1.8rem",
            bgcolor: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(223,231,241,0.92)",
            boxShadow: "0 22px 50px rgba(16,29,51,0.08)",
          }}
        >
          {error ? (
            <Alert severity="info" sx={{ mb: 2.5, borderRadius: "0.95rem" }}>
              {error}
            </Alert>
          ) : null}

          <Stack spacing={2.2} alignItems="center" textAlign="center">
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "1.2rem",
                bgcolor: "#EEF4FF",
                color: "#0E56C8",
                display: "grid",
                placeItems: "center",
              }}
            >
              <AccessTimeRoundedIcon sx={{ fontSize: "2rem" }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "#18253A",
                  fontSize: { xs: "2rem", md: "2.55rem" },
                  fontWeight: 800,
                  lineHeight: 1.04,
                }}
              >
                Application under review
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  maxWidth: 520,
                  color: "#6D7A8C",
                  fontSize: "0.98rem",
                  lineHeight: 1.72,
                }}
              >
                Your partner onboarding has been submitted to Sparkin admin.
                We&apos;ll unlock the vendor portal as soon as your company,
                documents, and experience details are approved.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              sx={{ width: "100%" }}
            >
              <InfoCard
                icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: "1.1rem" }} />}
                title="Application submitted"
                body="Your company profile and compliance documents are safely in review."
              />
              <InfoCard
                icon={<MailOutlineRoundedIcon sx={{ fontSize: "1.1rem" }} />}
                title="Approval update"
                body="You can check back here anytime. Admin approval will unlock your full partner workspace."
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
              <Button
                component={RouterLink}
                to="/vendor/onboarding"
                variant="outlined"
                sx={{
                  minWidth: 190,
                  minHeight: 46,
                  borderRadius: "0.9rem",
                  borderColor: "#0E56C8",
                  color: "#0E56C8",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Review Application
              </Button>
              <Button
                onClick={logout}
                variant="contained"
                sx={{
                  minWidth: 190,
                  minHeight: 46,
                  borderRadius: "0.9rem",
                  bgcolor: "#0E56C8",
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "0 14px 28px rgba(14,86,200,0.18)",
                }}
              >
                Logout
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
      <AppFooter />
    </Box>
  );
}

function InfoCard({ icon, title, body }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: 2,
        borderRadius: "1.2rem",
        bgcolor: "#F6F9FD",
        border: "1px solid rgba(224,232,242,0.9)",
        textAlign: "left",
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "0.9rem",
          bgcolor: "#FFFFFF",
          color: "#0E56C8",
          display: "grid",
          placeItems: "center",
          mb: 1.2,
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ color: "#18253A", fontSize: "0.94rem", fontWeight: 800 }}>
        {title}
      </Typography>
      <Typography sx={{ mt: 0.45, color: "#6D7A8C", fontSize: "0.84rem", lineHeight: 1.65 }}>
        {body}
      </Typography>
    </Box>
  );
}
