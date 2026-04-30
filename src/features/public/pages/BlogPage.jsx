import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";
import SolarPowerOutlinedIcon from "@mui/icons-material/SolarPowerOutlined";
import { Link as RouterLink } from "react-router-dom";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import layoutStyles from "@/app/layouts/PublicLayout.module.css";
import liveBiddingImage from "@/shared/assets/images/public/bidding/live-bidding-hero-placeholder.png";
import partnerHeroImage from "@/shared/assets/images/public/partners/trusted-partners-hero-placeholder.png";
import serviceNetworkImage from "@/shared/assets/images/public/support/service-network-placeholder.png";

const posts = [
  {
    title: "Inside Sparkin's verified installer scorecard",
    tag: "Company",
    text: "How we evaluate partner quality before customers ever see a quote.",
    icon: <Groups2OutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  {
    title: "Why live bidding helps solar buyers save more",
    tag: "Product",
    text: "A look at transparent competition, faster quote discovery, and clearer choices.",
    icon: <BoltRoundedIcon sx={{ fontSize: "1rem" }} />,
  },
  {
    title: "The service layer solar adoption needs",
    tag: "Operations",
    text: "Why maintenance, monitoring, and project visibility matter after installation.",
    icon: <SolarPowerOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
];

const updates = [
  { metric: "24", label: "new city clusters" },
  { metric: "18%", label: "faster quote turnaround" },
  { metric: "42k", label: "monthly saving estimates" },
];

export default function BlogPage() {
  return (
    <Box
      sx={{
        py: publicPageSpacing.pageY,
        background:
          "radial-gradient(circle at top center, rgba(214,229,246,0.82) 0%, rgba(245,248,251,0.96) 24%, #F9FBFD 64%, #F7FAFB 100%)",
      }}
    >
      <Container maxWidth={false} disableGutters className={layoutStyles.publicContentContainer}>
        <Grid container spacing={{ xs: 3.5, md: 5 }} alignItems="center" sx={{ mb: publicPageSpacing.sectionBottom }}>
          <Grid size={{ xs: 12, md: 6.2 }}>
            <Chip
              label="Sparkin Blog"
              sx={{
                height: 30,
                borderRadius: 999,
                bgcolor: "#E5F20D",
                color: "#566000",
                fontSize: "0.64rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            />
            <Typography variant="h1" sx={{ mt: 1.35, ...publicTypography.heroTitle, color: "#18253A", maxWidth: 690 }}>
              Stories from the teams building India&apos;s solar marketplace.
            </Typography>
            <Typography sx={{ mt: 1.45, color: "#6E7B8E", maxWidth: 540, ...publicTypography.sectionBody }}>
              Follow product updates, partner stories, operations notes, and
              behind-the-scenes thinking from Sparkin.
            </Typography>
            <Button
              component={RouterLink}
              to="/contact"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                mt: 2.7,
                minHeight: 46,
                px: 2.3,
                borderRadius: "0.72rem",
                fontSize: "0.86rem",
                fontWeight: 800,
                textTransform: "none",
                background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                boxShadow: "0 14px 28px rgba(14,86,200,0.16)",
              }}
            >
              Talk to Sparkin
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 5.8 }}>
            <Box
              sx={{
                minHeight: { xs: 330, md: 390 },
                borderRadius: "2rem",
                overflow: "hidden",
                position: "relative",
                backgroundImage: `linear-gradient(180deg, rgba(7,22,55,0.06) 0%, rgba(7,22,55,0.54) 100%), url(${partnerHeroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 24px 52px rgba(16,29,51,0.14)",
              }}
            >
              <Box sx={{ position: "absolute", left: 24, right: 24, bottom: 24, p: 2.2, borderRadius: "1.3rem", bgcolor: "rgba(255,255,255,0.94)", boxShadow: "0 14px 30px rgba(12,29,56,0.18)" }}>
                <Typography sx={{ color: "#13A66B", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Featured update
                </Typography>
                <Typography sx={{ mt: 0.75, color: "#18253A", fontSize: "1.15rem", fontWeight: 800 }}>
                  Building trust into every solar quote
                </Typography>
                <Typography sx={{ mt: 0.6, color: "#6E7B8E", fontSize: "0.84rem", lineHeight: 1.68 }}>
                  How partner signals help customers choose with confidence.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ mb: publicPageSpacing.sectionBottom }}>
          {updates.map((item) => (
            <Grid key={item.label} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: { xs: 1.8, md: 2.2 },
                  borderRadius: "1.25rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.6,
                }}
              >
                <Box sx={{ width: 42, height: 42, borderRadius: "1rem", bgcolor: "#EAF1FF", color: "#0E56C8", display: "grid", placeItems: "center" }}>
                  <AutoAwesomeOutlinedIcon />
                </Box>
                <Box>
                  <Typography sx={{ color: "#18253A", fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                    {item.metric}
                  </Typography>
                  <Typography sx={{ mt: 0.45, color: "#6E7B8E", fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {item.label}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={{ xs: 2.2, md: 2.8 }} sx={{ mb: publicPageSpacing.sectionBottom }}>
          {posts.map((post) => (
            <Grid key={post.title} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  height: "100%",
                  minHeight: 250,
                  p: { xs: 2.2, md: 2.5 },
                  borderRadius: "1.45rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  boxShadow: "0 12px 28px rgba(16,29,51,0.05)",
                }}
              >
                <Box sx={{ width: 38, height: 38, borderRadius: "0.9rem", bgcolor: "#DDF8E8", color: "#12A765", display: "grid", placeItems: "center", mb: 1.45 }}>
                  {post.icon}
                </Box>
                <Typography sx={{ color: "#0E56C8", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {post.tag}
                </Typography>
                <Typography sx={{ mt: 0.8, color: "#18253A", fontSize: "1.08rem", fontWeight: 800, lineHeight: 1.3 }}>
                  {post.title}
                </Typography>
                <Typography sx={{ mt: 0.95, color: "#6E7B8E", fontSize: "0.88rem", lineHeight: 1.75 }}>
                  {post.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ height: "100%", minHeight: 330, borderRadius: "1.8rem", backgroundImage: `linear-gradient(180deg, rgba(7,22,55,0.04) 0%, rgba(7,22,55,0.34) 100%), url(${liveBiddingImage})`, backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 18px 40px rgba(16,29,51,0.1)" }} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ height: "100%", p: { xs: 2.5, md: 3.2 }, borderRadius: "1.8rem", background: "linear-gradient(180deg, #121C32 0%, #182641 100%)", color: "white" }}>
              <NewspaperRoundedIcon sx={{ color: "#DDF509", fontSize: "2rem" }} />
              <Typography sx={{ mt: 1.7, fontSize: { xs: "1.55rem", md: "2rem" }, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08 }}>
                Subscribe for solar market notes.
              </Typography>
              <Typography sx={{ mt: 1.15, color: "rgba(235,241,248,0.72)", fontSize: "0.92rem", lineHeight: 1.8 }}>
                Get product updates, partner launches, buyer insights, and service
                improvements from the Sparkin team.
              </Typography>
              <Box sx={{ mt: 2.5, minHeight: 54, borderRadius: "0.95rem", bgcolor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", px: 1.6, color: "rgba(255,255,255,0.58)", fontSize: "0.86rem" }}>
                newsletter@sparkin.com
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
