import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatWindow } from "@/features/chat/ChatWindow";
import { chatApi } from "@/features/chat/chatApi";
import { useChatSocket } from "@/features/chat/useChatSocket";
import { useAuth } from "@/features/auth/AuthProvider";
import { authStorage } from "@/features/auth/authStorage";
import { adminVendorsApi } from "@/features/admin/api/adminApi";
import {
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";

// ── Static ticket data ────────────────────────────────────────────────────────
const STATIC_TICKETS = [
  { id: "#TK-1042", user: "Arjun Mehta", initials: "AM", issue: "Incentive Query", priority: "HIGH", status: "IN PROGRESS", date: "Oct 24, 2023", priorityColor: "#D94444", priorityBg: "#FDECEC", statusColor: "#0E56C8", statusBg: "#EEF4FF" },
  { id: "#TK-1039", user: "Anita Sharma", initials: "AS", issue: "Panel Damage", priority: "MEDIUM", status: "OPEN", date: "Oct 23, 2023", priorityColor: "#8A6200", priorityBg: "#FFF4D6", statusColor: "#239654", statusBg: "#DDF8E7" },
  { id: "#TK-1035", user: "Rahul Jain", initials: "RJ", issue: "Net Metering", priority: "LOW", status: "RESOLVED", date: "Oct 22, 2023", priorityColor: "#239654", priorityBg: "#DDF8E7", statusColor: "#657386", statusBg: "#EEF2F6" },
  { id: "#TK-1031", user: "Meera Kapoor", initials: "MK", issue: "App Sync Issue", priority: "HIGH", status: "IN PROGRESS", date: "Oct 21, 2023", priorityColor: "#D94444", priorityBg: "#FDECEC", statusColor: "#0E56C8", statusBg: "#EEF4FF" },
];

function getInitials(name = "") {
  return name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function formatTime(value) {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(new Date(value));
}

// ── Tickets tab ───────────────────────────────────────────────────────────────
function TicketsTab() {
  const navigate = useNavigate();

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mb: 2.5 }}>
        <Button startIcon={<FilterListRoundedIcon />} variant="outlined"
          sx={{ minHeight: 42, px: 1.8, borderRadius: "0.9rem", borderColor: "rgba(225,232,241,0.96)", color: "#556478", fontSize: "0.84rem", fontWeight: 700, textTransform: "none" }}>
          Filter
        </Button>
        <Button variant="contained" startIcon={<AddRoundedIcon />}
          sx={{ minHeight: 42, px: 2, borderRadius: "0.9rem", bgcolor: "#0E56C8", fontSize: "0.84rem", fontWeight: 700, textTransform: "none", boxShadow: "0 8px 20px rgba(14,86,200,0.2)" }}>
          New Ticket
        </Button>
      </Stack>

      <AdminPanel sx={{ overflow: "hidden" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr 1fr 0.7fr 0.9fr 0.8fr", gap: 1, px: 2.5, py: 1.6, bgcolor: "#F6F8FB", borderBottom: "1px solid #EEF2F6" }}>
          {["Ticket ID", "User", "Issue Type", "Priority", "Status", "Date"].map((h) => (
            <Typography key={h} sx={{ color: "#738096", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</Typography>
          ))}
        </Box>
        {STATIC_TICKETS.map((ticket, index) => (
          <Box
            key={ticket.id}
            onClick={() => navigate(`/admin/help-desk/${encodeURIComponent(ticket.id)}`)}
            sx={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr 1fr 0.7fr 0.9fr 0.8fr", gap: 1, px: 2.5, py: 2, alignItems: "center", borderTop: index === 0 ? "none" : "1px solid #EEF2F6", transition: "background 0.15s", cursor: "pointer", "&:hover": { bgcolor: "#F0F5FF" } }}
          >
            <Typography sx={{ color: "#0E56C8", fontSize: "0.84rem", fontWeight: 900 }}>{ticket.id}</Typography>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Avatar sx={{ width: 32, height: 32, bgcolor: "#EEF2F6", color: "#667386", fontSize: "0.68rem", fontWeight: 900 }}>{ticket.initials}</Avatar>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "0.88rem", fontWeight: 800 }}>{ticket.user}</Typography>
            </Stack>
            <Typography sx={{ color: "#344155", fontSize: "0.84rem", fontWeight: 700 }}>{ticket.issue}</Typography>
            <Box sx={{ display: "inline-flex", px: 0.9, py: 0.4, borderRadius: "0.5rem", bgcolor: ticket.priorityBg, color: ticket.priorityColor, fontSize: "0.66rem", fontWeight: 900, textTransform: "uppercase" }}>{ticket.priority}</Box>
            <Box sx={{ display: "inline-flex", px: 0.9, py: 0.4, borderRadius: "0.5rem", bgcolor: ticket.statusBg, color: ticket.statusColor, fontSize: "0.66rem", fontWeight: 900, textTransform: "uppercase" }}>{ticket.status}</Box>
            <Typography sx={{ color: "#667386", fontSize: "0.8rem" }}>{ticket.date}</Typography>
          </Box>
        ))}
      </AdminPanel>
    </Box>
  );
}

// ── User picker dialog (vendors + customers) ──────────────────────────────────
function UserPickerDialog({ open, onClose, onSelect }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("vendors");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    adminVendorsApi.listVendors()
      .then(setVendors)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  function getVendorName(v) {
    return v.company?.name || v.account?.fullName || v.account?.email || "Vendor";
  }

  function getVendorId(v) {
    return v.vendorId || v.id || v._id || "";
  }

  const filteredVendors = vendors.filter((v) => {
    const name = getVendorName(v);
    return !query || name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "1.3rem", border: "1px solid rgba(225,232,241,0.96)" } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Typography sx={{ color: adminUi.colors.text, fontSize: "1.1rem", fontWeight: 900 }}>Start New Chat</Typography>
        <Button onClick={onClose} sx={{ minWidth: 32, width: 32, height: 32, p: 0, borderRadius: "50%", color: "#667386" }}>
          <CloseRoundedIcon sx={{ fontSize: "1.1rem" }} />
        </Button>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        {/* Tab selector */}
        <Stack direction="row" spacing={0} sx={{ borderBottom: "1px solid rgba(225,232,241,0.96)", mb: 2 }}>
          {["vendors", "customers"].map((t) => (
            <Button key={t} onClick={() => setTab(t)}
              sx={{ minHeight: 36, px: 1.8, borderRadius: 0, borderBottom: tab === t ? "2px solid #0E56C8" : "2px solid transparent", color: tab === t ? "#0E56C8" : "#6F7D8F", fontSize: "0.82rem", fontWeight: tab === t ? 800 : 600, textTransform: "capitalize", mb: "-1px" }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </Stack>

        <TextField
          fullWidth size="small"
          placeholder={`Search ${tab}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{ startAdornment: <SearchRoundedIcon sx={{ color: "#A0ACBA", fontSize: "1rem", mr: 0.5 }} /> }}
          sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "0.85rem" } }}
        />

        {loading ? (
          <Box sx={{ py: 4, display: "grid", placeItems: "center" }}><CircularProgress size={28} /></Box>
        ) : tab === "vendors" ? (
          filteredVendors.length === 0 ? (
            <Typography sx={{ color: "#A0ACBA", fontSize: "0.84rem", textAlign: "center", py: 3 }}>
              {vendors.length === 0 ? "No vendors found" : "No vendors match your search"}
            </Typography>
          ) : (
            <Stack spacing={0.8}>
              {filteredVendors.map((vendor) => {
                const name = getVendorName(vendor);
                const id = getVendorId(vendor);
                return (
                  <Box key={id} onClick={() => onSelect({ id, name, role: "vendor" })}
                    sx={{ p: 1.4, borderRadius: "0.9rem", border: "1px solid rgba(225,232,241,0.96)", cursor: "pointer", display: "flex", alignItems: "center", gap: 1.4, "&:hover": { bgcolor: "#EEF4FF", borderColor: "#0E56C8" }, transition: "all 0.15s" }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: "#0E56C8", fontSize: "0.84rem", fontWeight: 800 }}>
                      {getInitials(name)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: adminUi.colors.text, fontSize: "0.9rem", fontWeight: 800 }}>{name}</Typography>
                      <Typography sx={{ color: "#7A8799", fontSize: "0.72rem" }}>
                        {vendor.company?.city || vendor.account?.email || "Vendor"}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: "auto", px: 0.8, py: 0.3, borderRadius: "999px", bgcolor: "#EEF4FF", color: "#0E56C8", fontSize: "0.62rem", fontWeight: 800 }}>
                      {vendor.verificationStatus || "vendor"}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          )
        ) : (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <Typography sx={{ color: "#A0ACBA", fontSize: "0.84rem" }}>
              Customer chat is initiated when a customer contacts support first.
            </Typography>
            <Typography sx={{ mt: 0.5, color: "#C8D4E4", fontSize: "0.76rem" }}>
              Their conversation will appear in Recent Chats automatically.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Chat tab ──────────────────────────────────────────────────────────────────
function ChatTab({ currentUserId, currentUserName, token }) {
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  // When a new room arrives via socket, add it to the list if not already there
  const handleNewRoom = useCallback((room) => {
    setRooms((prev) => {
      if (prev.some((r) => r.roomId === room.roomId)) return prev;
      return [room, ...prev];
    });
  }, []);

  // When a room gets a new message, update its lastMessage in the sidebar
  const handleRoomUpdated = useCallback(({ roomId, lastMessage, lastMessageAt }) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.roomId === roomId ? { ...r, lastMessage, lastMessageAt } : r,
      ),
    );
  }, []);

  const {
    messages, typing, connected,
    joinRoom, leaveRoom, sendMessage,
    startTyping, stopTyping, seedMessages,
  } = useChatSocket(token, {
    onNewRoom: handleNewRoom,
    onRoomUpdated: handleRoomUpdated,
  });

  useEffect(() => {
    // Register this admin's real userId so vendors/customers can find them
    chatApi.registerAdmin().catch(() => {});
    chatApi.listRooms().then(setRooms).catch(() => {});
  }, []);

  async function openRoom(room) {
    if (activeRoomId === room.roomId) return;
    if (activeRoomId) leaveRoom(activeRoomId);
    setActiveRoomId(room.roomId);
    setLoadingMessages(true);
    try {
      const msgs = await chatApi.getMessages(room.roomId);
      seedMessages(room.roomId, msgs);
      chatApi.markRead(room.roomId).catch(() => {});
    } finally {
      setLoadingMessages(false);
    }
    joinRoom(room.roomId);
  }

  async function handleSelectVendor({ id, name, role }) {
    setPickerOpen(false);
    setStartingChat(true);
    try {
      const room = await chatApi.createRoom({
        targetUserId: id,
        targetRole: role,
        targetName: name,
      });
      const updated = await chatApi.listRooms();
      setRooms(updated);
      openRoom(room);
    } finally {
      setStartingChat(false);
    }
  }

  function getOtherParticipant(room) {
    const otherIdx = room.participantIds?.findIndex((id) => id !== currentUserId);
    const name = room.participantNames?.[otherIdx] || room.participantIds?.[otherIdx] || "User";
    const role = room.participantRoles?.[otherIdx] || "vendor";
    return { name, role };
  }

  const activeRoom = rooms.find((r) => r.roomId === activeRoomId);
  const otherParticipant = activeRoom ? getOtherParticipant(activeRoom) : { name: "User", role: "vendor" };
  const roomMessages = (activeRoomId && messages[activeRoomId]) || [];
  const roomTyping = (activeRoomId && typing[activeRoomId]) || [];

  return (
    <>
      <UserPickerDialog open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handleSelectVendor} />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "300px 1fr" }, height: "calc(100vh - 300px)", minHeight: 500, borderRadius: "1.3rem", overflow: "hidden", border: "1px solid rgba(225,232,241,0.96)", bgcolor: "#FFFFFF" }}>
        {/* Sidebar */}
        <Box sx={{ borderRight: "1px solid rgba(225,232,241,0.96)", display: "flex", flexDirection: "column" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1.6, borderBottom: "1px solid rgba(225,232,241,0.96)" }}>
            <Typography sx={{ color: adminUi.colors.text, fontSize: "1rem", fontWeight: 900 }}>Recent Chats</Typography>
            <Button
              onClick={() => setPickerOpen(true)}
              disabled={startingChat}
              startIcon={startingChat ? <CircularProgress size={12} /> : <AddRoundedIcon />}
              sx={{ minHeight: 32, px: 1.2, borderRadius: "999px", bgcolor: "#EEF4FF", color: "#0E56C8", fontSize: "0.72rem", fontWeight: 800, textTransform: "none" }}
            >
              New Chat
            </Button>
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {rooms.length === 0 ? (
              <Box sx={{ p: 2.5, textAlign: "center" }}>
                <ChatOutlinedIcon sx={{ fontSize: "1.8rem", color: "#C8D4E4", mb: 0.8 }} />
                <Typography sx={{ color: "#A0ACBA", fontSize: "0.82rem" }}>No chats yet</Typography>
                <Typography sx={{ mt: 0.4, color: "#C8D4E4", fontSize: "0.72rem" }}>Click "New Chat" to start</Typography>
              </Box>
            ) : null}

            {rooms.map((room) => {
              const { name, role } = getOtherParticipant(room);
              const isActive = room.roomId === activeRoomId;
              const unread = room.unreadCount?.[currentUserId] || 0;

              return (
                <Box
                  key={room.roomId}
                  onClick={() => openRoom(room)}
                  sx={{
                    px: 2,
                    py: 1.6,
                    cursor: "pointer",
                    bgcolor: isActive ? "#EEF4FF" : "transparent",
                    borderLeft: isActive ? "3px solid #0E56C8" : "3px solid transparent",
                    "&:hover": { bgcolor: isActive ? "#EEF4FF" : "#F7F9FC" },
                    borderBottom: "1px solid rgba(225,232,241,0.5)",
                  }}
                >
                  <Stack direction="row" spacing={1.3} alignItems="flex-start">
                    <Avatar sx={{ width: 40, height: 40, bgcolor: role === "vendor" ? "#0E56C8" : "#239654", fontSize: "0.82rem", fontWeight: 800, flexShrink: 0 }}>
                      {getInitials(name)}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ color: adminUi.colors.text, fontSize: "0.86rem", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {name}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          {unread > 0 ? (
                            <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#0E56C8", color: "#FFFFFF", display: "grid", placeItems: "center", fontSize: "0.58rem", fontWeight: 900 }}>
                              {unread}
                            </Box>
                          ) : null}
                          <Typography sx={{ color: "#A0ACBA", fontSize: "0.66rem", flexShrink: 0 }}>
                            {formatTime(room.lastMessageAt)}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Typography sx={{ color: "#7A8799", fontSize: "0.74rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mt: 0.2 }}>
                        {room.lastMessage || "No messages yet"}
                      </Typography>
                      <Box sx={{ mt: 0.5, display: "inline-flex", px: 0.7, py: 0.15, borderRadius: "999px", bgcolor: role === "vendor" ? "#EEF4FF" : "#F0F5A8", color: role === "vendor" ? "#0E56C8" : "#526000", fontSize: "0.58rem", fontWeight: 800, textTransform: "uppercase" }}>
                        {role}
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Chat area */}
        {activeRoomId ? (
          <ChatWindow
            messages={roomMessages}
            currentUserId={currentUserId}
            otherUser={{ name: otherParticipant.name, role: otherParticipant.role, online: connected }}
            typingUsers={roomTyping}
            onSend={(text) => sendMessage(activeRoomId, text)}
            onTypingStart={() => startTyping(activeRoomId)}
            onTypingStop={() => stopTyping(activeRoomId)}
            loading={loadingMessages}
            accentColor="#0E56C8"
          />
        ) : (
          <Box sx={{ display: "grid", placeItems: "center", bgcolor: "#F7F9FC" }}>
            <Box sx={{ textAlign: "center" }}>
              <ChatOutlinedIcon sx={{ fontSize: "2.5rem", color: "#C8D4E4", mb: 1 }} />
              <Typography sx={{ color: "#A0ACBA", fontSize: "1rem", fontWeight: 700 }}>Select a conversation</Typography>
              <Typography sx={{ mt: 0.5, color: "#C8D4E4", fontSize: "0.82rem" }}>Choose a chat or start a new one</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminHelpDeskPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Tickets");
  const token = authStorage.getAccessToken?.() || null;
  const currentUserId = user?.id || user?._id || "";
  const currentUserName = user?.fullName || user?.name || user?.email || "Admin";

  return (
    <AdminPageShell>
      <AdminPageHeader title="Help Desk" subtitle="Manage support tickets and live chat with vendors and customers." />

      <Stack direction="row" spacing={0} sx={{ borderBottom: "1px solid rgba(225,232,241,0.96)", mb: 3 }}>
        {["Tickets", "Chat"].map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            sx={{
              minHeight: 42,
              px: 2,
              borderRadius: 0,
              borderBottom: activeTab === tab ? "2px solid #0E56C8" : "2px solid transparent",
              color: activeTab === tab ? "#0E56C8" : "#6F7D8F",
              fontSize: "0.88rem",
              fontWeight: activeTab === tab ? 800 : 600,
              textTransform: "none",
              mb: "-1px",
              "&:hover": { bgcolor: "transparent", color: "#0E56C8" },
            }}
          >
            {tab}
          </Button>
        ))}
      </Stack>

      {activeTab === "Tickets" ? <TicketsTab /> : null}
      {activeTab === "Chat" ? (
        <ChatTab currentUserId={currentUserId} currentUserName={currentUserName} token={token} />
      ) : null}
    </AdminPageShell>
  );
}
