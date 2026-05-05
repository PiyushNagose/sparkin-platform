import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";

// ── Static ticket data ────────────────────────────────────────────────────────
const STATIC_TICKETS = {
  "#TK-1042": {
    id: "#TK-1042",
    title: "Subsidy Disbursement Delay - Residential Rooftop Pune",
    priority: "HIGH PRIORITY",
    status: "IN PROGRESS",
    priorityColor: "#D94444",
    priorityBg: "#FDECEC",
    statusColor: "#0E56C8",
    statusBg: "#EEF4FF",
    user: { name: "Arjun Mehta", type: "Residential User • Pune, MH", plan: "Premium Plan", id: "CL-3063", initials: "AM" },
    requestedOn: "Oct 24, 2023 • 09:03 AM",
    issueType: "Incentive | Subsidy Query",
    assignedAgent: "Self (Super Admin)",
    description: "User reports that the central solar subsidy for the rooftop installation completed in August hasn't been credited yet. All inspection reports were uploaded on Aug 13. Need to verify status with the state nodal agency. The installation ID is SP-MH-7725.",
    attachments: [{ name: "subsidy_Bill_Aug23.pdf", size: "1.2 MB" }],
    messages: [
      {
        id: 1,
        type: "customer",
        sender: "Arjun Mehta",
        time: "10:31 AM",
        date: "OCTOBER 24, 2023",
        text: "Any update on this? It's been over 4 weeks since the installation was commissioned. I was promised the subsidy would be credited within a month of inspection.",
        isInternal: false,
      },
      {
        id: 2,
        type: "internal",
        sender: "Internal Team Note",
        time: "Oct 24 • 11:12 AM",
        text: "Spoke with the local nodal officer (Pune DISCOM). There is a backlog in the treasury release for the Aug-Sep cycle. They expect the disbursement for residential projects to clear by EOD Friday. Keep the customer updated.",
        isInternal: true,
      },
      {
        id: 3,
        type: "admin",
        sender: "You (Admin)",
        time: "Oct 24 • 12:04 PM",
        text: "Hi Arjun, we are currently coordinating with the local nodal agency. Your documents and inspection reports have been fully verified, we are currently just waiting for the final treasury release from the state office. We expect this to be completed by the end of this week. Thank you for your patience.",
        isInternal: false,
      },
    ],
    resolutionTarget: "48 Hours",
    slaStatus: "SLA Status: Healthy",
    satisfactionPotential: "High Impact",
    satisfactionNote: "Premium User Affected",
    ticketCategory: "Financial / Gov",
    categoryNote: "Subsidy Operations",
  },
  "#TK-1039": {
    id: "#TK-1039",
    title: "Panel Damage Report - Anita Sharma",
    priority: "MEDIUM",
    status: "OPEN",
    priorityColor: "#8A6200",
    priorityBg: "#FFF4D6",
    statusColor: "#239654",
    statusBg: "#DDF8E7",
    user: { name: "Anita Sharma", type: "Residential User • Delhi", plan: "Standard Plan", id: "CL-2891", initials: "AS" },
    requestedOn: "Oct 23, 2023 • 02:15 PM",
    issueType: "Hardware | Panel Damage",
    assignedAgent: "Self (Super Admin)",
    description: "Customer reports visible cracks on 2 solar panels after recent hailstorm. Requesting inspection and replacement under warranty.",
    attachments: [],
    messages: [
      {
        id: 1,
        type: "customer",
        sender: "Anita Sharma",
        time: "02:15 PM",
        date: "OCTOBER 23, 2023",
        text: "I noticed cracks on 2 of my panels after the hailstorm last night. Please send someone for inspection.",
        isInternal: false,
      },
    ],
    resolutionTarget: "72 Hours",
    slaStatus: "SLA Status: Healthy",
    satisfactionPotential: "Medium Impact",
    satisfactionNote: "Standard User",
    ticketCategory: "Hardware",
    categoryNote: "Panel Replacement",
  },
};

function PriorityBadge({ label, color, bg }) {
  return (
    <Box sx={{ px: 1.1, py: 0.35, borderRadius: "0.45rem", bgcolor: bg, color, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {label}
    </Box>
  );
}

function MessageBubble({ msg }) {
  if (msg.isInternal) {
    return (
      <Box sx={{ mx: 2, my: 1 }}>
        <Box sx={{ p: 1.6, borderRadius: "0.9rem", bgcolor: "#FFFDE7", border: "1px solid #FFF176" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography sx={{ color: "#7A6000", fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              🔒 Internal Team Note
            </Typography>
            <Typography sx={{ color: "#A89040", fontSize: "0.68rem" }}>{msg.time}</Typography>
          </Stack>
          <Typography sx={{ color: "#4A3800", fontSize: "0.84rem", lineHeight: 1.6 }}>{msg.text}</Typography>
        </Box>
      </Box>
    );
  }

  if (msg.type === "admin") {
    return (
      <Box sx={{ mx: 2, my: 1, display: "flex", justifyContent: "flex-end" }}>
        <Box sx={{ maxWidth: "72%" }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={0.8} sx={{ mb: 0.4 }}>
            <Typography sx={{ color: "#A0ACBA", fontSize: "0.68rem" }}>{msg.time}</Typography>
            <Typography sx={{ color: "#0E56C8", fontSize: "0.7rem", fontWeight: 900 }}>YOU (ADMIN)</Typography>
          </Stack>
          <Box sx={{ p: 1.6, borderRadius: "1rem 1rem 0.2rem 1rem", bgcolor: "#0E56C8", color: "#FFFFFF" }}>
            <Typography sx={{ fontSize: "0.84rem", lineHeight: 1.6 }}>{msg.text}</Typography>
          </Box>
          <Typography sx={{ mt: 0.4, color: "#A0ACBA", fontSize: "0.64rem", textAlign: "right" }}>
            ✓ Seen by user
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 2, my: 1 }}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Avatar sx={{ width: 32, height: 32, bgcolor: "#EEF2F6", color: "#667386", fontSize: "0.68rem", fontWeight: 900, flexShrink: 0 }}>
          {msg.sender?.split(" ").map((p) => p[0]).join("").slice(0, 2)}
        </Avatar>
        <Box sx={{ maxWidth: "72%" }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
            <Typography sx={{ color: adminUi.colors.text, fontSize: "0.78rem", fontWeight: 800 }}>{msg.sender}</Typography>
            <Typography sx={{ color: "#A0ACBA", fontSize: "0.68rem" }}>{msg.time}</Typography>
          </Stack>
          <Box sx={{ p: 1.6, borderRadius: "0.2rem 1rem 1rem 1rem", bgcolor: "#F4F7FB", border: "1px solid rgba(225,232,241,0.96)" }}>
            <Typography sx={{ color: adminUi.colors.text, fontSize: "0.84rem", lineHeight: 1.6 }}>{msg.text}</Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default function AdminTicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const decodedId = decodeURIComponent(ticketId || "");
  const ticket = STATIC_TICKETS[decodedId] || Object.values(STATIC_TICKETS)[0];

  function handleSend() {
    if (!replyText.trim()) return;
    setReplyText("");
  }

  return (
    <AdminPageShell>
      {/* Back nav */}
      <Button
        onClick={() => navigate("/admin/help-desk")}
        sx={{ mb: 2, color: adminUi.colors.muted, fontSize: "0.82rem", fontWeight: 700, textTransform: "none", px: 0, "&:hover": { bgcolor: "transparent", color: adminUi.colors.primary } }}
      >
        ← Back to Help Desk
      </Button>

      {/* Ticket header card */}
      <AdminPanel sx={{ p: { xs: 2, md: 2.8 }, mb: 2.5 }}>
        {/* Badges row */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem", fontWeight: 800 }}>{ticket.id}</Typography>
          <PriorityBadge label={ticket.priority} color={ticket.priorityColor} bg={ticket.priorityBg} />
          <PriorityBadge label={ticket.status} color={ticket.statusColor} bg={ticket.statusBg} />
          <Box sx={{ ml: "auto" }}>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" sx={{ color: adminUi.colors.muted }}><IosShareRoundedIcon sx={{ fontSize: "1rem" }} /></IconButton>
              <IconButton size="small" sx={{ color: adminUi.colors.muted }}><MoreVertRoundedIcon sx={{ fontSize: "1rem" }} /></IconButton>
            </Stack>
          </Box>
        </Stack>

        <Typography sx={{ color: adminUi.colors.text, fontSize: "1.35rem", fontWeight: 900, mb: 2 }}>
          {ticket.title}
        </Typography>

        {/* User + meta grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          {/* User card */}
          <Box sx={{ p: 1.8, borderRadius: "0.9rem", border: "1px solid rgba(225,232,241,0.96)", bgcolor: "#FAFBFC" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ width: 44, height: 44, bgcolor: "#EEF2F6", color: "#667386", fontSize: "0.82rem", fontWeight: 900 }}>
                {ticket.user.initials}
              </Avatar>
              <Box>
                <Typography sx={{ color: adminUi.colors.text, fontSize: "0.96rem", fontWeight: 900 }}>{ticket.user.name}</Typography>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.74rem" }}>{ticket.user.type}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.4 }}>
                  <Box sx={{ px: 0.8, py: 0.2, borderRadius: "999px", bgcolor: "#EEF4FF", color: "#0E56C8", fontSize: "0.62rem", fontWeight: 800 }}>{ticket.user.plan}</Box>
                  <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.68rem" }}>ID: {ticket.user.id}</Typography>
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Meta info */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
            <Box>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.3 }}>Requested On</Typography>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 800 }}>{ticket.requestedOn}</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.3 }}>Issue Type</Typography>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 800 }}>{ticket.issueType}</Typography>
            </Box>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.3 }}>Assigned Agent</Typography>
              <Typography sx={{ color: adminUi.colors.primary, fontSize: "0.82rem", fontWeight: 800 }}>{ticket.assignedAgent} ✏️</Typography>
            </Box>
          </Box>
        </Box>

        {/* Description + Attachments */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mt: 2 }}>
          <Box>
            <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.8 }}>Issue Description</Typography>
            <Typography sx={{ color: "#344155", fontSize: "0.84rem", lineHeight: 1.7 }}>{ticket.description}</Typography>
          </Box>
          <Box>
            <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.8 }}>Attachments ({ticket.attachments.length})</Typography>
            {ticket.attachments.length === 0 ? (
              <Typography sx={{ color: "#A0ACBA", fontSize: "0.8rem" }}>No attachments</Typography>
            ) : (
              ticket.attachments.map((file) => (
                <Stack key={file.name} direction="row" spacing={1} alignItems="center" sx={{ p: 1.2, borderRadius: "0.75rem", border: "1px solid rgba(225,232,241,0.96)", bgcolor: "#FAFBFC", cursor: "pointer", "&:hover": { bgcolor: "#EEF4FF" } }}>
                  <PictureAsPdfOutlinedIcon sx={{ color: "#D94444", fontSize: "1.3rem" }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: adminUi.colors.text, fontSize: "0.78rem", fontWeight: 800 }}>{file.name}</Typography>
                    <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.66rem" }}>{file.size}</Typography>
                  </Box>
                </Stack>
              ))
            )}
          </Box>
        </Box>
      </AdminPanel>

      {/* Communication History */}
      <AdminPanel sx={{ mb: 2.5, overflow: "hidden" }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 1.8, borderBottom: "1px solid rgba(225,232,241,0.96)" }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box sx={{ width: 32, height: 32, borderRadius: "0.6rem", bgcolor: "#EEF4FF", display: "grid", placeItems: "center" }}>
              <CampaignOutlinedIcon sx={{ color: "#0E56C8", fontSize: "1rem" }} />
            </Box>
            <Box>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "1rem", fontWeight: 900 }}>Communication History</Typography>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.72rem" }}>All customer interactions and internal notes</Typography>
            </Box>
          </Stack>
          <Button
            size="small"
            sx={{ px: 1.4, py: 0.5, borderRadius: "999px", bgcolor: "#DDF8E7", color: "#239654", fontSize: "0.68rem", fontWeight: 900, textTransform: "none" }}
          >
            + Add to Stream
          </Button>
        </Stack>

        {/* Messages */}
        <Box sx={{ py: 1.5 }}>
          {ticket.messages.map((msg, idx) => (
            <Box key={msg.id}>
              {idx === 0 || ticket.messages[idx - 1]?.date !== msg.date ? (
                msg.date ? (
                  <Box sx={{ textAlign: "center", my: 1.5 }}>
                    <Typography sx={{ color: "#A0ACBA", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.08em" }}>{msg.date}</Typography>
                  </Box>
                ) : null
              ) : null}
              <MessageBubble msg={msg} />
            </Box>
          ))}
        </Box>

        {/* Reply box */}
        <Box sx={{ px: 2.5, pb: 2, pt: 1, borderTop: "1px solid rgba(225,232,241,0.96)" }}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Type your reply or @mention team here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            sx={{
              mb: 1.2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.9rem",
                bgcolor: "#F7F9FC",
                fontSize: "0.86rem",
              },
            }}
            InputProps={{
              endAdornment: (
                <Box sx={{ alignSelf: "flex-end", pb: 0.5 }}>
                  <IconButton
                    onClick={handleSend}
                    disabled={!replyText.trim()}
                    sx={{ width: 36, height: 36, bgcolor: replyText.trim() ? "#0E56C8" : "#E5EAF1", color: replyText.trim() ? "#FFFFFF" : "#A0ACBA", borderRadius: "0.7rem", "&:hover": { bgcolor: replyText.trim() ? "#0B49AD" : "#E5EAF1" } }}
                  >
                    <SendRoundedIcon sx={{ fontSize: "0.9rem" }} />
                  </IconButton>
                </Box>
              ),
            }}
          />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1}>
              <Button size="small" startIcon={<AttachFileRoundedIcon sx={{ fontSize: "0.85rem" }} />}
                sx={{ color: adminUi.colors.muted, fontSize: "0.74rem", fontWeight: 700, textTransform: "none", px: 1 }}>
                Attach
              </Button>
              <Button size="small" startIcon={<CampaignOutlinedIcon sx={{ fontSize: "0.85rem" }} />}
                sx={{ color: adminUi.colors.muted, fontSize: "0.74rem", fontWeight: 700, textTransform: "none", px: 1 }}>
                Canned Response
              </Button>
            </Stack>
            <Button
              size="small"
              onClick={() => setIsInternal(!isInternal)}
              startIcon={<StickyNote2OutlinedIcon sx={{ fontSize: "0.85rem" }} />}
              sx={{
                px: 1.4, py: 0.5, borderRadius: "999px",
                bgcolor: isInternal ? "#FFFDE7" : "#F4F7FB",
                color: isInternal ? "#7A6000" : adminUi.colors.muted,
                fontSize: "0.74rem", fontWeight: 800, textTransform: "none",
                border: isInternal ? "1px solid #FFF176" : "1px solid transparent",
              }}
            >
              Post as Internal Note
            </Button>
          </Stack>
        </Box>
      </AdminPanel>

      {/* Bottom metrics */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
        <AdminPanel sx={{ p: 2.2, bgcolor: "#EEF4FF" }}>
          <Typography sx={{ color: "#7A96C8", fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.6 }}>Resolution Target</Typography>
          <Typography sx={{ color: "#0E56C8", fontSize: "1.6rem", fontWeight: 900, lineHeight: 1 }}>{ticket.resolutionTarget}</Typography>
          <Box sx={{ mt: 1, px: 1, py: 0.3, borderRadius: "999px", bgcolor: "#DDF8E7", color: "#239654", fontSize: "0.62rem", fontWeight: 900, display: "inline-flex" }}>
            {ticket.slaStatus}
          </Box>
        </AdminPanel>

        <AdminPanel sx={{ p: 2.2, bgcolor: "#FFFDE7" }}>
          <Typography sx={{ color: "#A89040", fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.6 }}>Satisfaction Potential</Typography>
          <Typography sx={{ color: "#7A6000", fontSize: "1.6rem", fontWeight: 900, lineHeight: 1 }}>{ticket.satisfactionPotential}</Typography>
          <Box sx={{ mt: 1, px: 1, py: 0.3, borderRadius: "999px", bgcolor: "#FFF4D6", color: "#8A6200", fontSize: "0.62rem", fontWeight: 900, display: "inline-flex" }}>
            {ticket.satisfactionNote}
          </Box>
        </AdminPanel>

        <AdminPanel sx={{ p: 2.2, bgcolor: "#F4F7FB" }}>
          <Typography sx={{ color: "#7A8799", fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.6 }}>Ticket Category</Typography>
          <Typography sx={{ color: adminUi.colors.text, fontSize: "1.6rem", fontWeight: 900, lineHeight: 1 }}>{ticket.ticketCategory}</Typography>
          <Box sx={{ mt: 1, px: 1, py: 0.3, borderRadius: "999px", bgcolor: "#E5EAF1", color: "#556478", fontSize: "0.62rem", fontWeight: 900, display: "inline-flex" }}>
            {ticket.categoryNote}
          </Box>
        </AdminPanel>
      </Box>
    </AdminPageShell>
  );
}
