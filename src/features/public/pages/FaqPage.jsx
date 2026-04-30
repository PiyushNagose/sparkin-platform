import * as React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import layoutStyles from "@/app/layouts/PublicLayout.module.css";

const categories = [
  { label: "General", icon: <ElectricBoltRoundedIcon sx={{ fontSize: "0.85rem" }} /> },
  { label: "Pricing", icon: <CurrencyRupeeRoundedIcon sx={{ fontSize: "0.85rem" }} /> },
  { label: "Installation", icon: <ConstructionRoundedIcon sx={{ fontSize: "0.85rem" }} /> },
  { label: "Subsidy", icon: <AccountBalanceRoundedIcon sx={{ fontSize: "0.85rem" }} /> },
  { label: "Service", icon: <BuildRoundedIcon sx={{ fontSize: "0.85rem" }} /> },
];

const faqs = [
  {
    question: "How long does the typical installation process take?",
    answer:
      "The physical installation of panels usually takes only 1-3 days depending on the size of your roof. However, the entire process—including site assessment, design, permitting, and final utility interconnection—typically takes between 4 to 8 weeks from the moment you sign your contract.",
    highlights: [
      { label: "Permitting", text: "Handled by your specialist team" },
      { label: "Grid Connect", text: "Final utility inspection required" },
    ],
  },
  {
    question: "What happens to my energy production on cloudy days?",
  },
  {
    question: "Do solar panels require regular maintenance?",
  },
  {
    question: "How much can I realistically save on my monthly bill?",
  },
  {
    question: "What are the available government solar subsidies?",
  },
];

export default function FaqPage() {
  const [expanded, setExpanded] = React.useState(faqs[0].question);

  return (
    <Box
      sx={{
        py: publicPageSpacing.pageY,
        background:
          "radial-gradient(circle at top center, rgba(214,229,246,0.82) 0%, rgba(245,248,251,0.96) 22%, #F9FBFD 60%, #F7FAFB 100%)",
      }}
    >
      <Container maxWidth={false} disableGutters className={layoutStyles.publicContentContainer}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "flex-start" }}
          spacing={{ xs: 2.2, md: 3.2 }}
          className={layoutStyles.revealUp}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Typography
              variant="h1"
              sx={{
                ...publicTypography.heroTitle,
                color: "#18253A",
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              sx={{
                mt: 1.35,
                maxWidth: { xs: "100%", md: 420 },
                color: "#6E7B8E",
                ...publicTypography.sectionBody,
              }}
            >
              We&apos;re here to help you understand solar and make the transition as
              smooth as possible. Explore our comprehensive guides and quick answers.
            </Typography>
          </Box>

          <Chip
            label="Expert Support"
            sx={{
              mt: { xs: 0.75, md: 0.8 },
              height: 28,
              px: 0.4,
              borderRadius: 999,
              bgcolor: "#E4F20A",
              color: "#4E5400",
              fontSize: "0.64rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          />
        </Stack>

        <Box
          sx={{
            mt: { xs: 4.8, md: 5.8 },
            p: 0.9,
            borderRadius: "1.15rem",
            bgcolor: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(223,231,241,0.9)",
            boxShadow: "0 16px 36px rgba(16,29,51,0.06)",
          }}
        >
          <TextField
            fullWidth
            placeholder="What are you looking for today?"
            InputProps={{
              startAdornment: (
                <SearchRoundedIcon sx={{ color: "#8B97A9", fontSize: "1rem", mr: 1 }} />
              ),
              endAdornment: (
                <Box
                  sx={{
                    px: 0.8,
                    py: 0.35,
                    borderRadius: "0.65rem",
                    bgcolor: "#F5F7FB",
                    border: "1px solid #E6EBF3",
                    color: "#7D889A",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  Ctrl + F
                </Box>
              ),
              sx: {
                minHeight: { xs: 54, md: 56 },
                borderRadius: "0.9rem",
                bgcolor: "#FBFCFE",
              },
            }}
          />
        </Box>

        <Stack
          direction="row"
          spacing={1.2}
          sx={{ mt: { xs: 3.6, md: 4.1 }, flexWrap: "wrap", rowGap: 1.2 }}
        >
          {categories.map((category, index) => {
            const active = index === 0;

            return (
              <Chip
                key={category.label}
                icon={category.icon}
                label={category.label}
                sx={{
                  height: { xs: 32, md: 34 },
                  borderRadius: "0.8rem",
                  bgcolor: active ? "white" : "transparent",
                  color: active ? "#0E56C8" : "#4E5A6F",
                  border: active ? "1px solid #DCE6F5" : "1px solid transparent",
                  boxShadow: active ? "0 8px 18px rgba(14,86,200,0.08)" : "none",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  "& .MuiChip-icon": {
                    color: active ? "#0E56C8" : "#4E5A6F",
                    ml: 0.8,
                  },
                }}
              />
            );
          })}
        </Stack>

        <Stack spacing={{ xs: 1.35, md: 1.5 }} sx={{ mt: { xs: 4.2, md: 5 } }}>
          {faqs.map((item, index) => {
            const isOpen = expanded === item.question;

            return (
              <Accordion
                key={item.question}
                expanded={isOpen}
                onChange={() =>
                  setExpanded((current) => (current === item.question ? "" : item.question))
                }
                disableGutters
                elevation={0}
                sx={{
                  borderRadius: "1.35rem !important",
                  overflow: "hidden",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  boxShadow: isOpen
                    ? "0 16px 34px rgba(16,29,51,0.08)"
                    : "0 10px 24px rgba(16,29,51,0.04)",
                  "&::before": { display: "none" },
                  transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: "rgba(14,86,200,0.22)",
                    boxShadow: "0 16px 34px rgba(16,29,51,0.08)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: isOpen ? "#EAF1FF" : "#F4F6FA",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <KeyboardArrowDownRoundedIcon
                        sx={{
                          color: "#7C8AA0",
                          fontSize: "1rem",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </Box>
                  }
                  sx={{
                    px: { xs: 1.6, md: 2.5 },
                    py: isOpen ? { xs: 1.05, md: 1.25 } : { xs: 0.8, md: 0.85 },
                    minHeight: 0,
                    "& .MuiAccordionSummary-content": {
                      my: { xs: 0.65, md: 0.7 },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#18253A",
                      fontSize: { xs: "0.9rem", md: "0.98rem" },
                      fontWeight: 700,
                      pr: 1,
                    }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>

                {index === 0 && (
                  <AccordionDetails
                    sx={{
                      px: { xs: 1.6, md: 2.5 },
                      pb: { xs: 1.85, md: 2.3 },
                      pt: 0.2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#6B7890",
                        fontSize: { xs: "0.88rem", md: "0.92rem" },
                        lineHeight: 1.8,
                        maxWidth: 1020,
                      }}
                    >
                      {item.answer}
                    </Typography>

                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={{ xs: 1, md: 1.25 }}
                      sx={{ mt: { xs: 1.6, md: 2.1 } }}
                    >
                      {item.highlights.map((highlight) => (
                        <Box
                          key={highlight.label}
                          sx={{
                            flex: 1,
                            p: { xs: 1.05, md: 1.2 },
                            borderRadius: "0.95rem",
                            bgcolor: "#F6F8FC",
                            border: "1px solid #E9EEF6",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#18253A",
                              fontSize: { xs: "0.78rem", md: "0.82rem" },
                              fontWeight: 800,
                            }}
                          >
                            {highlight.label}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.35,
                              color: "#7A879A",
                              fontSize: { xs: "0.72rem", md: "0.75rem" },
                              lineHeight: 1.6,
                            }}
                          >
                            {highlight.text}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </AccordionDetails>
                )}
              </Accordion>
            );
          })}
        </Stack>

        <Box
          sx={{
            mt: { xs: 7.5, md: 9.5 },
            p: { xs: 3.3, md: 5 },
            borderRadius: "2rem",
            background: "linear-gradient(180deg, #0E56C8 0%, #114CB2 100%)",
            color: "white",
            textAlign: "center",
            boxShadow: "0 22px 48px rgba(14,86,200,0.18)",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1.04,
            }}
          >
            Still have questions about
            <Box component="span" sx={{ display: "block" }}>
              making the switch?
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              mx: "auto",
              maxWidth: 520,
              color: "rgba(240,245,255,0.84)",
              fontSize: { xs: "0.9rem", md: "0.95rem" },
              lineHeight: 1.8,
            }}
          >
            Our solar experts are available for a one-on-one consultation to discuss
            your home&apos;s unique energy potential.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
            sx={{ mt: 3.1 }}
          >
            <Button
              variant="contained"
              sx={{
                minWidth: 174,
                minHeight: 44,
                borderRadius: "0.72rem",
                fontSize: "0.84rem",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#DDF509",
                color: "#162331",
                boxShadow: "none",
              }}
            >
              Schedule a Free Call
            </Button>
            <Button
              variant="contained"
              sx={{
                minWidth: 164,
                minHeight: 44,
                borderRadius: "0.72rem",
                fontSize: "0.84rem",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "rgba(255,255,255,0.12)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "none",
              }}
            >
              Chat with Support
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
