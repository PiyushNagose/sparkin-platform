import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  VendorPageHeader,
  VendorPageShell,
} from "@/features/vendor/components/VendorPortalUI";

// ─── data ─────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  {
    icon: DescriptionOutlinedIcon,
    title: "Getting Started",
    description:
      "Set up your vendor profile, upload documents, and get verified.",
    href: "/vendor/profile",
    tone: "#0E56C8",
    bg: "#EEF4FF",
  },
  {
    icon: MenuBookOutlinedIcon,
    title: "Leads & Quotes",
    description:
      "Understand how leads are assigned and how to submit winning proposals.",
    href: "/vendor/leads",
    tone: "#239654",
    bg: "#E4F7EA",
  },
  {
    icon: VerifiedOutlinedIcon,
    title: "Projects & Milestones",
    description:
      "Track installation stages, update milestones, and upload documents.",
    href: "/vendor/projects",
    tone: "#7C7A00",
    bg: "#F2F08E",
  },
  {
    icon: ChatOutlinedIcon,
    title: "Support Chat",
    description:
      "Chat directly with the Sparkin team for real-time assistance.",
    href: "/vendor/chat",
    tone: "#0E56C8",
    bg: "#EEF4FF",
  },
];

const FAQS = [
  {
    question: "How do I get leads assigned to me?",
    answer:
      "Leads are assigned by the Sparkin admin team based on your service area, verification status, and capacity. Make sure your profile is complete and your verification is approved to receive leads.",
  },
  {
    question: "How do I submit a quote for a lead?",
    answer:
      "Go to Leads, open the lead you want to quote, and click 'Submit Quote'. Fill in your pricing, system specifications, and installation timeline. You can also save a draft before submitting.",
  },
  {
    question: "What happens after my quote is accepted?",
    answer:
      "Once a customer accepts your quote, a project is automatically created in your Projects section. You'll need to complete the onboarding form and begin updating milestones as the installation progresses.",
  },
  {
    question: "How do I get my profile verified?",
    answer:
      "Go to your Profile page, fill in your company details, and upload the required documents (company registration, certifications). Then click 'Submit for Verification'. The admin team will review and approve within 2–3 business days.",
  },
  {
    question: "When and how do I receive payments?",
    answer:
      "Payments are released in milestones tied to project progress — typically 10% on booking, 50% on installation, and 40% on activation. You can track all invoices and payment status in the Payments section.",
  },
  {
    question: "Can I withdraw a quote I already submitted?",
    answer:
      "You can contact the Sparkin support team via chat to request a quote withdrawal before it is accepted by the customer. Once accepted, the quote cannot be withdrawn.",
  },
  {
    question: "What documents do I need to upload?",
    answer:
      "You need to upload your company registration certificate and any relevant solar installation certifications. Accepted formats are PDF, JPG, PNG, and WEBP. Each file must be under 5MB.",
  },
  {
    question: "How do I update a project milestone?",
    answer:
      "Open the project from your Projects page, scroll to the Milestones section, and click 'Update' on the current milestone. You can mark it as in-progress or completed and add notes.",
  },
];

const CONTACT_CHANNELS = [
  {
    icon: ChatOutlinedIcon,
    label: "Live Chat",
    description: "Fastest response — usually within minutes.",
    action: "Open Chat",
    href: "/vendor/chat",
    internal: true,
    tone: "#0E56C8",
    bg: "#EEF4FF",
  },
  {
    icon: EmailOutlinedIcon,
    label: "Email Support",
    description: "support@sparkin.in — response within 24 hours.",
    action: "Send Email",
    href: "mailto:support@sparkin.in",
    internal: false,
    tone: "#239654",
    bg: "#E4F7EA",
  },
  {
    icon: PhoneOutlinedIcon,
    label: "Phone Support",
    description: "Mon–Sat, 9 AM – 6 PM IST.",
    action: "+91 98765 43210",
    href: "tel:+919876543210",
    internal: false,
    tone: "#7C7A00",
    bg: "#F2F08E",
  },
];

// ─── sub-components ──────────────────────────────────────────────────────────

function QuickLinkCard({ item }) {
  const Icon = item.icon;

  return (
    <Box
      component={RouterLink}
      to={item.href}
      sx={{
        p: { xs: 1.6, md: 1.9 },
        borderRadius: "1.2rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 4px 16px rgba(16,29,51,0.05)",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        gap: 1.1,
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(16,29,51,0.1)",
          transform: "translateY(-2px)",
          borderColor: item.tone,
        },
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "0.9rem",
          bgcolor: item.bg,
          color: item.tone,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: "1.1rem" }} />
      </Box>
      <Box>
        <Typography
          sx={{ color: "#18253A", fontSize: "0.92rem", fontWeight: 800 }}
        >
          {item.title}
        </Typography>
        <Typography
          sx={{
            mt: 0.35,
            color: "#6F7D8F",
            fontSize: "0.76rem",
            lineHeight: 1.6,
          }}
        >
          {item.description}
        </Typography>
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.4}
        sx={{ mt: "auto" }}
      >
        <Typography
          sx={{ color: item.tone, fontSize: "0.74rem", fontWeight: 700 }}
        >
          Go there
        </Typography>
        <ArrowForwardRoundedIcon
          sx={{ color: item.tone, fontSize: "0.82rem" }}
        />
      </Stack>
    </Box>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        borderRadius: "1rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        overflow: "hidden",
        transition: "box-shadow 0.15s",
        boxShadow: open ? "0 6px 20px rgba(16,29,51,0.07)" : "none",
      }}
    >
      <Button
        onClick={() => setOpen((prev) => !prev)}
        fullWidth
        disableRipple
        sx={{
          px: { xs: 1.6, md: 2 },
          py: 1.4,
          justifyContent: "space-between",
          textAlign: "left",
          textTransform: "none",
          borderRadius: 0,
          color: "#18253A",
          "&:hover": { bgcolor: "#F7F9FC" },
        }}
      >
        <Typography
          sx={{ fontSize: "0.88rem", fontWeight: 700, lineHeight: 1.4, pr: 1 }}
        >
          {question}
        </Typography>
        <ExpandMoreRoundedIcon
          sx={{
            color: "#8B97A8",
            fontSize: "1.1rem",
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Button>

      {open && (
        <>
          <Divider sx={{ borderColor: "rgba(225,232,241,0.96)" }} />
          <Box sx={{ px: { xs: 1.6, md: 2 }, py: 1.4 }}>
            <Typography
              sx={{ color: "#4F5F73", fontSize: "0.82rem", lineHeight: 1.75 }}
            >
              {answer}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

function ContactCard({ item }) {
  const Icon = item.icon;

  return (
    <Box
      sx={{
        p: { xs: 1.6, md: 1.9 },
        borderRadius: "1.2rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 4px 16px rgba(16,29,51,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 1.2,
      }}
    >
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "0.9rem",
            bgcolor: item.bg,
            color: item.tone,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: "1.1rem" }} />
        </Box>
        <Box>
          <Typography
            sx={{ color: "#18253A", fontSize: "0.92rem", fontWeight: 800 }}
          >
            {item.label}
          </Typography>
          <Typography
            sx={{
              mt: 0.2,
              color: "#6F7D8F",
              fontSize: "0.74rem",
              lineHeight: 1.5,
            }}
          >
            {item.description}
          </Typography>
        </Box>
      </Stack>

      <Button
        component={item.internal ? RouterLink : "a"}
        to={item.internal ? item.href : undefined}
        href={item.internal ? undefined : item.href}
        variant="outlined"
        sx={{
          minHeight: 38,
          borderRadius: "0.9rem",
          borderColor: item.tone,
          color: item.tone,
          fontSize: "0.76rem",
          fontWeight: 700,
          textTransform: "none",
          "&:hover": { bgcolor: item.bg, borderColor: item.tone },
        }}
      >
        {item.action}
      </Button>
    </Box>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function VendorHelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = FAQS.filter(
    (faq) =>
      !searchTerm.trim() ||
      faq.question.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  return (
    <VendorPageShell>
      <VendorPageHeader
        title="Help Center"
        subtitle="Find answers, guides, and support for your Sparkin vendor account."
      />

      {/* Hero search */}
      <Box
        sx={{
          p: { xs: 2.2, md: 3 },
          mb: { xs: 2.4, md: 3 },
          borderRadius: "1.45rem",
          background:
            "linear-gradient(135deg, #0E56C8 0%, #1A6FE8 55%, #0B49AD 100%)",
          boxShadow: "0 18px 34px rgba(14,86,200,0.22)",
          color: "#FFFFFF",
        }}
      >
        <Stack
          direction="row"
          spacing={1.2}
          alignItems="center"
          sx={{ mb: 0.6 }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "0.85rem",
              bgcolor: "rgba(255,255,255,0.14)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <HelpOutlineRoundedIcon sx={{ fontSize: "1rem" }} />
          </Box>
          <Typography sx={{ fontSize: "1.25rem", fontWeight: 800 }}>
            How can we help you?
          </Typography>
        </Stack>
        <Typography
          sx={{
            mb: 2,
            color: "rgba(255,255,255,0.78)",
            fontSize: "0.84rem",
            lineHeight: 1.6,
            maxWidth: 480,
          }}
        >
          Search our knowledge base or browse the topics below.
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search FAQs — e.g. 'how to submit a quote'"
          sx={{
            maxWidth: 520,
            "& .MuiOutlinedInput-root": {
              height: 44,
              borderRadius: "999px",
              bgcolor: "#FFFFFF",
              fontSize: "0.84rem",
              "& fieldset": { borderColor: "transparent" },
              "&:hover fieldset": { borderColor: "transparent" },
              "&.Mui-focused fieldset": { borderColor: "transparent" },
            },
          }}
          InputProps={{
            startAdornment: (
              <SearchRoundedIcon
                sx={{ color: "#8B97A8", fontSize: "1.05rem", mr: 0.8 }}
              />
            ),
          }}
        />
      </Box>

      {/* Quick links */}
      <Typography
        sx={{ mb: 1.4, color: "#18253A", fontSize: "1rem", fontWeight: 800 }}
      >
        Quick Links
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: 1.4,
          mb: { xs: 2.8, md: 3.2 },
        }}
      >
        {QUICK_LINKS.map((item) => (
          <QuickLinkCard key={item.title} item={item} />
        ))}
      </Box>

      {/* FAQs */}
      <Typography
        sx={{ mb: 1.4, color: "#18253A", fontSize: "1rem", fontWeight: 800 }}
      >
        Frequently Asked Questions
        {searchTerm.trim() && (
          <Typography
            component="span"
            sx={{
              ml: 1,
              color: "#8B97A8",
              fontSize: "0.78rem",
              fontWeight: 600,
            }}
          >
            — {filteredFaqs.length} result{filteredFaqs.length === 1 ? "" : "s"}
          </Typography>
        )}
      </Typography>

      <Stack spacing={0.85} sx={{ mb: { xs: 2.8, md: 3.2 } }}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))
        ) : (
          <Box
            sx={{
              py: 3.5,
              borderRadius: "1.2rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: "#8B97A8", fontSize: "0.84rem" }}>
              No FAQs match "{searchTerm}". Try a different search or contact
              support below.
            </Typography>
          </Box>
        )}
      </Stack>

      {/* Contact support */}
      <Typography
        sx={{ mb: 1.4, color: "#18253A", fontSize: "1rem", fontWeight: 800 }}
      >
        Still need help?
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 1.4,
        }}
      >
        {CONTACT_CHANNELS.map((item) => (
          <ContactCard key={item.label} item={item} />
        ))}
      </Box>
    </VendorPageShell>
  );
}
