import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import vendorHeroPlaceholder from "@/shared/assets/images/public/vendors/vendor-discovery-hero-placeholder.png";
import vendorConsultPlaceholder from "@/shared/assets/images/public/vendors/vendor-consult-placeholder.png";
import styles from "@/app/layouts/PublicLayout.module.css";
import { publicVendorsApi } from "@/features/public/api/vendorsApi";

const PAGE_SIZE = 9;

const logoColors = ["#154D9F", "#2D8A43", "#C47A00", "#0E7A6A", "#233B63", "#C04A20"];

const SERVICE_OPTIONS = [
  { key: "installation", label: "Installation" },
  { key: "maintenance", label: "Maintenance" },
  { key: "siteSurvey", label: "Site Survey" },
  { key: "consultation", label: "Consultation" },
];

const EXPERIENCE_OPTIONS = [
  { label: "Any Experience", value: 0 },
  { label: "3+ Years", value: 3 },
  { label: "5+ Years", value: 5 },
  { label: "8+ Years", value: 8 },
  { label: "10+ Years", value: 10 },
];

const SORT_OPTIONS = [
  { label: "Most Recommended", value: "recommended" },
  { label: "Most Experience", value: "experience" },
  { label: "Most Projects", value: "projects" },
];

function getLogoText(name) {
  const words = (name || "").trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return (name || "??").slice(0, 2).toUpperCase();
}

function getLogoColor(index) {
  return logoColors[index % logoColors.length];
}

function buildServiceTags(services) {
  const map = {
    installation: "Installation",
    maintenance: "Maintenance",
    siteSurvey: "Site Survey",
    consultation: "Consultation",
  };
  return Object.entries(services || {})
    .filter(([, enabled]) => enabled)
    .map(([key]) => ({
      key,
      label: map[key] || key,
      color: "#0A7A40",
      bg: "#EDFFF5",
    }));
}

function normalizeVendor(profile, index) {
  const city = profile.company?.city || "";
  const state = profile.company?.state || "";
  const location = [city, state].filter(Boolean).join(", ") || "India";
  const years = profile.company?.experienceYears || 0;
  const projects = profile.company?.projectsCompleted || 0;

  return {
    vendorId: profile.vendorId,
    name: profile.company?.name || "Verified Partner",
    location,
    city,
    state,
    experienceYears: years,
    projectsCompleted: projects,
    expertise: years ? `${years}+ Years` : "Experienced",
    projects: projects ? `${projects}+ Projects` : "Multiple Projects",
    reviews: "Verified",
    tags: buildServiceTags(profile.services),
    services: profile.services || {},
    logoColor: getLogoColor(index),
    logoText: getLogoText(profile.company?.name || "VP"),
  };
}

// ── FilterChip with dropdown ──────────────────────────────────────────────────
function FilterChip({ icon, label, value, options, onChange, onClear }) {
  const [anchor, setAnchor] = useState(null);
  const isActive = Boolean(value);

  return (
    <>
      <Box
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          px: 1.3,
          py: 0.65,
          borderRadius: 999,
          cursor: "pointer",
          bgcolor: isActive ? "#0E56C8" : "white",
          border: isActive ? "1px solid #0E56C8" : "1px solid rgba(223,231,241,0.92)",
          color: isActive ? "white" : "#5E6B7E",
          display: "flex",
          alignItems: "center",
          gap: 0.55,
          fontSize: "0.76rem",
          fontWeight: 700,
          transition: "all 160ms ease",
          userSelect: "none",
          "&:hover": {
            bgcolor: isActive ? "#0B49AD" : "#F4F7FB",
          },
        }}
      >
        {icon}
        {isActive ? value : label}
        {isActive ? (
          <CloseRoundedIcon
            sx={{ fontSize: "0.85rem", ml: 0.2 }}
            onClick={(e) => { e.stopPropagation(); onClear(); }}
          />
        ) : (
          <KeyboardArrowDownRoundedIcon sx={{ fontSize: "0.95rem" }} />
        )}
      </Box>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{
          sx: {
            mt: 0.8,
            borderRadius: "0.9rem",
            boxShadow: "0 12px 32px rgba(16,29,51,0.12)",
            border: "1px solid rgba(223,231,241,0.9)",
            minWidth: 160,
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value ?? opt}
            onClick={() => { onChange(opt.value ?? opt); setAnchor(null); }}
            sx={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: (value === (opt.value ?? opt)) ? "#0E56C8" : "#344155",
              bgcolor: (value === (opt.value ?? opt)) ? "#EEF4FF" : "transparent",
              borderRadius: "0.5rem",
              mx: 0.5,
              my: 0.2,
              "&:hover": { bgcolor: "#F4F7FB" },
            }}
          >
            {opt.label ?? opt}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// ── VendorCard ────────────────────────────────────────────────────────────────
function VendorCard({ vendor, index, visible }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "1.4rem",
        bgcolor: "white",
        border: "1px solid rgba(223,231,241,0.9)",
        boxShadow: "0 6px 24px rgba(16,29,51,0.07)",
        height: "100%",
        overflow: "hidden",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionProperty: "transform, box-shadow, opacity",
        transitionDuration: `200ms, 200ms, 0.5s`,
        transitionDelay: `0ms, 0ms, ${Math.min(index, 8) * 0.06}s`,
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 16px 42px rgba(16,29,51,0.12)",
        },
      }}
    >
      <Box sx={{ p: { xs: 2.5, md: 3 }, display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Header */}
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: "1rem",
              bgcolor: vendor.logoColor,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: "0.95rem",
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            {vendor.logoText}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: "#18253A", fontSize: "1.05rem", fontWeight: 800, lineHeight: 1.25 }}>
              {vendor.name}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
              <PlaceOutlinedIcon sx={{ fontSize: "0.8rem", color: "#9AAABB" }} />
              <Typography sx={{ color: "#9AAABB", fontSize: "0.78rem" }}>
                {vendor.location}
              </Typography>
            </Stack>
          </Box>

          <Stack direction="column" alignItems="center" sx={{ flexShrink: 0 }}>
            <Stack
              direction="row"
              spacing={0.4}
              alignItems="center"
              sx={{ px: 1, py: 0.5, borderRadius: 999, bgcolor: "#FFF8E1", border: "1px solid rgba(240,196,25,0.3)" }}
            >
              <StarRoundedIcon sx={{ fontSize: "0.9rem", color: "#F0C419" }} />
              <Typography sx={{ color: "#18253A", fontSize: "0.82rem", fontWeight: 800 }}>4.5</Typography>
            </Stack>
            <Typography sx={{ mt: 0.4, color: "#B0BCCC", fontSize: "0.65rem" }}>Verified</Typography>
          </Stack>
        </Stack>

        {/* Stats */}
        <Stack direction="row" spacing={3.5} sx={{ mb: 2 }}>
          <Box>
            <Typography sx={{ color: "#9AAABB", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Experience
            </Typography>
            <Typography sx={{ mt: 0.4, color: "#18253A", fontSize: "0.88rem", fontWeight: 700 }}>
              {vendor.expertise}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: "#9AAABB", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Completed
            </Typography>
            <Typography sx={{ mt: 0.4, color: "#18253A", fontSize: "0.88rem", fontWeight: 700 }}>
              {vendor.projects}
            </Typography>
          </Box>
        </Stack>

        {/* Tags */}
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.7} sx={{ mb: 2.5 }}>
          {vendor.tags.map((tag) => (
            <Box
              key={tag.label}
              sx={{
                px: 1.1,
                py: 0.45,
                borderRadius: "0.5rem",
                bgcolor: tag.bg,
                color: tag.color,
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {tag.label}
            </Box>
          ))}
        </Stack>

        <Stack direction="row" spacing={1.2} sx={{ mt: "auto" }}>
          <Button
            component={RouterLink}
            to={`/vendors/${vendor.vendorId}`}
            variant="contained"
            sx={{
              flex: 1,
              minHeight: 44,
              borderRadius: "999px",
              fontSize: "0.82rem",
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(180deg, #1A66E8 0%, #0E56C8 100%)",
              boxShadow: "0 8px 20px rgba(14,86,200,0.22)",
            }}
          >
            View Profile
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function VendorDiscoveryPage() {
  const [allVendors, setAllVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState(0);
  const [serviceFilter, setServiceFilter] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [sortAnchor, setSortAnchor] = useState(null);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const heroRef = useRef(null);
  const filtersRef = useRef(null);
  const gridRef = useRef(null);
  const ctaRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  function observeOnce(ref, setter) {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setter(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }

  useEffect(() => observeOnce(heroRef, setHeroVisible), []);
  useEffect(() => observeOnce(filtersRef, setFiltersVisible), []);
  useEffect(() => observeOnce(gridRef, setGridVisible), []);
  useEffect(() => observeOnce(ctaRef, setCtaVisible), []);

  // Load all approved vendors
  useEffect(() => {
    let active = true;
    publicVendorsApi.listAllVendors()
      .then((profiles) => {
        if (active) setAllVendors(profiles.map(normalizeVendor));
      })
      .catch(() => {
        // fallback to featured
        publicVendorsApi.listFeaturedVendors()
          .then((profiles) => { if (active) setAllVendors(profiles.map(normalizeVendor)); })
          .catch(() => {});
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  // Build unique location options from data
  const locationOptions = useMemo(() => {
    const states = [...new Set(allVendors.map((v) => v.state).filter(Boolean))].sort();
    return states.map((s) => ({ label: s, value: s }));
  }, [allVendors]);

  // Filter + sort
  const filteredVendors = useMemo(() => {
    let result = [...allVendors];

    // Location
    if (locationFilter) {
      result = result.filter((v) => v.state === locationFilter || v.city === locationFilter);
    }

    // Experience
    if (experienceFilter > 0) {
      result = result.filter((v) => v.experienceYears >= experienceFilter);
    }

    // Service
    if (serviceFilter) {
      result = result.filter((v) => v.services?.[serviceFilter] === true);
    }

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((v) =>
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.tags.some((t) => t.label.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === "experience") {
      result.sort((a, b) => b.experienceYears - a.experienceYears);
    } else if (sortBy === "projects") {
      result.sort((a, b) => b.projectsCompleted - a.projectsCompleted);
    }

    return result;
  }, [allVendors, locationFilter, experienceFilter, serviceFilter, search, sortBy]);

  const visibleVendors = filteredVendors.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVendors.length;

  const activeFilterCount = [locationFilter, experienceFilter > 0, serviceFilter].filter(Boolean).length;

  function clearAllFilters() {
    setLocationFilter("");
    setExperienceFilter(0);
    setServiceFilter("");
    setSearch("");
    setVisibleCount(PAGE_SIZE);
  }

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [locationFilter, experienceFilter, serviceFilter, search, sortBy]);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Most Recommended";

  return (
    <Box sx={{ bgcolor: "#F7FAFB" }}>

      {/* ── Hero ── */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 340, md: 420 },
          backgroundImage: `linear-gradient(160deg, rgba(7,17,36,0.75) 0%, rgba(10,30,60,0.58) 50%, rgba(7,17,36,0.80) 100%), url(${vendorHeroPlaceholder})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth={false} disableGutters className={styles.publicContentContainer}>
          <Box sx={{ minHeight: { xs: 340, md: 420 }, display: "flex", alignItems: "center", py: { xs: 5, md: 7 } }}>
            <Box
              ref={heroRef}
              sx={{
                maxWidth: 520,
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex", px: 1.4, py: 0.5, borderRadius: 999,
                  bgcolor: "#E5F20D", color: "#3A4000", fontSize: "0.65rem",
                  fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", mb: 2,
                }}
              >
                240+ Curated Partners
              </Box>

              <Typography
                sx={{ color: "#FFFFFF", fontWeight: 900, fontSize: { xs: "2rem", md: "2.8rem" }, lineHeight: 1.1, letterSpacing: "-0.02em" }}
              >
                Explore Premier Solar{" "}
                <Box component="span" sx={{ display: "block" }}>Vendors</Box>
              </Typography>

              <Typography sx={{ mt: 1.5, maxWidth: 400, color: "rgba(241,246,255,0.75)", fontSize: "0.88rem", lineHeight: 1.65 }}>
                Compare top-rated solar providers and find the perfect match for your home.
              </Typography>

              <Stack direction="row" spacing={1.2} sx={{ mt: 2.8 }}>
                <Button
                  component={RouterLink} to="/booking" variant="contained"
                  sx={{ minHeight: 44, px: 2.2, borderRadius: "999px", fontSize: "0.85rem", fontWeight: 700, textTransform: "none", background: "linear-gradient(180deg, #1A66E8 0%, #0E56C8 100%)", boxShadow: "0 10px 24px rgba(14,86,200,0.3)" }}
                >
                  Get Instant Quotes
                </Button>
                <Button
                  component={RouterLink} to="/how-it-works" variant="contained"
                  sx={{ minHeight: 44, px: 2.2, borderRadius: "999px", fontSize: "0.85rem", fontWeight: 700, textTransform: "none", bgcolor: "rgba(255,255,255,0.14)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(8px)", boxShadow: "none", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
                >
                  How It Works
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth={false} disableGutters className={styles.publicContentContainer} sx={{ pb: { xs: 6, md: 9 } }}>

        {/* ── Filter bar ── */}
        <Box
          ref={filtersRef}
          sx={{
            mt: { xs: 3.5, md: 4.5 },
            mb: { xs: 3, md: 4 },
            opacity: filtersVisible ? 1 : 0,
            transform: filtersVisible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {/* Search bar */}
          <TextField
            placeholder="Search by name, location, or service…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                bgcolor: "white",
                fontSize: "0.84rem",
                height: 44,
                boxShadow: "0 2px 12px rgba(16,29,51,0.06)",
                "& fieldset": { borderColor: "rgba(223,231,241,0.9)" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: "1rem", color: "#9AAABB" }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <CloseRoundedIcon
                    sx={{ fontSize: "1rem", color: "#9AAABB", cursor: "pointer" }}
                    onClick={() => setSearch("")}
                  />
                </InputAdornment>
              ) : null,
            }}
          />

          {/* Filter chips + sort */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={1.5}
          >
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.8} alignItems="center">
              <FilterChip
                icon={<PlaceOutlinedIcon sx={{ fontSize: "0.85rem" }} />}
                label="Location"
                value={locationFilter || ""}
                options={locationOptions.length > 0 ? locationOptions : [{ label: "No states yet", value: "" }]}
                onChange={(val) => setLocationFilter(val)}
                onClear={() => setLocationFilter("")}
              />
              <FilterChip
                icon={<WorkOutlineRoundedIcon sx={{ fontSize: "0.85rem" }} />}
                label="Experience"
                value={experienceFilter > 0 ? `${experienceFilter}+ Yrs` : ""}
                options={EXPERIENCE_OPTIONS}
                onChange={(val) => setExperienceFilter(Number(val))}
                onClear={() => setExperienceFilter(0)}
              />
              <FilterChip
                icon={<TuneRoundedIcon sx={{ fontSize: "0.85rem" }} />}
                label="Services"
                value={SERVICE_OPTIONS.find((s) => s.key === serviceFilter)?.label || ""}
                options={SERVICE_OPTIONS.map((s) => ({ label: s.label, value: s.key }))}
                onChange={(val) => setServiceFilter(val)}
                onClear={() => setServiceFilter("")}
              />

              {activeFilterCount > 0 && (
                <Box
                  onClick={clearAllFilters}
                  sx={{
                    px: 1.2, py: 0.55, borderRadius: 999, cursor: "pointer",
                    bgcolor: "#FEF2F2", border: "1px solid #FCA5A5",
                    color: "#DC2626", fontSize: "0.72rem", fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 0.4,
                    "&:hover": { bgcolor: "#FEE2E2" },
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: "0.75rem" }} />
                  Clear all
                </Box>
              )}
            </Stack>

            {/* Sort */}
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ cursor: "pointer" }} onClick={(e) => setSortAnchor(e.currentTarget)}>
              <Typography sx={{ color: "#7A879A", fontSize: "0.76rem" }}>Sort by:</Typography>
              <Typography sx={{ color: "#0E56C8", fontSize: "0.78rem", fontWeight: 700 }}>{sortLabel}</Typography>
              <KeyboardArrowDownRoundedIcon sx={{ fontSize: "0.95rem", color: "#5E6B7E" }} />
            </Stack>

            <Menu
              anchorEl={sortAnchor}
              open={Boolean(sortAnchor)}
              onClose={() => setSortAnchor(null)}
              PaperProps={{ sx: { mt: 0.8, borderRadius: "0.9rem", boxShadow: "0 12px 32px rgba(16,29,51,0.12)", border: "1px solid rgba(223,231,241,0.9)", minWidth: 180 } }}
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setSortAnchor(null); }}
                  sx={{
                    fontSize: "0.82rem", fontWeight: 600,
                    color: sortBy === opt.value ? "#0E56C8" : "#344155",
                    bgcolor: sortBy === opt.value ? "#EEF4FF" : "transparent",
                    borderRadius: "0.5rem", mx: 0.5, my: 0.2,
                    "&:hover": { bgcolor: "#F4F7FB" },
                  }}
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Menu>
          </Stack>

          {/* Results count */}
          {!isLoading && (
            <Typography sx={{ mt: 1.5, color: "#9AAABB", fontSize: "0.76rem" }}>
              {filteredVendors.length === 0
                ? "No vendors found"
                : `Showing ${visibleVendors.length} of ${filteredVendors.length} verified partner${filteredVendors.length !== 1 ? "s" : ""}`}
            </Typography>
          )}
        </Box>

        {/* ── Vendor grid ── */}
        <Grid
          ref={gridRef}
          container
          spacing={{ xs: 2, md: 2.2 }}
          sx={{ opacity: gridVisible ? 1 : 0, transition: "opacity 0.6s ease" }}
        >
          {isLoading ? (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ py: 6, display: "grid", placeItems: "center" }}>
                <CircularProgress />
              </Box>
            </Grid>
          ) : filteredVendors.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  py: 6, textAlign: "center", borderRadius: "1.4rem",
                  bgcolor: "white", border: "1px solid rgba(223,231,241,0.9)",
                }}
              >
                <TuneRoundedIcon sx={{ fontSize: "2rem", color: "#C8D4E4", mb: 1 }} />
                <Typography sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}>
                  No vendors match your filters
                </Typography>
                <Typography sx={{ mt: 0.5, color: "#7A879A", fontSize: "0.84rem" }}>
                  Try adjusting or clearing the filters above
                </Typography>
                <Button
                  onClick={clearAllFilters}
                  sx={{ mt: 1.5, fontSize: "0.82rem", fontWeight: 700, textTransform: "none", color: "#0E56C8" }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          ) : (
            visibleVendors.map((vendor, index) => (
              <Grid key={vendor.vendorId} size={{ xs: 12, sm: 6, md: 4 }}>
                <VendorCard vendor={vendor} index={index} visible={gridVisible} />
              </Grid>
            ))
          )}
        </Grid>

        {/* ── Show more / Show less ── */}
        {!isLoading && filteredVendors.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3.5, md: 4.5 }, gap: 1.5 }}>
            {hasMore && (
              <Button
                variant="outlined"
                endIcon={<KeyboardArrowDownRoundedIcon />}
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                sx={{
                  minHeight: 42, px: 2.5, borderRadius: "999px",
                  fontSize: "0.84rem", fontWeight: 700, textTransform: "none",
                  borderColor: "rgba(223,231,241,0.9)", color: "#3A4A5C",
                  bgcolor: "white",
                  "&:hover": { borderColor: "#0E56C8", color: "#0E56C8", bgcolor: "#F4F8FF" },
                }}
              >
                Show more vendors ({filteredVendors.length - visibleCount} remaining)
              </Button>
            )}
          </Box>
        )}

        {/* ── CTA Banner ── */}
        <Box
          ref={ctaRef}
          sx={{
            mt: { xs: 5, md: 7 },
            borderRadius: "1.6rem",
            background: "linear-gradient(135deg, #0A1F4E 0%, #0E56C8 65%, #0A3A8A 100%)",
            color: "white",
            overflow: "hidden",
            position: "relative",
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ p: { xs: 3.5, md: 5 } }}>
                <Typography sx={{ fontSize: { xs: "1.7rem", md: "2.2rem" }, fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.02em", mb: 1.5 }}>
                  Can&apos;t decide on the right provider?
                </Typography>
                <Typography sx={{ color: "rgba(239,245,255,0.75)", fontSize: "0.88rem", lineHeight: 1.65, mb: 3, maxWidth: 380 }}>
                  Our expert solar advisors can help you compare quotes and select the optimal configuration for your energy needs — completely free.
                </Typography>
                <Button
                  component={RouterLink} to="/contact" variant="contained"
                  sx={{ minHeight: 46, px: 2.5, borderRadius: "999px", fontSize: "0.88rem", fontWeight: 700, textTransform: "none", bgcolor: "#E5F20D", color: "#162331", boxShadow: "0 8px 20px rgba(229,242,13,0.22)", "&:hover": { bgcolor: "#D4E00C" } }}
                >
                  Get Free Consultation
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{ height: { xs: 220, md: "100%" }, minHeight: { md: 280 }, backgroundImage: `url(${vendorConsultPlaceholder})`, backgroundSize: "cover", backgroundPosition: "center top" }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
