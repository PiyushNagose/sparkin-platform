import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import {
  isRouteErrorResponse,
  Link as RouterLink,
  useLocation,
  useRouteError,
} from "react-router-dom";

function getMessage(error) {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return "We could not find a page at this address.";
    return error.statusText || `Request failed with status ${error.status}.`;
  }

  return error?.message || "Something interrupted this page while it was loading.";
}

function getHomePath(pathname) {
  if (pathname.startsWith("/admin")) return "/admin";
  if (pathname.startsWith("/vendor")) return "/vendor";
  if (pathname.startsWith("/customer")) return "/customer";
  return "/";
}

function PlatformRouteFallback({
  eyebrow = "404",
  title = "Page not found",
  message,
  showReload = false,
}) {
  const location = useLocation();
  const homePath = getHomePath(location.pathname);
  const displayPath = `${location.pathname}${location.search}`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, md: 6 },
        bgcolor: "#F3F7FB",
        background:
          "linear-gradient(180deg, #F7FBFF 0%, #EEF5F9 46%, #F6F8FB 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.46,
          backgroundImage:
            "linear-gradient(rgba(14,86,200,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(14,86,200,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 3, md: 5 }}
        alignItems="center"
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 1040,
          p: { xs: 2.2, sm: 3, md: 4 },
          borderRadius: "1.35rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(215,225,237,0.94)",
          boxShadow: "0 24px 70px rgba(16,29,51,0.12)",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: 390 },
            minHeight: { xs: 230, sm: 280, md: 340 },
            borderRadius: "1rem",
            overflow: "hidden",
            position: "relative",
            bgcolor: "#082544",
            display: "grid",
            placeItems: "center",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 72% 22%, rgba(255,196,79,0.32), transparent 30%), linear-gradient(145deg, #082544 0%, #0E56C8 58%, #22A673 100%)",
            }}
          />
          <Stack
            spacing={2}
            alignItems="center"
            sx={{ position: "relative", color: "#FFFFFF", textAlign: "center" }}
          >
            <Box
              sx={{
                width: 92,
                height: 92,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.32)",
                boxShadow: "0 18px 42px rgba(3,17,34,0.22)",
              }}
            >
              <SearchOffRoundedIcon sx={{ fontSize: "3rem" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "4.2rem", fontWeight: 900, lineHeight: 0.95 }}>
                404
              </Typography>
              <Typography sx={{ mt: 1, fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.82 }}>
                Route not connected
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Stack spacing={2.4} sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip
              icon={<SolarPowerRoundedIcon />}
              label="Sparkin Solar Platform"
              sx={{
                bgcolor: "#EAF4FF",
                color: "#0E56C8",
                fontWeight: 800,
                borderRadius: "0.7rem",
              }}
            />
            <Chip
              label={eyebrow}
              sx={{
                bgcolor: "#FFF7E6",
                color: "#936100",
                fontWeight: 900,
                borderRadius: "0.7rem",
              }}
            />
          </Stack>

          <Box>
            <Typography
              component="h1"
              sx={{
                color: "#102033",
                fontSize: { xs: "2rem", sm: "2.55rem", md: "3rem" },
                fontWeight: 900,
                lineHeight: 1.05,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                mt: 1.4,
                color: "#5B6B7F",
                fontSize: { xs: "0.98rem", sm: "1.05rem" },
                lineHeight: 1.75,
                maxWidth: 560,
              }}
            >
              {message}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 1.3,
              borderRadius: "0.8rem",
              bgcolor: "#F6F8FB",
              border: "1px solid #E4EAF2",
            }}
          >
            <Typography sx={{ color: "#8090A3", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>
              Requested path
            </Typography>
            <Typography
              sx={{
                mt: 0.4,
                color: "#1A2B3F",
                fontSize: "0.92rem",
                fontWeight: 800,
                overflowWrap: "anywhere",
              }}
            >
              {displayPath || "/"}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "#E8EEF5" }} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.1}>
            <Button
              component={RouterLink}
              to={homePath}
              variant="contained"
              startIcon={<HomeRoundedIcon />}
              sx={{
                minHeight: 48,
                borderRadius: "0.85rem",
                bgcolor: "#0E56C8",
                px: 2.3,
                fontWeight: 800,
                textTransform: "none",
                boxShadow: "0 12px 24px rgba(14,86,200,0.18)",
              }}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => window.history.back()}
              sx={{
                minHeight: 48,
                borderRadius: "0.85rem",
                borderColor: "#C9D5E3",
                color: "#1F344D",
                px: 2.1,
                fontWeight: 800,
                textTransform: "none",
              }}
            >
              Go Back
            </Button>
            {showReload ? (
              <Button
                variant="text"
                startIcon={<RefreshRoundedIcon />}
                onClick={() => window.location.reload()}
                sx={{
                  minHeight: 48,
                  borderRadius: "0.85rem",
                  color: "#0E56C8",
                  px: 2.1,
                  fontWeight: 800,
                  textTransform: "none",
                }}
              >
                Reload
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export function NotFoundPage() {
  return (
    <PlatformRouteFallback
      title="This route is not available"
      message="The address may be mistyped, moved, or not part of this workspace. Use the right dashboard link below to get back into the platform."
    />
  );
}

export function RouteErrorPage() {
  const error = useRouteError();

  return (
    <PlatformRouteFallback
      eyebrow={isRouteErrorResponse(error) ? error.status : "Error"}
      title={isRouteErrorResponse(error) && error.status === 404 ? "This route is not available" : "This page could not load"}
      message={getMessage(error)}
      showReload
    />
  );
}
