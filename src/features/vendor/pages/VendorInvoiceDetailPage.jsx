import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { Link as RouterLink } from "react-router-dom";
import invoiceBannerPlaceholder from "@/shared/assets/images/vendor/payments/invoice-banner-placeholder.png";

const summaryStats = [
  ["Invoice ID", "#INV-2023-8821"],
  ["Issued Date", "Oct 24, 2023"],
  ["Status", "Paid"],
];

const customerRows = [
  ["Full Name", "Arjun Mehta"],
  ["Email", "arjun.m@example.com"],
  ["Contact Number", "+91 98765 43210"],
];

const paymentRows = [
  ["Method", "HDFC Bank •••• 8821"],
  ["Transaction ID", "TXN-992810"],
  ["Date", "Oct 24, 2023, 11:42 AM"],
];

const projectRows = [
  ["Project ID", "SPK-2023-9842"],
  ["System Size", "5kW Off-Grid System"],
  ["Location", "Pune, Maharashtra"],
];

const invoiceRows = [
  ["Panel & Equipment Cost", "\u20B91,80,000"],
  ["Installation & Labor", "\u20B945,000"],
  ["GST (18%)", "\u20B920,000"],
];

function InfoCard({ icon, title, rows, dark }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: "1.2rem",
        bgcolor: dark ? "#0E56C8" : "#FFFFFF",
        color: dark ? "#FFFFFF" : "#223146",
        border: dark ? "none" : "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
      }}
    >
      <Stack
        direction="row"
        spacing={0.8}
        alignItems="center"
        sx={{ mb: 1.35 }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "0.8rem",
            bgcolor: dark ? "rgba(255,255,255,0.14)" : "#EEF4FF",
            color: dark ? "#FFFFFF" : "#0E56C8",
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontSize: "0.96rem", fontWeight: 800 }}>
          {title}
        </Typography>
      </Stack>

      <Stack spacing={1.1}>
        {rows.map(([label, value]) => (
          <Stack
            key={label}
            direction="row"
            justifyContent="space-between"
            spacing={1.2}
          >
            <Typography
              sx={{
                color: dark ? "rgba(255,255,255,0.74)" : "#6F7D8F",
                fontSize: "0.76rem",
                lineHeight: 1.5,
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{
                color: dark ? "#FFFFFF" : "#223146",
                fontSize: "0.76rem",
                fontWeight: 700,
                lineHeight: 1.5,
                textAlign: "right",
              }}
            >
              {value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

export default function VendorInvoiceDetailPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <Button
        component={RouterLink}
        to="/vendor/payments/transactions"
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: "1rem" }} />}
        sx={{
          mb: 2.2,
          px: 0,
          minHeight: 28,
          color: "#556478",
          fontSize: "0.78rem",
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        Back to Transactions
      </Button>

      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={2}
        sx={{ mb: 2.2 }}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.95rem", md: "2.1rem" },
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            Invoice Details
          </Typography>
          <Typography
            sx={{
              mt: 0.45,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
              maxWidth: 360,
            }}
          >
            Transaction overview for completed solar installation.
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.9} sx={{ flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<ShareOutlinedIcon />}
            sx={{
              minHeight: 38,
              px: 1.35,
              borderRadius: "0.95rem",
              borderColor: "rgba(208,216,226,0.95)",
              bgcolor: "#FFFFFF",
              color: "#223146",
              fontSize: "0.74rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Share
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintOutlinedIcon />}
            sx={{
              minHeight: 38,
              px: 1.35,
              borderRadius: "0.95rem",
              borderColor: "rgba(208,216,226,0.95)",
              bgcolor: "#FFFFFF",
              color: "#223146",
              fontSize: "0.74rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadRoundedIcon />}
            sx={{
              minHeight: 38,
              px: 1.5,
              borderRadius: "0.95rem",
              bgcolor: "#0E56C8",
              boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
              fontSize: "0.74rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Download Invoice
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          p: 1.6,
          borderRadius: "1.35rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          mb: 1.7,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 1.5,
          }}
        >
          {summaryStats.map(([label, value]) => (
            <Box key={label}>
              <Typography
                sx={{
                  color: "#8B97A8",
                  fontSize: "0.56rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </Typography>
              {label === "Status" ? (
                <Box
                  sx={{
                    mt: 1.02,
                    display: "inline-flex",
                    px: 0.9,
                    py: 0.36,
                    borderRadius: "999px",
                    bgcolor: "#5AE56F",
                    color: "#1C6E2A",
                    fontSize: "0.64rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {value}
                </Box>
              ) : (
                <Typography
                  sx={{
                    mt: 0.95,
                    color: "#223146",
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    lineHeight: 1.2,
                  }}
                >
                  {value}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 1.8 }}>
          <Typography
            sx={{
              color: "#8B97A8",
              fontSize: "0.56rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Total Amount Paid
          </Typography>
          <Typography
            sx={{
              mt: 0.85,
              color: "#0E56C8",
              fontSize: "2rem",
              fontWeight: 800,
              lineHeight: 1.05,
            }}
          >
            \u20B92,45,000
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
          gap: 1.6,
          mb: 1.6,
        }}
      >
        <InfoCard
          icon={<PersonOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />}
          title="Customer Information"
          rows={customerRows}
        />
        <InfoCard
          icon={<PaymentsOutlinedIcon sx={{ fontSize: "0.95rem" }} />}
          title="Payment Summary"
          rows={paymentRows}
          dark
        />
        <InfoCard
          icon={<ConstructionOutlinedIcon sx={{ fontSize: "0.95rem" }} />}
          title="Project Details"
          rows={projectRows}
        />

        <Box
          sx={{
            p: 1.5,
            borderRadius: "1.2rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Stack
            direction="row"
            spacing={0.8}
            alignItems="center"
            sx={{ mb: 1.35 }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "0.8rem",
                bgcolor: "#EEF4FF",
                color: "#0E56C8",
                display: "grid",
                placeItems: "center",
              }}
            >
              <ReceiptLongOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            </Box>
            <Typography
              sx={{ color: "#223146", fontSize: "0.96rem", fontWeight: 800 }}
            >
              Invoice Breakdown
            </Typography>
          </Stack>

          <Stack spacing={1.05}>
            {invoiceRows.map(([label, value]) => (
              <Stack
                key={label}
                direction="row"
                justifyContent="space-between"
                spacing={1.2}
              >
                <Typography sx={{ color: "#6F7D8F", fontSize: "0.76rem" }}>
                  {label}
                </Typography>
                <Typography
                  sx={{
                    color: "#223146",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                  }}
                >
                  {value}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Box
            sx={{
              mt: 1.35,
              pt: 1.2,
              borderTop: "1px solid rgba(231,236,242,0.96)",
            }}
          >
            <Stack direction="row" justifyContent="space-between" spacing={1.2}>
              <Typography
                sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
              >
                Total Paid
              </Typography>
              <Typography
                sx={{
                  color: "#223146",
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  lineHeight: 1.05,
                }}
              >
                \u20B92,45,000
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "1.4rem",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        }}
      >
        <Box
          component="img"
          src={invoiceBannerPlaceholder}
          alt="Invoice solar installation banner placeholder"
          sx={{
            display: "block",
            width: "100%",
            height: { xs: 180, md: 210 },
            objectFit: "cover",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            left: { xs: 18, md: 24 },
            bottom: { xs: 18, md: 22 },
          }}
        >
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: { xs: "1rem", md: "1.35rem" },
              fontWeight: 800,
            }}
          >
            System is Active & Delivering Power
          </Typography>
          <Typography
            sx={{
              mt: 0.35,
              color: "rgba(255,255,255,0.78)",
              fontSize: "0.72rem",
              lineHeight: 1.5,
            }}
          >
            Installation verified and certified on Oct 25, 2023.
          </Typography>
        </Box>

        <Box
          sx={{
            position: "absolute",
            right: { xs: 14, md: 18 },
            bottom: { xs: 14, md: 18 },
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
            px: 1.1,
            py: 0.55,
            borderRadius: "999px",
            bgcolor: "#E7F318",
            color: "#4D5800",
            fontSize: "0.68rem",
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: "#FFF36A",
              display: "grid",
              placeItems: "center",
              fontSize: "0.72rem",
            }}
          >
            ⚡
          </Box>
          5.2 kW Peak Generation Today
        </Box>
      </Box>
    </Box>
  );
}
