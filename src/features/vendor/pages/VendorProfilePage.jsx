import { useState } from "react";
import {
  Box,
  Button,
  InputBase,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import vendorProfileAvatar from "@/shared/assets/images/vendor/profile/vendor-profile-avatar-placeholder.svg";

const tabs = ["Profile", "Business Details"];

const accountFields = [
  { label: "Full Name", value: "Vikas Solar Tech" },
  { label: "Email Address", value: "contact@vikassolar.com" },
  { label: "Phone Number", value: "+1 (555) 012-3456", fullWidth: true },
];

const businessFields = [
  { label: "Company Name", value: "Tata Power Solar" },
  { label: "GST Number", value: "27AAACT1234A1Z1" },
  { label: "Full Business Address", value: "34, Corporate Park, Saki Naka, Andheri East", fullWidth: true },
  { label: "City", value: "Mumbai" },
  { label: "State", value: "Maharashtra", select: true },
];

const serviceItems = ["Installation", "Maintenance", "Site Survey", "Consultation"];

const documentDropzones = [
  {
    title: "Company Documents",
    subtitle: "PDF, JPG (Max 5MB)",
  },
  {
    title: "Certifications & Awards",
    subtitle: "Verified ISO or local certs",
  },
];

function FieldBlock({ label, value, fullWidth, select }) {
  return (
    <Box sx={{ gridColumn: fullWidth ? { xs: "auto", md: "1 / -1" } : "auto" }}>
      <Typography
        sx={{
          mb: 0.45,
          color: "#6F7D8F",
          fontSize: "0.72rem",
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          minHeight: 38,
          px: 1.15,
          borderRadius: "0.8rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <InputBase
          value={value}
          readOnly
          sx={{
            width: "100%",
            color: "#223146",
            fontSize: "0.82rem",
            fontWeight: 600,
            "& input": { p: 0, cursor: "default" },
          }}
        />
        {select ? (
          <KeyboardArrowDownRoundedIcon sx={{ color: "#8A96A7", fontSize: "1rem" }} />
        ) : null}
      </Box>
    </Box>
  );
}

function SectionIntro({ title, description }) {
  return (
    <Box sx={{ maxWidth: 220 }}>
      <Typography sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}>
        {title}
      </Typography>
      <Typography
        sx={{
          mt: 0.55,
          color: "#6F7D8F",
          fontSize: "0.76rem",
          lineHeight: 1.65,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

export default function VendorProfilePage() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={2.2} sx={{ pb: 1.15, borderBottom: "1px solid #E7ECF2" }}>
        {tabs.map((tab) => (
          <Box
            key={tab}
            onClick={() => setActiveTab(tab)}
            sx={{
              pb: 0.95,
              borderBottom: activeTab === tab ? "2px solid #0E56C8" : "2px solid transparent",
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

      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={1.4}
        sx={{ mt: 2.3 }}
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
            {activeTab === "Profile" ? "Vendor Profile" : "Business Details"}
          </Typography>
          <Typography
            sx={{
              mt: 0.45,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            {activeTab === "Profile"
              ? "Manage your business identity and account security settings."
              : "Manage your commercial profile and operational certificates."}
          </Typography>
        </Box>

        {activeTab === "Business Details" ? (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="text"
              sx={{
                minHeight: 38,
                px: 1.2,
                color: "#556478",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                minHeight: 38,
                px: 2,
                borderRadius: "0.95rem",
                bgcolor: "#0E56C8",
                boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Save Changes
            </Button>
          </Stack>
        ) : null}
      </Stack>

      {activeTab === "Profile" ? (
        <Box
          sx={{
            mt: 2.1,
            p: { xs: 1.35, md: 1.6 },
            borderRadius: "1.25rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={1.6}
          >
            <Stack direction="row" spacing={1.35} alignItems="center">
              <Box
                component="img"
                src={vendorProfileAvatar}
                alt="Vendor profile avatar placeholder"
                sx={{
                  width: 112,
                  height: 112,
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0 14px 28px rgba(16,29,51,0.1)",
                }}
              />

              <Box>
                <Typography sx={{ color: "#223146", fontSize: "1.8rem", fontWeight: 800, lineHeight: 1.05 }}>
                  Vikas Solar Tech
                </Typography>
                <Typography sx={{ mt: 0.45, color: "#5F6C7E", fontSize: "0.88rem" }}>
                  contact@vikassolar.com
                </Typography>
                <Box
                  sx={{
                    mt: 1.05,
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
                  Verified Vendor
                </Box>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              startIcon={<UploadOutlinedIcon />}
              sx={{
                minHeight: 38,
                px: 1.45,
                borderRadius: "0.95rem",
                borderColor: "rgba(208,216,226,0.95)",
                bgcolor: "#F5F7FB",
                color: "#223146",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Change Photo
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            mt: 2.1,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "1.18fr 0.82fr" },
            gap: 1.6,
          }}
        >
          <Box
            sx={{
              p: { xs: 1.35, md: 1.5 },
              borderRadius: "1.25rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={1.2}
            >
              <Stack direction="row" spacing={1.1} alignItems="center">
                <Box
                  component="img"
                  src={vendorProfileAvatar}
                  alt="Business profile placeholder"
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "0.95rem",
                    objectFit: "cover",
                    boxShadow: "0 12px 24px rgba(16,29,51,0.08)",
                  }}
                />
                <Box>
                  <Typography sx={{ color: "#223146", fontSize: "1.6rem", fontWeight: 800, lineHeight: 1.08 }}>
                    Tata Power Solar
                  </Typography>
                  <Stack direction="row" spacing={0.7} alignItems="center" flexWrap="wrap" sx={{ mt: 0.65 }}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        px: 0.9,
                        py: 0.34,
                        borderRadius: "999px",
                        bgcolor: "#E7F318",
                        color: "#6C7300",
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                    >
                      EPC Contractor
                    </Box>
                    <Stack direction="row" spacing={0.45} alignItems="center">
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#239654",
                        }}
                      />
                      <Typography sx={{ color: "#223146", fontSize: "0.74rem", fontWeight: 700 }}>
                        Verified Vendor
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>

              <Box
                sx={{
                  width: 88,
                  height: 88,
                  borderRadius: "1.1rem",
                  bgcolor: "#F7F9FC",
                  border: "1px solid rgba(232,237,244,0.96)",
                  color: "#D7DEE8",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <WorkspacePremiumOutlinedIcon sx={{ fontSize: "2.2rem" }} />
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              p: 1.45,
              borderRadius: "1.15rem",
              bgcolor: "#F8FAFD",
              border: "1px solid rgba(230,235,242,0.95)",
            }}
          >
            <Stack direction="row" spacing={0.9} alignItems="center" sx={{ mb: 1.35 }}>
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
                <BusinessOutlinedIcon sx={{ fontSize: "0.95rem" }} />
              </Box>
              <Typography sx={{ color: "#223146", fontSize: "0.96rem", fontWeight: 800 }}>
                Service Capability
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: "#7D8797",
                fontSize: "0.56rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Services Offered
            </Typography>

            <Box
              sx={{
                mt: 1.1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0.75,
              }}
            >
              {serviceItems.map((item) => (
                <Stack
                  key={item}
                  direction="row"
                  spacing={0.7}
                  alignItems="center"
                  sx={{
                    minHeight: 34,
                    px: 0.9,
                    borderRadius: "0.75rem",
                    bgcolor: "#FFFFFF",
                    border: "1px solid rgba(225,232,241,0.96)",
                  }}
                >
                  <CheckBoxRoundedIcon sx={{ color: "#0E56C8", fontSize: "0.95rem" }} />
                  <Typography sx={{ color: "#223146", fontSize: "0.74rem", fontWeight: 600 }}>
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Box>

            <Box
              sx={{
                mt: 1.15,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0.75,
              }}
            >
              <Box
                sx={{
                  minHeight: 38,
                  px: 1,
                  borderRadius: "0.8rem",
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(225,232,241,0.96)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "#7D8797", fontSize: "0.64rem", fontWeight: 700 }}>
                  Coverage Area
                </Typography>
                <Typography sx={{ mt: 0.16, color: "#0E56C8", fontSize: "0.76rem", fontWeight: 800 }}>
                  Pan India
                </Typography>
              </Box>
              <Box
                sx={{
                  minHeight: 38,
                  px: 1,
                  borderRadius: "0.8rem",
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(225,232,241,0.96)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "#7D8797", fontSize: "0.64rem", fontWeight: 700 }}>
                  Experience
                </Typography>
                <Typography sx={{ mt: 0.16, color: "#239654", fontSize: "0.76rem", fontWeight: 800 }}>
                  15+ years
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          mt: 1.8,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "0.55fr 1fr" },
          gap: 1.7,
        }}
      >
        <SectionIntro
          title={activeTab === "Profile" ? "Account Details" : "Company Information"}
          description={
            activeTab === "Profile"
              ? "Update your contact information. This information will be visible on your public vendor profile and official quotes."
              : "Manage your registered business information shown across profile surfaces and commercial submissions."
          }
        />

        <Box
          sx={{
            p: 1.45,
            borderRadius: "1.15rem",
            bgcolor: "#F8FAFD",
            border: "1px solid rgba(230,235,242,0.95)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 1.2,
            }}
          >
            {(activeTab === "Profile" ? accountFields : businessFields).map((field) => (
              <FieldBlock key={field.label} {...field} />
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 1.9,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "0.55fr 1fr" },
          gap: 1.7,
        }}
      >
        <SectionIntro
          title={activeTab === "Profile" ? "Security" : "Compliance Documents"}
          description={
            activeTab === "Profile"
              ? "Keep your account secure by enabling two-factor authentication and regularly updating your credentials."
              : "Keep business paperwork and certifications current so your vendor account remains marketplace-ready."
          }
        />

        {activeTab === "Profile" ? (
          <Box
            sx={{
              p: 1.45,
              borderRadius: "1.15rem",
              bgcolor: "#F8FAFD",
              border: "1px solid rgba(230,235,242,0.95)",
            }}
          >
            <Stack spacing={1.25}>
              <Stack direction="row" justifyContent="space-between" spacing={1.2} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
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
                    <LockResetOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#223146", fontSize: "0.86rem", fontWeight: 800 }}>
                      Password
                    </Typography>
                    <Typography sx={{ mt: 0.12, color: "#7A8799", fontSize: "0.7rem" }}>
                      Last changed 3 months ago
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  sx={{
                    px: 0,
                    minHeight: 28,
                    color: "#0E56C8",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Change Password
                </Button>
              </Stack>

              <Stack direction="row" justifyContent="space-between" spacing={1.2} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "0.8rem",
                      bgcolor: "#EEF9F1",
                      color: "#239654",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <SecurityOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#223146", fontSize: "0.86rem", fontWeight: 800 }}>
                      Two-Factor Authentication
                    </Typography>
                    <Typography sx={{ mt: 0.12, color: "#7A8799", fontSize: "0.7rem" }}>
                      Recommended for high security accounts
                    </Typography>
                  </Box>
                </Stack>
                <Switch defaultChecked />
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Box
            sx={{
              p: 1.45,
              borderRadius: "1.15rem",
              bgcolor: "#F8FAFD",
              border: "1px solid rgba(230,235,242,0.95)",
            }}
          >
            <Stack spacing={1.05}>
              {documentDropzones.map((item) => (
                <Box
                  key={item.title}
                  sx={{
                    p: 1.35,
                    borderRadius: "1rem",
                    bgcolor: "#FFFFFF",
                    border: "1px dashed rgba(203,213,225,0.96)",
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "0.9rem",
                      bgcolor: "#F5F7FB",
                      color: "#556478",
                      display: "grid",
                      placeItems: "center",
                      mx: "auto",
                    }}
                  >
                    <CloudUploadOutlinedIcon sx={{ fontSize: "1rem" }} />
                  </Box>
                  <Typography sx={{ mt: 0.8, color: "#223146", fontSize: "0.8rem", fontWeight: 700 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ mt: 0.18, color: "#7A8799", fontSize: "0.68rem" }}>
                    {item.subtitle}
                  </Typography>
                </Box>
              ))}

              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={1}
                alignItems="center"
                sx={{
                  p: 1.05,
                  borderRadius: "0.95rem",
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(225,232,241,0.96)",
                }}
              >
                <Stack direction="row" spacing={0.9} alignItems="center">
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "0.8rem",
                      bgcolor: "#EEF9F1",
                      color: "#239654",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <BadgeOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#223146", fontSize: "0.78rem", fontWeight: 700 }}>
                      Business_License_2024.pdf
                    </Typography>
                    <Typography sx={{ mt: 0.12, color: "#7A8799", fontSize: "0.68rem" }}>
                      Uploaded 2 days ago • 1.2MB
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
                    color: "#E24D4D",
                  }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: "1rem" }} />
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Box>

      {activeTab === "Profile" ? (
        <Box
          sx={{
            mt: 2.1,
            p: 1.3,
            borderRadius: "1.2rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            flexWrap="wrap"
          >
            <Button
              variant="text"
              sx={{
                minHeight: 38,
                px: 1.45,
                color: "#556478",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                minHeight: 38,
                px: 2,
                borderRadius: "0.95rem",
                bgcolor: "#0E56C8",
                boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
