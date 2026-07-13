import * as React from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { authApi } from "@/features/auth/authApi";
import { limitEmailInput } from "@/shared/lib/forms/inputConstraints";
import { scrollToFieldError } from "@/shared/lib/forms/scrollToFieldError";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 50,
    borderRadius: "0.95rem",
    bgcolor: "#F2F5FA",
    fontSize: "0.95rem",
    color: "#202938",
    "& fieldset": {
      borderColor: "#E3E9F1",
    },
    "&:hover fieldset": {
      borderColor: "#D3DCE8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0E56C8",
    },
  },
};

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getPasswordError(value) {
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return "Password must include letters and numbers.";
  }
  return "";
}

function getRoleMeta(role) {
  if (role === "vendor") {
    return {
      loginPath: "/vendor/login",
      forgotPath: "/vendor/forgot-password",
      label: "vendor",
    };
  }

  if (role === "admin") {
    return {
      loginPath: "/admin/login",
      forgotPath: "/admin/forgot-password",
      label: "admin",
    };
  }

  return {
    loginPath: "/auth/login",
    forgotPath: "/auth/forgot-password",
    label: "user",
  };
}

export function PasswordRecoveryShell({
  mode,
  fixedRole,
  title,
  subtitle,
  heroEyebrow,
  heroTitle,
  heroTitleAccent,
  heroBody,
  heroStatTitle,
  heroStatBody,
  heroBackground,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [devResetUrl, setDevResetUrl] = React.useState("");
  const token = searchParams.get("token")?.trim() ?? "";
  const isResetMode = mode === "reset-password";
  const roleMeta = getRoleMeta(fixedRole);
  const devResetPath = React.useMemo(() => {
    if (!devResetUrl) {
      return "";
    }

    try {
      const parsedUrl = new URL(devResetUrl);
      return `${parsedUrl.pathname}${parsedUrl.search}`;
    } catch {
      return devResetUrl;
    }
  }, [devResetUrl]);

  const heroOverlay = [
    "linear-gradient(135deg, rgba(5,44,118,0.7) 0%, rgba(9,78,185,0.34) 26%, rgba(11,133,118,0.38) 66%, rgba(16,117,55,0.28) 100%)",
    "linear-gradient(145deg, rgba(3,20,61,0.72) 0%, rgba(3,20,61,0.28) 38%, rgba(3,20,61,0.08) 100%)",
    "radial-gradient(circle at 10% 22%, rgba(18,122,255,0.26) 0%, rgba(18,122,255,0) 30%)",
    "radial-gradient(circle at 80% 86%, rgba(34,204,96,0.22) 0%, rgba(34,204,96,0) 33%)",
  ].join(", ");

  function getErrorMessage(apiError) {
    return (
      apiError?.response?.data?.message ||
      apiError?.message ||
      "Something went wrong. Please try again."
    );
  }

  async function handleRequestReset(event) {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    setNotice("");
    setDevResetUrl("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      setError("Please enter a valid email address.");
      scrollToFieldError("email");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authApi.requestPasswordReset({
        email: normalizedEmail,
        role: fixedRole,
      });

      setNotice(
        result.message ||
          "If that account exists, reset instructions have been prepared.",
      );
      setDevResetUrl(result.resetUrl || "");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    setNotice("");

    if (!token) {
      setError("Reset token is missing. Please use the latest reset link.");
      return;
    }

    const passwordError = getPasswordError(password);
    if (passwordError) {
      setError(passwordError);
      scrollToFieldError("password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      scrollToFieldError("confirmPassword");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authApi.resetPassword({
        token,
        password,
        role: fixedRole,
      });

      setNotice(result.message || "Password has been reset successfully.");
      setPassword("");
      setConfirmPassword("");
      window.setTimeout(() => {
        navigate(roleMeta.loginPath, {
          replace: true,
          state: {
            resetSuccess: true,
          },
        });
      }, 800);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflow: "auto",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "minmax(0, 1.05fr) minmax(430px, 0.95fr)",
        },
      }}
    >
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          backgroundImage: `${heroOverlay}, url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          color: "white",
        }}
      >
        <Stack
          spacing={3.1}
          justifyContent="center"
          sx={{
            height: "100%",
            px: { lg: 6.5, xl: 7.6 },
            py: { lg: 6.25, xl: 7 },
          }}
        >
          <Box
            sx={{
              px: 1.1,
              py: 0.45,
              width: "fit-content",
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.16)",
              boxShadow: "0 10px 24px rgba(4,13,29,0.12)",
              fontSize: "0.66rem",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {heroEyebrow}
          </Box>

          <Box sx={{ maxWidth: 520 }}>
            <Typography
              sx={{
                fontSize: { lg: "3.75rem", xl: "4.45rem" },
                lineHeight: 0.98,
                fontWeight: 800,
                letterSpacing: "-0.06em",
              }}
            >
              {heroTitle}
              <Box component="span" sx={{ display: "block", color: "#D8F600" }}>
                {heroTitleAccent}
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 2.5,
                color: "rgba(236,242,251,0.92)",
                fontSize: "1.05rem",
                lineHeight: 1.72,
                maxWidth: 410,
              }}
            >
              {heroBody}
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              maxWidth: 320,
              p: 1.6,
              borderRadius: "1.2rem",
              bgcolor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 22px 36px rgba(3,9,22,0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.1 }}>
              {heroStatTitle}
            </Typography>
            <Typography
              sx={{
                mt: 0.15,
                color: "rgba(232,240,248,0.82)",
                fontSize: "0.82rem",
              }}
            >
              {heroStatBody}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          bgcolor: "#FBFCFE",
          display: "grid",
          placeItems: "center",
          px: { xs: 2, md: 3.5 },
          py: { xs: 3, md: 4.2 },
          minHeight: "100vh",
        }}
      >
        <Box
          component="form"
          onSubmit={isResetMode ? handleResetPassword : handleRequestReset}
          sx={{ width: "100%", maxWidth: 430 }}
        >
          <Typography
            variant="h1"
            sx={{
              color: "#20242B",
              fontSize: { xs: "2.1rem", md: "2.7rem" },
              lineHeight: 1.04,
              letterSpacing: "-0.05em",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.65,
              color: "#667084",
              fontSize: "0.96rem",
              lineHeight: 1.48,
              maxWidth: 360,
            }}
          >
            {subtitle}
          </Typography>

          <Stack spacing={1.5} sx={{ mt: 3.1 }}>
            {error ? (
              <Alert severity="error" sx={{ borderRadius: "0.9rem", fontSize: "0.82rem" }}>
                {error}
              </Alert>
            ) : null}
            {notice ? (
              <Alert
                severity="success"
                sx={{ borderRadius: "0.9rem", fontSize: "0.82rem" }}
                onClose={() => setNotice("")}
              >
                {notice}
              </Alert>
            ) : null}
            {devResetPath ? (
              <Alert severity="info" sx={{ borderRadius: "0.9rem", fontSize: "0.82rem" }}>
                Local reset link:{" "}
                <Box
                  component={RouterLink}
                  to={devResetPath}
                  sx={{ color: "#0E56C8", fontWeight: 700, textDecoration: "none" }}
                >
                  open reset page
                </Box>
              </Alert>
            ) : null}

            {!isResetMode ? (
              <Box data-field="email">
                <Typography
                  sx={{
                    mb: 0.45,
                    color: "#344054",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(limitEmailInput(event.target.value))}
                  placeholder="name@company.com"
                  sx={fieldSx}
                  InputProps={{
                    endAdornment: (
                      <AlternateEmailRoundedIcon sx={{ color: "#8E98A9", fontSize: "1rem" }} />
                    ),
                  }}
                />
              </Box>
            ) : (
              <>
                <Box data-field="password">
                  <Typography
                    sx={{
                      mb: 0.45,
                      color: "#344054",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    New Password
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter a strong password"
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <LockOutlinedIcon sx={{ color: "#8E98A9", mr: 1, fontSize: "1rem" }} />
                      ),
                      endAdornment: (
                        <IconButton
                          type="button"
                          edge="end"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowPassword((current) => !current)}
                          sx={{ color: "#8E98A9" }}
                        >
                          {showPassword ? (
                            <VisibilityOutlinedIcon sx={{ fontSize: "1rem" }} />
                          ) : (
                            <VisibilityOffOutlinedIcon sx={{ fontSize: "1rem" }} />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                </Box>

                <Box data-field="confirmPassword">
                  <Typography
                    sx={{
                      mb: 0.45,
                      color: "#344054",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    Confirm Password
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter your password"
                    sx={fieldSx}
                  />
                </Box>

                <Typography
                  sx={{
                    mt: -0.4,
                    color: "#8B94A5",
                    fontSize: "0.72rem",
                    lineHeight: 1.35,
                  }}
                >
                  Use at least 8 characters with both letters and numbers.
                </Typography>
              </>
            )}

            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                minHeight: 52,
                borderRadius: "0.95rem",
                fontSize: "0.94rem",
                fontWeight: 700,
                textTransform: "none",
                color: "#FFFFFF",
                background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                boxShadow: "0 18px 28px rgba(14,86,200,0.18)",
                "&.Mui-disabled": {
                  color: "#FFFFFF",
                  background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                  opacity: 0.75,
                },
              }}
            >
              {isSubmitting
                ? "Please wait..."
                : isResetMode
                  ? "Reset Password"
                  : "Send Reset Link"}
            </Button>

            <Stack direction="row" justifyContent="space-between" spacing={1.5}>
              <Typography
                component={RouterLink}
                to={roleMeta.loginPath}
                sx={{
                  color: "#0E56C8",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Back to login
              </Typography>

              {isResetMode ? (
                <Typography
                  component={RouterLink}
                  to={roleMeta.forgotPath}
                  sx={{
                    color: "#667084",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Need a new link?
                </Typography>
              ) : null}
            </Stack>

            <Typography
              sx={{
                color: "#98A2B3",
                fontSize: "0.74rem",
                lineHeight: 1.45,
                pt: 0.4,
              }}
            >
              This recovery flow is prepared for your {roleMeta.label} account.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
