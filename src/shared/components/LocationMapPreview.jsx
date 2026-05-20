import { Box, Button, Stack, Typography } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

function normalizeAddressParts(address) {
  if (!address) return [];

  if (Array.isArray(address)) {
    return address.filter(Boolean);
  }

  if (typeof address === "string") {
    return [address];
  }

  return [
    address.street,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean);
}

function getAddressQuery(address) {
  const parts = normalizeAddressParts(address);
  if (!parts.length) return "";
  const hasCountry = parts.some((part) => String(part).toLowerCase().includes("india"));
  return [...parts, hasCountry ? null : "India"].filter(Boolean).join(", ");
}

export function getGoogleMapsUrl(address) {
  const query = getAddressQuery(address);
  return query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : "";
}

export function getGoogleMapsEmbedUrl(address) {
  const query = getAddressQuery(address);
  return query
    ? `https://maps.google.com/maps?q=${encodeURIComponent(query)}&maptype=roadmap&z=15&output=embed`
    : "";
}

export default function LocationMapPreview({
  address,
  label = "Location Preview",
  buttonLabel = "Map View",
  height = 186,
  sx,
}) {
  const mapUrl = getGoogleMapsUrl(address);
  const embedUrl = getGoogleMapsEmbedUrl(address);

  return (
    <Box
      sx={{
        overflow: "hidden",
        borderRadius: "1.15rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        ...sx,
      }}
    >
      {embedUrl ? (
        <Box
          component="iframe"
          title={label}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sx={{
            display: "block",
            width: "100%",
            height,
            border: 0,
          }}
        />
      ) : (
        <Box
          sx={{
            height,
            display: "grid",
            placeItems: "center",
            background:
              "linear-gradient(135deg, #EEF4FF 0%, #F7FAFC 48%, #E7F8EF 100%)",
            color: "#64748B",
            fontSize: "0.78rem",
            fontWeight: 700,
          }}
        >
          Location pending
        </Box>
      )}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 1.25, py: 0.95 }}
      >
        <Typography sx={{ color: "#6C788B", fontSize: "0.72rem", fontWeight: 600 }}>
          {label}
        </Typography>
        <Button
          component={mapUrl ? "a" : "button"}
          href={mapUrl || undefined}
          target={mapUrl ? "_blank" : undefined}
          rel={mapUrl ? "noreferrer" : undefined}
          disabled={!mapUrl}
          size="small"
          startIcon={<PlaceOutlinedIcon sx={{ fontSize: "0.9rem" }} />}
          endIcon={buttonLabel === "View Map" ? <OpenInNewRoundedIcon sx={{ fontSize: "0.9rem" }} /> : null}
          sx={{
            minHeight: 30,
            px: 1.1,
            borderRadius: "999px",
            bgcolor: "#FFFFFF",
            color: "#0E56C8",
            fontSize: "0.66rem",
            fontWeight: 850,
            textTransform: "none",
            boxShadow: "0 8px 16px rgba(16,29,51,0.08)",
            "&:hover": { bgcolor: "#F7FAFF" },
          }}
        >
          {buttonLabel}
        </Button>
      </Stack>
      {mapUrl ? (
        <Typography
          sx={{
            px: 1.25,
            pb: 1.1,
            color: "#5E6A7D",
            fontSize: "0.72rem",
            lineHeight: 1.4,
            minHeight: 32,
          }}
        >
          {normalizeAddressParts(address).join(", ")}
        </Typography>
      ) : null}
    </Box>
  );
}
