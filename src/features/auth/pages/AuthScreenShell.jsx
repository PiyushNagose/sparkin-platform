import * as React from "react";
import { Alert, Box, Button, Checkbox, Divider, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useAuth } from "@/features/auth/AuthProvider";

const accountTypes = ["customer", "vendor"];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 56,
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
  "& .MuiInputBase-input::placeholder": {
    color: "#A0A8B8",
    opacity: 1,
  },
};

function AccountToggle({ value, onChange }) {
  return (
    <Box
      sx={{
        p: 0.35,
        borderRadius: "0.95rem",
        bgcolor: "#F1F3F7",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0.35,
      }}
    >
      {accountTypes.map((type) => {
        const active = type === value;

        return (
          <Button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            sx={{
              minHeight: 42,
              borderRadius: "0.8rem",
              bgcolor: active ? "white" : "transparent",
              color: active ? "#0E56C8" : "#5D6678",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "none",
              boxShadow: active ? "0 2px 6px rgba(17,31,54,0.08)" : "none",
              "&:hover": {
                bgcolor: active ? "white" : "rgba(255,255,255,0.4)",
              },
            }}
          >
            {type === "customer" ? "User" : "Vendor"}
          </Button>
        );
      })}
    </Box>
  );
}

function SocialButton({ children }) {
  return (
    <Button
      fullWidth
      type="button"
      sx={{
        minHeight: 50,
        borderRadius: "0.9rem",
        bgcolor: "white",
        border: "1px solid #E5EAF2",
        color: "#202938",
        fontSize: "0.84rem",
        fontWeight: 700,
        textTransform: "none",
      }}
    >
      {children}
    </Button>
  );
}

export function AuthScreenShell({
  mode,
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
  const location = useLocation();
  const { login, register, getRoleHome } = useAuth();
  const [accountType, setAccountType] = React.useState("customer");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const isSignup = mode === "signup";

  const heroOverlay =
    mode === "login"
      ? [
          "linear-gradient(135deg, rgba(5,44,118,0.7) 0%, rgba(9,78,185,0.34) 26%, rgba(11,133,118,0.38) 66%, rgba(16,117,55,0.28) 100%)",
          "linear-gradient(145deg, rgba(3,20,61,0.72) 0%, rgba(3,20,61,0.28) 38%, rgba(3,20,61,0.08) 100%)",
          "radial-gradient(circle at 10% 22%, rgba(18,122,255,0.26) 0%, rgba(18,122,255,0) 30%)",
          "radial-gradient(circle at 80% 86%, rgba(34,204,96,0.22) 0%, rgba(34,204,96,0) 33%)",
        ].join(", ")
      : [
          "linear-gradient(180deg, rgba(7,41,112,0.44) 0%, rgba(7,41,112,0.16) 42%, rgba(7,41,112,0.52) 100%)",
          "linear-gradient(120deg, rgba(8,65,182,0.18) 0%, rgba(8,65,182,0.03) 50%, rgba(8,65,182,0.24) 100%)",
          "radial-gradient(circle at 64% 82%, rgba(178,220,255,0.16) 0%, rgba(178,220,255,0) 38%)",
        ].join(", ");

  function getRedirectPath(user) {
    const fromPath = location.state?.from?.pathname;

    const isAuthPath = fromPath === "/auth/login" || fromPath === "/auth/signup";
    const isVendorPath = fromPath?.startsWith("/vendor");
    const canUseFromPath =
      fromPath &&
      !isAuthPath &&
      ((user.role === "vendor" && isVendorPath) ||
        (user.role === "customer" && !isVendorPath) ||
        user.role === "admin");

    if (canUseFromPath) {
      return fromPath;
    }

    return getRoleHome(user.role);
  }

  function getErrorMessage(apiError) {
    return apiError?.response?.data?.message || apiError?.message || "Something went wrong. Please try again.";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const user = isSignup
        ? await register({
            fullName: fullName.trim(),
            email: normalizedEmail,
            password,
            role: accountType,
          })
        : await login({
            email: normalizedEmail,
            password,
          });

      navigate(getRedirectPath(user), { replace: true });
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.05fr) minmax(430px, 0.95fr)" },
      }}
    >
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          position: "relative",
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
            <Stack direction="row" spacing={1.15} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "0.95rem",
                  bgcolor: "#E7FF18",
                  display: "grid",
                  placeItems: "center",
                  color: "#0F2144",
                }}
              >
                <BoltRoundedIcon sx={{ fontSize: "1.2rem" }} />
              </Box>

              <Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.1 }}>
                  {heroStatTitle}
                </Typography>
                <Typography sx={{ mt: 0.15, color: "rgba(232,240,248,0.82)", fontSize: "0.82rem" }}>
                  {heroStatBody}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          bgcolor: "#FBFCFE",
          display: "grid",
          placeItems: "center",
          px: { xs: 2, md: 3.5 },
          py: { xs: 3.2, md: 4.2 },
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 430 }}>
          <Typography
            variant="h1"
            sx={{
              color: "#20242B",
              fontSize: { xs: "2.2rem", md: "2.85rem" },
              lineHeight: 1.04,
              letterSpacing: "-0.05em",
            }}
          >
            {title}
          </Typography>

          <Typography sx={{ mt: 1, color: "#667084", fontSize: "1rem", lineHeight: 1.65, maxWidth: 330 }}>
            {subtitle}
          </Typography>

          <Stack spacing={1.55} sx={{ mt: 3.1 }}>
            {error ? (
              <Alert severity="error" sx={{ borderRadius: "0.9rem", fontSize: "0.82rem" }}>
                {error}
              </Alert>
            ) : null}

            <Box>
              <Typography sx={{ mb: 0.7, color: "#344054", fontSize: "0.82rem", fontWeight: 700 }}>
                Account Type
              </Typography>
              <AccountToggle value={accountType} onChange={setAccountType} />
            </Box>

            {isSignup && (
              <Box>
                <Typography sx={{ mb: 0.62, color: "#344054", fontSize: "0.82rem", fontWeight: 700 }}>
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="John Doe"
                  sx={fieldSx}
                  InputProps={{
                    endAdornment: <PersonOutlineRoundedIcon sx={{ color: "#8E98A9", fontSize: "1rem" }} />,
                  }}
                />
              </Box>
            )}

            <Box>
              <Typography sx={{ mb: 0.62, color: "#344054", fontSize: "0.82rem", fontWeight: 700 }}>
                Email or Phone Number
              </Typography>
              <TextField
                fullWidth
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={isSignup ? "hello@example.com" : "name@company.com"}
                sx={fieldSx}
                InputProps={{
                  startAdornment: !isSignup ? (
                    <PersonOutlineRoundedIcon sx={{ color: "#8E98A9", mr: 1, fontSize: "1rem" }} />
                  ) : undefined,
                  endAdornment: isSignup ? (
                    <AlternateEmailRoundedIcon sx={{ color: "#8E98A9", fontSize: "1rem" }} />
                  ) : undefined,
                }}
              />
            </Box>

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.62 }}>
                <Typography sx={{ color: "#344054", fontSize: "0.82rem", fontWeight: 700 }}>
                  Password
                </Typography>
                {!isSignup && (
                  <Typography
                    component={RouterLink}
                    to="/auth/signup"
                    sx={{ color: "#0E56C8", fontSize: "0.74rem", fontWeight: 700, textDecoration: "none" }}
                  >
                    Forgot Password?
                  </Typography>
                )}
              </Stack>

              <TextField
                fullWidth
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="........"
                sx={fieldSx}
                InputProps={{
                  startAdornment: !isSignup ? (
                    <LockOutlinedIcon sx={{ color: "#8E98A9", mr: 1, fontSize: "1rem" }} />
                  ) : undefined,
                  endAdornment: <VisibilityOffOutlinedIcon sx={{ color: "#8E98A9", fontSize: "1rem" }} />,
                }}
              />

              {isSignup && (
                <Typography sx={{ mt: 0.55, color: "#8B94A5", fontSize: "0.7rem", lineHeight: 1.45 }}>
                  Must be at least 8 characters with one special symbol.
                </Typography>
              )}
            </Box>

            {!isSignup && (
              <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: -0.2 }}>
                <Checkbox size="small" sx={{ p: 0 }} />
                <Typography sx={{ color: "#667084", fontSize: "0.82rem" }}>Keep me logged in</Typography>
              </Stack>
            )}

            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                mt: 0.4,
                minHeight: 54,
                borderRadius: "0.95rem",
                fontSize: "0.94rem",
                fontWeight: 700,
                textTransform: "none",
                background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                boxShadow: "0 18px 28px rgba(14,86,200,0.18)",
              }}
            >
              {isSubmitting ? "Please wait..." : isSignup ? "Create Account ->" : "Login"}
            </Button>

            <Typography sx={{ textAlign: "center", color: "#667084", fontSize: "0.94rem", pt: 0.5 }}>
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <Typography
                component={RouterLink}
                to={isSignup ? "/auth/login" : "/auth/signup"}
                sx={{
                  color: "#0E56C8",
                  fontSize: "0.94rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {isSignup ? "Login" : "Sign Up"}
              </Typography>
            </Typography>

            {isSignup && (
              <>
                <Divider sx={{ pt: 0.55, "&::before, &::after": { borderColor: "#E5EAF2" } }}>
                  <Typography
                    sx={{
                      color: "#98A2B3",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Or sign up with
                  </Typography>
                </Divider>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                  <SocialButton>Google</SocialButton>
                  <SocialButton>Apple</SocialButton>
                </Stack>

                <Typography sx={{ color: "#98A2B3", fontSize: "0.72rem", lineHeight: 1.6, textAlign: "center" }}>
                  By signing up, you agree to Sparkin Solar&apos;s Terms of Service and Privacy Policy.
                </Typography>
              </>
            )}

            {!isSignup && (
              <Divider sx={{ pt: 1.5, "&::before, &::after": { borderColor: "#E5EAF2" } }} />
            )}

            <Stack direction="row" justifyContent="space-between" sx={{ color: "#98A2B3", fontSize: "0.74rem", pt: 0.2 }}>
              <Typography sx={{ fontSize: "0.74rem", color: "#98A2B3" }}>
                © 2024 Sparkin Solar.
                <Box component="span" sx={{ display: "block" }}>
                  Atmospheric Precision.
                </Box>
              </Typography>

              <Stack direction="row" spacing={1.5}>
                <Typography sx={{ fontSize: "0.74rem", color: "#667084" }}>Privacy Policy</Typography>
                <Typography sx={{ fontSize: "0.74rem", color: "#667084" }}>Help Center</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
