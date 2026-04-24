import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Link as RouterLink } from "react-router-dom";

const summaryItems = [
  ["Customer Name", "Amit Kulkarni"],
  ["Location", "Pune, MH"],
  ["System Size", "5.5 kW"],
  ["Budget", "\u20B93,20,000"],
];

const timelineOptions = [
  { title: "2-4 weeks", subtitle: "Fast Track" },
  { title: "4-6 weeks", subtitle: "Standard", active: true },
  { title: "6-8 weeks", subtitle: "Flexible" },
];

const sectionLabelSx = {
  color: "#18253A",
  fontSize: "1.25rem",
  fontWeight: 800,
  lineHeight: 1.15,
};

const sectionBodySx = {
  mt: 0.45,
  color: "#6F7D8F",
  fontSize: "0.82rem",
  lineHeight: 1.6,
  maxWidth: 240,
};

const fieldLabelSx = {
  mb: 0.45,
  color: "#667388",
  fontSize: "0.62rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    borderRadius: "0.9rem",
    bgcolor: "#F5F7FB",
    fontSize: "0.84rem",
  },
};

export default function VendorQuoteProposalPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <Button
        component={RouterLink}
        to="/vendor/leads/ak"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{
          px: 0,
          minHeight: 28,
          mb: 1.3,
          color: "#0E56C8",
          fontSize: "0.76rem",
          fontWeight: 700,
          textTransform: "none",
        }}
      >
        Back to Lead Details
      </Button>

      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={1.6}
        sx={{ mb: 2.4 }}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.9rem", md: "2.1rem" },
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            New Quotation Proposal
          </Typography>
          <Typography
            sx={{
              mt: 0.55,
              maxWidth: 500,
              color: "#6F7D8F",
              fontSize: "0.9rem",
              lineHeight: 1.62,
            }}
          >
            Prepare a comprehensive solar solution proposal for the following
            lead requirements. Precision in pricing ensures better conversion
            rates.
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1,
            py: 0.35,
            borderRadius: "999px",
            bgcolor: "#ECEA63",
            color: "#4F5500",
            fontSize: "0.68rem",
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          Active Lead Status
        </Box>
      </Stack>

      <Box
        sx={{
          p: { xs: 1.35, md: 1.55 },
          borderRadius: "1.15rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          mb: { xs: 2.25, md: 2.6 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: 1.4,
          }}
        >
          {summaryItems.map(([label, value]) => (
            <Box key={label}>
              <Typography
                sx={{
                  color: "#8B97A8",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </Typography>
              <Typography
                sx={{
                  mt: 0.42,
                  color: "#18253A",
                  fontSize: "0.96rem",
                  fontWeight: 800,
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Stack spacing={3}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "180px 1fr" },
            gap: { xs: 1.2, lg: 2.2 },
          }}
        >
          <Box>
            <Typography sx={sectionLabelSx}>01 Pricing</Typography>
            <Typography sx={sectionBodySx}>
              Define the total project cost and clear breakdown for the
              customer.
            </Typography>
          </Box>

          <Box>
            <Typography sx={fieldLabelSx}>Total Proposal Price (₹)</Typography>
            <TextField fullWidth placeholder="e.g. 3,10,000" sx={inputSx} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 1.2,
                mt: 1.2,
              }}
            >
              {["Equipment", "Labor", "Permitting"].map((label) => (
                <Box key={label}>
                  <Typography sx={fieldLabelSx}>{label}</Typography>
                  <TextField fullWidth placeholder="₹ Amount" sx={inputSx} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "180px 1fr" },
            gap: { xs: 1.2, lg: 2.2 },
          }}
        >
          <Box>
            <Typography sx={sectionLabelSx}>02 Specifications</Typography>
            <Typography sx={sectionBodySx}>
              Technical details of the proposed hardware configuration.
            </Typography>
          </Box>

          <Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1.2,
              }}
            >
              <Box>
                <Typography sx={fieldLabelSx}>System Size (kW)</Typography>
                <TextField fullWidth defaultValue="5.5" sx={inputSx} />
              </Box>
              <Box>
                <Typography sx={fieldLabelSx}>Panel Type</Typography>
                <TextField fullWidth select defaultValue="monocrystalline" sx={inputSx}>
                  <MenuItem value="monocrystalline">Monocrystalline</MenuItem>
                  <MenuItem value="polycrystalline">Polycrystalline</MenuItem>
                  <MenuItem value="bifacial">Bifacial</MenuItem>
                </TextField>
              </Box>
            </Box>

            <Box sx={{ mt: 1.2 }}>
              <Typography sx={fieldLabelSx}>Inverter Type</Typography>
              <TextField
                fullWidth
                placeholder="e.g. String Inverter, Microinverter"
                sx={inputSx}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "180px 1fr" },
            gap: { xs: 1.2, lg: 2.2 },
          }}
        >
          <Box>
            <Typography sx={sectionLabelSx}>03 Timeline</Typography>
            <Typography sx={sectionBodySx}>
              Estimated duration from agreement to full activation.
            </Typography>
          </Box>

          <Box>
            <Typography sx={fieldLabelSx}>Expected Installation</Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 1.2,
              }}
            >
              {timelineOptions.map((option) => (
                <Box
                  key={option.title}
                  sx={{
                    minHeight: 68,
                    px: 1.2,
                    py: 1.05,
                    borderRadius: "0.95rem",
                    bgcolor: "#FFFFFF",
                    border: "1px solid rgba(225,232,241,0.96)",
                    boxShadow: "0 8px 20px rgba(16,29,51,0.025)",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography
                        sx={{
                          color: "#18253A",
                          fontSize: "0.82rem",
                          fontWeight: 800,
                        }}
                      >
                        {option.title}
                      </Typography>
                      <Typography sx={{ mt: 0.22, color: "#8B97A8", fontSize: "0.68rem" }}>
                        {option.subtitle}
                      </Typography>
                    </Box>
                    {option.active ? (
                      <CheckCircleRoundedIcon sx={{ color: "#0E56C8", fontSize: "1rem" }} />
                    ) : (
                      <RadioButtonUncheckedRoundedIcon sx={{ color: "#A4AEBD", fontSize: "1rem" }} />
                    )}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "180px 1fr" },
            gap: { xs: 1.2, lg: 2.2 },
          }}
        >
          <Box>
            <Typography sx={sectionLabelSx}>04 Narrative</Typography>
            <Typography sx={sectionBodySx}>
              Detail your unique value proposition and additional services.
            </Typography>
          </Box>

          <Box>
            <Typography sx={fieldLabelSx}>Proposal Notes</Typography>
            <TextField
              fullWidth
              multiline
              minRows={5}
              placeholder="Describe the installation plan, maintenance inclusions, and warranties..."
              sx={{
                ...inputSx,
                "& .MuiOutlinedInput-root": {
                  ...inputSx["& .MuiOutlinedInput-root"],
                  alignItems: "flex-start",
                  minHeight: 148,
                },
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "180px 1fr" },
            gap: { xs: 1.2, lg: 2.2 },
          }}
        >
          <Box>
            <Typography sx={sectionLabelSx}>05 Assets</Typography>
            <Typography sx={sectionBodySx}>
              Upload format documentation and data sheets.
            </Typography>
          </Box>

          <Box>
            <Typography sx={fieldLabelSx}>Upload Detailed Quotation (PDF)</Typography>
            <Box
              sx={{
                minHeight: 164,
                borderRadius: "1rem",
                border: "1px dashed #B8C7DD",
                bgcolor: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                px: 2,
              }}
            >
              <Stack spacing={0.9} alignItems="center" sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    bgcolor: "#F2F6FD",
                    color: "#0E56C8",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CloudUploadOutlinedIcon sx={{ fontSize: "1.05rem" }} />
                </Box>
                <Typography sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 700 }}>
                  Click to upload or drag and drop
                </Typography>
                <Typography sx={{ color: "#98A3B2", fontSize: "0.68rem" }}>
                  Max file size 10MB (PDF only)
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Stack>

      <Stack
        direction="row"
        spacing={1.1}
        justifyContent="flex-end"
        sx={{ mt: { xs: 2.6, md: 3 } }}
      >
        <Button
          variant="outlined"
          sx={{
            minHeight: 40,
            px: 1.8,
            borderRadius: "0.95rem",
            borderColor: "rgba(220,228,238,0.96)",
            bgcolor: "#F5F7FB",
            color: "#556478",
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Save as Draft
        </Button>
        <Button
          variant="contained"
          startIcon={<BoltRoundedIcon />}
          sx={{
            minHeight: 40,
            px: 2,
            borderRadius: "0.95rem",
            bgcolor: "#0E56C8",
            boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Submit Quote
        </Button>
      </Stack>
    </Box>
  );
}
