import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import WalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { NavLink } from "react-router-dom";

const stats = [
  {
    icon: <MarkEmailReadOutlinedIcon sx={{ fontSize: "1rem" }} />,
    iconBg: "#E8F0FF",
    iconTone: "#4F89FF",
    value: "45",
    label: "Invites sent",
  },
  {
    icon: <VerifiedRoundedIcon sx={{ fontSize: "1rem" }} />,
    iconBg: "#E8FAEF",
    iconTone: "#177D45",
    value: "12",
    label: "Successful referrals",
  },
  {
    icon: <PendingActionsRoundedIcon sx={{ fontSize: "1rem" }} />,
    iconBg: "#F4F1C9",
    iconTone: "#8B8600",
    value: "8",
    label: "Pending referrals",
  },
];

const quickShareItems = [
  {
    label: "WhatsApp",
    description: "Send directly to contacts",
    icon: <WhatsAppIcon sx={{ fontSize: "0.95rem" }} />,
    iconBg: "#DDF7E8",
    iconTone: "#177D45",
  },
  {
    label: "Copy Link",
    description: "sparkin.in/ref/user123",
    icon: <LinkRoundedIcon sx={{ fontSize: "0.95rem" }} />,
    iconBg: "#EEF4FF",
    iconTone: "#0E56C8",
  },
  {
    label: "QR Code",
    description: "Download for print",
    icon: <QrCode2RoundedIcon sx={{ fontSize: "0.95rem" }} />,
    iconBg: "#F2F5F8",
    iconTone: "#647387",
  },
];

const activityItems = [
  {
    name: "Priya Sharma",
    detail: "Installation completed yesterday",
    amount: "+\u20B9500.00",
    status: "Rewarded",
    statusTone: "#239654",
  },
  {
    name: "Rahul Verma",
    detail: "Assessment scheduled",
    amount: "Pending",
    status: "In Progress",
    statusTone: "#0E56C8",
  },
];

function StatCard({ item }) {
  return (
    <Box
      sx={{
        p: 1.45,
        borderRadius: "1.25rem",
        bgcolor: "#F8FAFD",
        border: "1px solid rgba(225,232,241,0.9)",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          mx: "auto",
          borderRadius: "0.85rem",
          bgcolor: item.iconBg,
          color: item.iconTone,
          display: "grid",
          placeItems: "center",
        }}
      >
        {item.icon}
      </Box>
      <Typography sx={{ mt: 1.05, color: "#223146", fontSize: "1.65rem", fontWeight: 800, lineHeight: 1.05 }}>
        {item.value}
      </Typography>
      <Typography sx={{ mt: 0.45, color: "#647387", fontSize: "0.74rem" }}>{item.label}</Typography>
    </Box>
  );
}

function QuickShareCard({ item }) {
  return (
    <Box
      sx={{
        p: 1.15,
        borderRadius: "1rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 10px 20px rgba(16,29,51,0.04)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={0.85} alignItems="center">
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "0.75rem",
              bgcolor: item.iconBg,
              color: item.iconTone,
              display: "grid",
              placeItems: "center",
            }}
          >
            {item.icon}
          </Box>
          <Box>
            <Typography sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 700 }}>{item.label}</Typography>
            <Typography sx={{ mt: 0.12, color: "#98A3B2", fontSize: "0.62rem" }}>{item.description}</Typography>
          </Box>
        </Stack>
        <ChevronRightRoundedIcon sx={{ color: "#B4BECC", fontSize: "1.15rem" }} />
      </Stack>
    </Box>
  );
}

export default function CustomerReferralsPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={2}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.95rem", md: "2.05rem" },
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
            }}
          >
            Refer & Earn
          </Typography>
          <Typography
            sx={{
              mt: 0.4,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            Invite friends and earn rewards for every successful installation.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            px: 1.15,
            py: 0.6,
            borderRadius: "0.9rem",
            bgcolor: "#E7F318",
            color: "#6C7300",
            fontSize: "0.72rem",
            fontWeight: 800,
            lineHeight: 1,
            alignItems: "center",
            gap: 0.45,
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: "0.9rem" }} />
          2y Points Week
        </Box>
      </Stack>

      <Box
        sx={{
          mt: 1.85,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.65fr 0.95fr" },
          gap: 1.55,
        }}
      >
        <Box
          sx={{
            p: 1.6,
            borderRadius: "1.35rem",
            bgcolor: "#F8FAFD",
            border: "1px solid rgba(225,232,241,0.92)",
          }}
        >
          <Typography
            sx={{
              color: "#0E56C8",
              fontSize: "0.58rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Personal Code
          </Typography>
          <Typography sx={{ mt: 0.85, color: "#223146", fontSize: "1.55rem", fontWeight: 800 }}>
            Spark your network
          </Typography>
          <Typography
            sx={{
              mt: 0.45,
              maxWidth: 390,
              color: "#647387",
              fontSize: "0.84rem",
              lineHeight: 1.7,
            }}
          >
            {"Share this unique code with friends. They get a \u20B92,000 discount, and you earn \u20B9500 instantly."}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2 }}>
            <Box
              sx={{
                minWidth: 0,
                flex: 1,
                px: 1.25,
                py: 1.1,
                borderRadius: "1rem",
                bgcolor: "#FFFFFF",
                border: "1px solid rgba(225,232,241,0.96)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#0E56C8",
                  fontSize: { xs: "1.4rem", md: "1.75rem" },
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  lineHeight: 1,
                }}
              >
                SPARKIN-2026
              </Typography>
              <ContentCopyRoundedIcon sx={{ color: "#7F8A9B", fontSize: "1rem" }} />
            </Box>

            <Button
              component={NavLink}
              to="/customer/referrals/share"
              variant="contained"
              sx={{
                minHeight: 42,
                px: 1.75,
                borderRadius: "0.95rem",
                bgcolor: "#0E56C8",
                boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Share Now
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            p: 1.55,
            borderRadius: "1.35rem",
            bgcolor: "#0E56C8",
            color: "#FFFFFF",
            boxShadow: "0 16px 30px rgba(14,86,200,0.18)",
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "0.8rem",
              bgcolor: "#E7F318",
              color: "#6C7300",
              display: "grid",
              placeItems: "center",
            }}
          >
            <WalletOutlinedIcon sx={{ fontSize: "1rem" }} />
          </Box>

          <Typography sx={{ mt: 1.15, color: "rgba(255,255,255,0.76)", fontSize: "0.76rem" }}>
            Total Earnings
          </Typography>
          <Typography sx={{ mt: 0.45, fontSize: "2.2rem", fontWeight: 800, lineHeight: 1.02 }}>
            {"\u20B95,000"}
          </Typography>

          <Box sx={{ mt: 1.2, mb: 1.15, height: 1, bgcolor: "rgba(255,255,255,0.16)" }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Box>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.56rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Available
              </Typography>
              <Typography sx={{ mt: 0.3, fontSize: "1.2rem", fontWeight: 800 }}>{"\u20B91,250"}</Typography>
            </Box>
            <Button
              component={NavLink}
              to="/customer/referrals/earnings"
              variant="contained"
              sx={{
                minHeight: 34,
                px: 1.25,
                borderRadius: "0.8rem",
                bgcolor: "#FFFFFF",
                color: "#0E56C8",
                boxShadow: "none",
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { bgcolor: "#FFFFFF", boxShadow: "none" },
              }}
            >
              Withdraw
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 1.55,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 1.35,
        }}
      >
        {stats.map((item) => (
          <StatCard key={item.label} item={item} />
        ))}
      </Box>

      <Box sx={{ mt: 1.8 }}>
        <Typography sx={{ color: "#223146", fontSize: "1.1rem", fontWeight: 800 }}>Quick Share</Typography>
        <Box
          sx={{
            mt: 1.2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gap: 1.2,
          }}
        >
          {quickShareItems.map((item) => (
            <QuickShareCard key={item.label} item={item} />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 2.05 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ color: "#223146", fontSize: "1.1rem", fontWeight: 800 }}>Recent Activity</Typography>
          <Button
            sx={{
              color: "#0E56C8",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "none",
              minWidth: 0,
              px: 0,
              "&:hover": { bgcolor: "transparent" },
            }}
          >
            View All
          </Button>
        </Stack>

        <Box
          sx={{
            mt: 1.15,
            borderRadius: "1.25rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            overflow: "hidden",
          }}
        >
          {activityItems.map((item, index) => (
            <Stack
              key={item.name}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1.2}
              sx={{
                px: 1.35,
                py: 1.2,
                borderTop: index === 0 ? "none" : "1px solid rgba(232,237,244,0.9)",
              }}
            >
              <Stack direction="row" spacing={0.95} alignItems="center">
                <Avatar sx={{ width: 34, height: 34, bgcolor: "#111827" }}>
                  {item.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography sx={{ color: "#223146", fontSize: "0.88rem", fontWeight: 700 }}>{item.name}</Typography>
                  <Typography sx={{ mt: 0.15, color: "#7F8A9B", fontSize: "0.68rem" }}>{item.detail}</Typography>
                </Box>
              </Stack>

              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ color: item.statusTone, fontSize: "0.92rem", fontWeight: 800 }}>{item.amount}</Typography>
                <Typography
                  sx={{
                    mt: 0.12,
                    color: "#98A3B2",
                    fontSize: "0.56rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.status}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
