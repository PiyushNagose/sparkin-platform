import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Link as RouterLink } from "react-router-dom";
import projectMapPlaceholder from "@/shared/assets/images/vendor/project/vendor-project-map-placeholder.png";

const statCards = [
  { label: "System Size", value: "5.4 kW" },
  { label: "Total Price", value: "\u20B93,15,000", highlight: true },
  { label: "Start Date", value: "Oct 24, 2023" },
  { label: "Est. Payback", value: "4.2 Years" },
];

const milestones = [
  { label: "Site Visit", date: "Oct 26, 2023", state: "completed" },
  { label: "Bank Loan", date: "In Progress", state: "active" },
  { label: "Installation", state: "upcoming" },
  { label: "Inspection", state: "upcoming" },
  { label: "Activation", state: "upcoming" },
];

const timeline = [
  {
    title: "Panels Delivered",
    meta: "Today, 10:24 AM • Warehouse",
    tone: "#0E56C8",
    bg: "#EAF1FF",
  },
  {
    title: "Site Visit Completed",
    meta: "Oct 26, 2023 • Eng. Vikram Singh",
    note: "Site ready for structural installation. Anchor points marked.",
    tone: "#0E56C8",
    bg: "#EAF1FF",
  },
  {
    title: "Agreement Signed",
    meta: "Oct 24, 2023 • Digital Signature",
    tone: "#0E56C8",
    bg: "#EAF1FF",
  },
  {
    title: "Project Created",
    meta: "Oct 24, 2023 • Portal",
    tone: "#95B9F0",
    bg: "#EFF5FF",
  },
];

const technicalSpecs = [
  ["Panel Type", "Mono PERC 540W"],
  ["Inverter", "Sparkin Hybrid 5kW"],
  ["Roof Type", "Concrete Flat Roof"],
  ["Mounting", "HDG Fixed Structure"],
];

const tabs = ["Installation Details", "Customer Info", "Documents"];

const customerInfoBlocks = [
  {
    title: "Primary Contact",
    rows: ["Amit Sharma", "+91 98765 43210", "amit.sharma@example.com"],
  },
  {
    title: "Installation Address",
    rows: [
      "Plot 42, Harmony Residency,",
      "Baner-Pashan Link Road,",
      "Pune, Maharashtra 411045",
    ],
  },
  {
    title: "Utility Provider",
    rows: ["MSEDCL (Maharashtra State Electricity)", "Consumer No: 1542389021"],
  },
  {
    title: "Billing Tier",
    rows: ["Residential - LT-1"],
  },
];

const documentItems = [
  {
    name: "Signed_Contract_Final.pdf",
    meta: "Uploaded Oct 24, 2023 • 2.4 MB",
    tone: "#FF6B6B",
    bg: "#FFF1F1",
    icon: "pdf",
  },
  {
    name: "Roof_Survey_Photos.zip",
    meta: "Uploaded Oct 26, 2023 • 15.8 MB",
    tone: "#4F89FF",
    bg: "#EEF4FF",
    icon: "zip",
  },
  {
    name: "Technical_Layout_v2.dwg",
    meta: "Uploaded Oct 25, 2023 • 4.1 MB",
    tone: "#33B864",
    bg: "#EAF9F0",
    icon: "dwg",
  },
  {
    name: "NOC_Utility_Company.pdf",
    meta: "Uploaded Nov 02, 2023 • 1.1 MB",
    tone: "#FFB01F",
    bg: "#FFF6E5",
    icon: "noc",
  },
];

function MilestoneNode({ milestone, isFirst, isLast }) {
  const completed = milestone.state === "completed";
  const active = milestone.state === "active";

  return (
    <Box sx={{ flex: 1, minWidth: 0, position: "relative" }}>
      {!isFirst && (
        <Box
          sx={{
            position: "absolute",
            top: 13,
            left: "-50%",
            width: "100%",
            height: 2,
            bgcolor: completed || active ? "#0E56C8" : "#E3E8EF",
          }}
        />
      )}
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            top: 13,
            left: "50%",
            width: "100%",
            height: 2,
            bgcolor: completed ? "#0E56C8" : "#E3E8EF",
          }}
        />
      )}

      <Stack alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            bgcolor: completed ? "#0E56C8" : active ? "#FFFFFF" : "#EEF2F7",
            border: active ? "3px solid #0E56C8" : "none",
            color: completed ? "#FFFFFF" : active ? "#0E56C8" : "#8E99A8",
            display: "grid",
            placeItems: "center",
            fontSize: "0.78rem",
            fontWeight: 800,
            boxShadow: completed ? "0 10px 18px rgba(14,86,200,0.16)" : "none",
          }}
        >
          {completed ? "✓" : active ? "•" : "◌"}
        </Box>
        <Typography
          sx={{
            mt: 1,
            color: active ? "#0E56C8" : "#223146",
            fontSize: "0.74rem",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {milestone.label}
        </Typography>
        {milestone.date ? (
          <Typography
            sx={{
              mt: 0.3,
              color: active ? "#0E56C8" : "#7C8797",
              fontSize: "0.62rem",
              fontWeight: active ? 800 : 500,
              textTransform: active ? "uppercase" : "none",
              letterSpacing: active ? "0.05em" : "normal",
              textAlign: "center",
            }}
          >
            {milestone.date}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}

export default function VendorProjectDetailPage() {
  const [activeTab, setActiveTab] = useState("Installation Details");

  const renderDocumentIcon = (item) => {
    if (item.icon === "zip") {
      return <ImageOutlinedIcon sx={{ fontSize: "0.95rem" }} />;
    }

    return <DescriptionOutlinedIcon sx={{ fontSize: "0.95rem" }} />;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        component={RouterLink}
        to="/vendor/projects"
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: "1rem" }} />}
        sx={{
          mb: 2.1,
          px: 0,
          minHeight: 28,
          color: "#556478",
          fontSize: "0.78rem",
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        Back to Projects
      </Button>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.45fr 0.78fr" },
          gap: 1.8,
          alignItems: "start",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.9rem", md: "2.2rem" },
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
            }}
          >
            Amit Sharma Residential
          </Typography>

          <Stack
            direction="row"
            spacing={0.7}
            alignItems="center"
            flexWrap="wrap"
            sx={{ mt: 0.65, color: "#5F6C7E" }}
          >
            <LocationOnOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            <Typography sx={{ fontSize: "0.88rem", lineHeight: 1.6 }}>
              Pune, MH • Project ID: SPK-2023-9842
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 1.25,
              mt: 2.2,
            }}
          >
            {statCards.map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 1.45,
                  minHeight: 86,
                  borderRadius: "1rem",
                  bgcolor: "#FBFCFE",
                  border: "1px solid rgba(230,235,242,0.95)",
                }}
              >
                <Typography
                  sx={{
                    color: "#7D8797",
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    mt: 1.05,
                    color: item.highlight ? "#0E56C8" : "#223146",
                    fontSize: item.highlight ? "1.48rem" : "1.4rem",
                    fontWeight: 800,
                    lineHeight: 1.06,
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              mt: 2.3,
              p: { xs: 1.4, md: 1.7 },
              borderRadius: "1.35rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 16px 30px rgba(16,29,51,0.04)",
            }}
          >
            <Typography
              sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
            >
              Project Milestones
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 2, md: 0 }}
              sx={{ mt: 2.2 }}
            >
              {milestones.map((milestone, index) => (
                <MilestoneNode
                  key={milestone.label}
                  milestone={milestone}
                  isFirst={index === 0}
                  isLast={index === milestones.length - 1}
                />
              ))}
            </Stack>
          </Box>

          <Stack
            direction="row"
            spacing={2.2}
            sx={{ mt: 2.2, borderBottom: "1px solid #E7ECF2" }}
          >
            {tabs.map((tab) => (
              <Box
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  pb: 1,
                  borderBottom:
                    activeTab === tab
                      ? "2px solid #0E56C8"
                      : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    color: activeTab === tab ? "#0E56C8" : "#556478",
                    fontSize: "0.78rem",
                    fontWeight: activeTab === tab ? 800 : 600,
                  }}
                >
                  {tab}
                </Typography>
              </Box>
            ))}
          </Stack>

          {activeTab === "Installation Details" ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1.5,
                mt: 1.6,
              }}
            >
              <Box
                sx={{
                  p: 1.45,
                  borderRadius: "1rem",
                  bgcolor: "#F8FAFD",
                  border: "1px solid rgba(230,235,242,0.95)",
                }}
              >
                <Stack
                  direction="row"
                  spacing={0.9}
                  alignItems="center"
                  sx={{ mb: 1.35 }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "0.8rem",
                      bgcolor: "#EAF1FF",
                      color: "#0E56C8",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <BoltRoundedIcon sx={{ fontSize: "0.95rem" }} />
                  </Box>
                  <Typography
                    sx={{
                      color: "#223146",
                      fontSize: "0.95rem",
                      fontWeight: 800,
                    }}
                  >
                    Technical Specs
                  </Typography>
                </Stack>

                <Stack spacing={1.15}>
                  {technicalSpecs.map(([label, value]) => (
                    <Stack
                      key={label}
                      direction="row"
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ color: "#223146" }}
                    >
                      <Typography
                        sx={{ color: "#657286", fontSize: "0.77rem" }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.77rem",
                          fontWeight: 700,
                          textAlign: "right",
                        }}
                      >
                        {value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Stack spacing={1.5}>
                <Box
                  sx={{
                    p: 1.45,
                    borderRadius: "1rem",
                    bgcolor: "#F8FAFD",
                    border: "1px solid rgba(230,235,242,0.95)",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={0.9}
                    alignItems="center"
                    sx={{ mb: 1.2 }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "0.8rem",
                        bgcolor: "#F1F5FF",
                        color: "#0E56C8",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <GroupOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                    </Box>
                    <Typography
                      sx={{
                        color: "#223146",
                        fontSize: "0.95rem",
                        fontWeight: 800,
                      }}
                    >
                      Team Assigned
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Stack direction="row" spacing={-0.6}>
                      {["A", "V", "+2"].map((label, index) => (
                        <Avatar
                          key={label}
                          sx={{
                            width: 28,
                            height: 28,
                            border: "2px solid #FFFFFF",
                            bgcolor: index === 2 ? "#EAF1FF" : "#223146",
                            color: index === 2 ? "#0E56C8" : "#FFFFFF",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                          }}
                        >
                          {label}
                        </Avatar>
                      ))}
                    </Stack>
                    <Typography
                      sx={{
                        color: "#223146",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      Sparkin Install Team B
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: 1.45,
                    borderRadius: "1rem",
                    bgcolor: "#F8FAFD",
                    border: "1px solid rgba(230,235,242,0.95)",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1.1 }}
                  >
                    <Stack direction="row" spacing={0.9} alignItems="center">
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "0.8rem",
                          bgcolor: "#F1F5FF",
                          color: "#0E56C8",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <FactCheckOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                      </Box>
                      <Typography
                        sx={{
                          color: "#223146",
                          fontSize: "0.95rem",
                          fontWeight: 800,
                        }}
                      >
                        Equipment Status
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        color: "#667388",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                      }}
                    >
                      View Manifest
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      display: "inline-flex",
                      px: 1,
                      py: 0.38,
                      borderRadius: "999px",
                      bgcolor: "#E7F318",
                      color: "#6C7300",
                      fontSize: "0.64rem",
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    All Delivered
                  </Box>
                </Box>
              </Stack>
            </Box>
          ) : null}

          {activeTab === "Customer Info" ? (
            <Box
              sx={{
                mt: 1.6,
                p: 1.45,
                borderRadius: "1rem",
                bgcolor: "#F8FAFD",
                border: "1px solid rgba(230,235,242,0.95)",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 1.8,
                }}
              >
                {customerInfoBlocks.map((block, index) => (
                  <Box key={block.title}>
                    <Stack
                      direction="row"
                      spacing={0.8}
                      alignItems="center"
                      sx={{ mb: 0.95 }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "0.75rem",
                          bgcolor: "#EFF4FB",
                          color: "#0E56C8",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        {index < 2 ? (
                          <ContactPhoneOutlinedIcon
                            sx={{ fontSize: "0.9rem" }}
                          />
                        ) : (
                          <PlaceOutlinedIcon sx={{ fontSize: "0.9rem" }} />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          color: "#7A8799",
                          fontSize: "0.58rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {block.title}
                      </Typography>
                    </Stack>
                    <Stack spacing={0.38}>
                      {block.rows.map((row, rowIndex) => (
                        <Typography
                          key={row}
                          sx={{
                            color: rowIndex === 0 ? "#223146" : "#5F6C7E",
                            fontSize: rowIndex === 0 ? "0.86rem" : "0.76rem",
                            fontWeight: rowIndex === 0 ? 700 : 500,
                            lineHeight: 1.55,
                          }}
                        >
                          {row}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : null}

          {activeTab === "Documents" ? (
            <Box
              sx={{
                mt: 1.6,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1.2,
              }}
            >
              {documentItems.map((item) => (
                <Stack
                  key={item.name}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    p: 1.15,
                    borderRadius: "1rem",
                    bgcolor: "#FFFFFF",
                    border: "1px solid rgba(230,235,242,0.95)",
                    boxShadow: "0 10px 20px rgba(16,29,51,0.03)",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={0.9}
                    alignItems="center"
                    sx={{ minWidth: 0 }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "0.8rem",
                        bgcolor: item.bg,
                        color: item.tone,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {renderDocumentIcon(item)}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: "#223146",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.14,
                          color: "#7A8799",
                          fontSize: "0.62rem",
                          lineHeight: 1.45,
                        }}
                      >
                        {item.meta}
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    sx={{
                      minWidth: 28,
                      width: 28,
                      height: 28,
                      p: 0,
                      borderRadius: "50%",
                      color: "#556478",
                      flexShrink: 0,
                    }}
                  >
                    <DownloadRoundedIcon sx={{ fontSize: "0.92rem" }} />
                  </Button>
                </Stack>
              ))}
            </Box>
          ) : null}
        </Box>

        <Stack spacing={1.6}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: "1.35rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 16px 30px rgba(16,29,51,0.04)",
            }}
          >
            <Typography
              sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
            >
              Activity Timeline
            </Typography>

            <Stack spacing={1.25} sx={{ mt: 1.5 }}>
              {timeline.map((item, index) => (
                <Stack
                  key={item.title}
                  direction="row"
                  spacing={1.1}
                  alignItems="flex-start"
                >
                  <Stack alignItems="center" sx={{ pt: 0.1 }}>
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        bgcolor: item.bg,
                        color: item.tone,
                        display: "grid",
                        placeItems: "center",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                      }}
                    >
                      {index < 3 ? "■" : "+"}
                    </Box>
                    {index !== timeline.length - 1 ? (
                      <Box
                        sx={{
                          width: 2,
                          height: 42,
                          bgcolor: "#E5EAF1",
                          mt: 0.5,
                        }}
                      />
                    ) : null}
                  </Stack>

                  <Box sx={{ pt: 0.05 }}>
                    <Typography
                      sx={{
                        color: "#223146",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.15,
                        color: "#6B788A",
                        fontSize: "0.7rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.meta}
                    </Typography>
                    {item.note ? (
                      <Box
                        sx={{
                          mt: 0.7,
                          p: 0.95,
                          borderRadius: "0.95rem",
                          bgcolor: "#F9FBFD",
                          border: "1px solid rgba(232,237,244,0.95)",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#6B788A",
                            fontSize: "0.72rem",
                            lineHeight: 1.55,
                            fontStyle: "italic",
                          }}
                        >
                          "{item.note}"
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              overflow: "hidden",
              borderRadius: "1.25rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 16px 30px rgba(16,29,51,0.04)",
            }}
          >
            <Box
              component="img"
              src={projectMapPlaceholder}
              alt="Project site location preview"
              sx={{
                display: "block",
                width: "100%",
                height: 186,
                objectFit: "cover",
              }}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 1.2, py: 0.95 }}
            >
              <Typography sx={{ color: "#6C788B", fontSize: "0.7rem" }}>
                Location Preview
              </Typography>
              <Button
                size="small"
                startIcon={<PlaceOutlinedIcon sx={{ fontSize: "0.9rem" }} />}
                sx={{
                  minHeight: 28,
                  px: 1.05,
                  borderRadius: "999px",
                  bgcolor: "#FFFFFF",
                  color: "#223146",
                  fontSize: "0.64rem",
                  fontWeight: 800,
                  textTransform: "none",
                  boxShadow: "0 8px 16px rgba(16,29,51,0.08)",
                }}
              >
                Map View
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          mt: 2.1,
          p: 1.2,
          borderRadius: "1.15rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 16px 30px rgba(16,29,51,0.04)",
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", lg: "center" }}
          spacing={1.2}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={0.9}
            flexWrap="wrap"
          >
            <Button
              startIcon={<SettingsOutlinedIcon />}
              variant="outlined"
              sx={{
                minHeight: 38,
                px: 1.3,
                borderRadius: "0.9rem",
                borderColor: "rgba(225,232,241,0.96)",
                bgcolor: "#F6F8FB",
                color: "#223146",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Update Status
            </Button>
            <Button
              startIcon={<EventAvailableOutlinedIcon />}
              variant="outlined"
              sx={{
                minHeight: 38,
                px: 1.3,
                borderRadius: "0.9rem",
                borderColor: "rgba(225,232,241,0.96)",
                bgcolor: "#F6F8FB",
                color: "#223146",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Schedule Visit
            </Button>
            <Button
              startIcon={<UploadFileOutlinedIcon />}
              variant="outlined"
              sx={{
                minHeight: 38,
                px: 1.3,
                borderRadius: "0.9rem",
                borderColor: "rgba(225,232,241,0.96)",
                bgcolor: "#F6F8FB",
                color: "#223146",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Upload Document
            </Button>
          </Stack>

          <Button
            variant="contained"
            sx={{
              minHeight: 40,
              px: 2.2,
              borderRadius: "0.95rem",
              bgcolor: "#0E56C8",
              boxShadow: "0 14px 26px rgba(14,86,200,0.18)",
              fontSize: "0.76rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Mark Step Complete
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
