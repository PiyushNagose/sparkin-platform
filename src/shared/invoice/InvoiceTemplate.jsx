import { Box, Stack, Typography } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import logoPlaceholder from "@/shared/assets/logo-placeholder.png";

const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactMoneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const company = {
  name: "My Sparkin",
  address: "123 Innovation Street, Creativity Hub, Bangalore, Karnataka 560001, India",
  email: "hello@mysparkin.com",
  phone: "+91 98765 43210",
  website: "www.mysparkin.com",
  logo: logoPlaceholder,
};

const bank = {
  bankName: "HDFC Bank",
  accountName: "My Sparkin",
  accountNumber: "50200012345678",
  ifsc: "HDFC0001234",
};

function formatMoney(value, compact = false) {
  return (compact ? compactMoneyFormatter : moneyFormatter).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "Pending";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function titleCaseStatus(status) {
  return String(status || "pending")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildInvoiceModel(payment = {}) {
  const amount = Number(payment.amount || 0);
  const subtotal = amount ? Math.round((amount / 1.18) * 100) / 100 : 0;
  const tax = Math.max(0, amount - subtotal);
  const dueAt = payment.dueAt || payment.createdAt;
  const project = payment.project || {};
  const customer = payment.customer || project.customer || {};
  const location = project.installationAddress || {};
  const milestone = payment.milestone || {};
  const invoiceNumber =
    payment.invoiceNumber || `INV-${new Date().getFullYear()}-${String(payment.id || "0001").slice(-4).padStart(4, "0")}`;
  const lineTitle = milestone.title || payment.title || "Solar Project Milestone";
  const lineDescription =
    project.system?.sizeKw || location.city
      ? [project.system?.sizeKw ? `${project.system.sizeKw} kW system` : "", location.city, location.state]
          .filter(Boolean)
          .join(" - ")
      : "Project payment as per approved milestone";

  return {
    invoiceNumber,
    invoiceDate: formatDate(payment.createdAt || new Date().toISOString()),
    dueDate: formatDate(dueAt),
    status: titleCaseStatus(payment.status),
    company,
    bank,
    customer: {
      name: customer.fullName || "Customer",
      company: customer.companyName || project.customerCompany || "Solar installation customer",
      address:
        [location.addressLine1, location.city, location.state, location.pincode].filter(Boolean).join(", ") ||
        "Installation address pending",
      email: customer.email || "No email provided",
      phone: customer.phone || customer.mobile || "Phone not provided",
    },
    items: [
      {
        title: lineTitle,
        description: lineDescription,
        quantity: 1,
        unitPrice: subtotal || amount,
        amount: subtotal || amount,
      },
      {
        title: "GST & Compliance",
        description: "Tax estimate and invoice processing",
        quantity: 1,
        unitPrice: tax,
        amount: tax,
      },
    ],
    totals: {
      subtotal,
      discount: 0,
      tax,
      total: amount,
    },
  };
}

export function downloadInvoiceHtml(payment) {
  const invoice = buildInvoiceModel(payment);
  const html = renderInvoiceHtml(invoice);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoice.invoiceNumber}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function downloadInvoicePdf(payment) {
  const invoice = buildInvoiceModel(payment);
  const dataUrl = await renderInvoiceCanvasDataUrl(invoice);
  const pdfBlob = buildImagePdf(dataUrl, 794, 1123);
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoice.invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function printInvoiceHtml(payment) {
  const invoice = buildInvoiceModel(payment);
  const html = renderInvoiceHtml(invoice, { autoPrint: true });
  const printWindow = window.open("", "_blank", "width=1100,height=900");

  if (!printWindow) {
    downloadInvoiceHtml(payment);
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawRoundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = String(text || "").split(/\s+/);
  let line = "";
  let lineCount = 0;

  for (let index = 0; index < words.length; index += 1) {
    const testLine = line ? `${line} ${words[index]}` : words[index];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      lineCount += 1;
      line = words[index];
      if (lineCount >= maxLines - 1) break;
    } else {
      line = testLine;
    }
  }

  if (line && lineCount < maxLines) ctx.fillText(line, x, y);
}

async function renderInvoiceCanvasDataUrl(invoice) {
  const width = 794;
  const height = 1123;
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const blue = "#0E56C8";
  const dark = "#102142";
  const muted = "#4E5B72";
  const border = "#D9E8FF";
  let logo = null;

  try {
    logo = await loadImage(invoice.company.logo);
  } catch {
    logo = null;
  }

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = blue;
  ctx.beginPath();
  ctx.arc(width + 10, -20, 230, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = blue;
  ctx.beginPath();
  ctx.arc(-40, height + 10, 170, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(0, height - 92, width, 92);

  if (logo) {
    ctx.drawImage(logo, 48, 44, 62, 62);
  }
  ctx.fillStyle = dark;
  ctx.font = "900 34px Arial";
  ctx.fillText("MY", 120, 74);
  ctx.fillStyle = blue;
  ctx.fillText("SPARKIN", 178, 74);
  ctx.fillStyle = muted;
  ctx.font = "600 16px Arial";
  ctx.fillText("Spark Ideas. Create Impact.", 120, 98);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 46px Arial";
  ctx.fillText("INVOICE", 492, 86);
  drawRoundRect(ctx, 492, 108, 184, 32, 16);
  ctx.fillStyle = "#2E87FF";
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 15px Arial";
  ctx.fillText(invoice.invoiceNumber, 512, 129);

  drawRoundRect(ctx, 48, 142, 370, 150, 14);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.stroke();
  if (logo) {
    drawRoundRect(ctx, 72, 174, 86, 86, 43);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.drawImage(logo, 84, 186, 62, 62);
  }
  ctx.fillStyle = blue;
  ctx.font = "900 20px Arial";
  ctx.fillText(invoice.company.name, 190, 174);
  ctx.fillStyle = "#2C3B54";
  ctx.font = "14px Arial";
  drawWrappedText(ctx, invoice.company.address, 190, 200, 190, 18, 3);
  ctx.fillText(invoice.company.email, 190, 254);
  ctx.fillText(invoice.company.phone, 190, 276);

  [
    ["Invoice Date", invoice.invoiceDate],
    ["Due Date", invoice.dueDate],
    ["Status", invoice.status],
  ].forEach(([label, value], index) => {
    const y = 168 + index * 58;
    ctx.fillStyle = blue;
    ctx.font = "900 22px Arial";
    ctx.fillText(index === 2 ? "◇" : "□", 492, y);
    ctx.fillStyle = "#4F6078";
    ctx.font = "13px Arial";
    ctx.fillText(label, 532, y - 6);
    ctx.fillStyle = dark;
    ctx.font = "900 15px Arial";
    ctx.fillText(value, 532, y + 14);
  });

  drawRoundRect(ctx, 48, 328, 698, 150, 12);
  ctx.fillStyle = "#F8FBFF";
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.stroke();
  ctx.fillStyle = blue;
  ctx.font = "900 15px Arial";
  ctx.fillText("BILL TO", 80, 360);
  ctx.fillStyle = dark;
  ctx.font = "900 20px Arial";
  ctx.fillText(invoice.customer.name, 72, 392);
  ctx.font = "700 14px Arial";
  ctx.fillText(invoice.customer.company, 72, 416);
  ctx.font = "14px Arial";
  drawWrappedText(ctx, invoice.customer.address, 72, 440, 360, 18, 2);
  ctx.fillText(invoice.customer.email, 72, 472);
  ctx.fillText(invoice.customer.phone, 72, 494);

  const tableX = 48;
  const tableY = 512;
  const tableW = 698;
  drawRoundRect(ctx, tableX, tableY, tableW, 254, 12);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.stroke();
  ctx.fillStyle = blue;
  ctx.fillRect(tableX, tableY, tableW, 42);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 13px Arial";
  ["#", "ITEM / DESCRIPTION", "QTY", "UNIT PRICE", "AMOUNT"].forEach((heading, index) => {
    const xs = [70, 160, 440, 520, 644];
    ctx.fillText(heading, xs[index], tableY + 27);
  });

  invoice.items.forEach((item, index) => {
    const y = tableY + 78 + index * 84;
    ctx.strokeStyle = "#E9EEF6";
    ctx.beginPath();
    ctx.moveTo(tableX + 20, y - 35);
    ctx.lineTo(tableX + tableW - 20, y - 35);
    ctx.stroke();
    ctx.fillStyle = dark;
    ctx.font = "900 14px Arial";
    ctx.fillText(String(index + 1).padStart(2, "0"), 70, y);
    ctx.fillText(item.title, 160, y);
    ctx.fillStyle = "#41516A";
    ctx.font = "13px Arial";
    drawWrappedText(ctx, item.description, 160, y + 20, 230, 16, 2);
    ctx.fillStyle = dark;
    ctx.font = "14px Arial";
    ctx.fillText(String(item.quantity), 450, y);
    ctx.fillText(formatMoney(item.unitPrice), 520, y);
    ctx.font = "700 14px Arial";
    ctx.fillText(formatMoney(item.amount), 644, y);
  });

  drawRoundRect(ctx, 48, 806, 220, 132, 12);
  ctx.fillStyle = "#F8FBFF";
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.stroke();
  ctx.fillStyle = blue;
  ctx.font = "900 13px Arial";
  ctx.fillText("PAYMENT INFORMATION", 68, 834);
  ctx.fillStyle = "#25364F";
  ctx.font = "12px Arial";
  [
    ["Bank Name", invoice.bank.bankName],
    ["Account Name", invoice.bank.accountName],
    ["Account Number", invoice.bank.accountNumber],
    ["IFSC Code", invoice.bank.ifsc],
  ].forEach(([label, value], index) => {
    const y = 864 + index * 20;
    ctx.font = "700 12px Arial";
    ctx.fillText(label, 68, y);
    ctx.font = "12px Arial";
    ctx.fillText(value, 168, y);
  });

  ctx.fillStyle = blue;
  ctx.font = "900 22px Arial";
  ctx.fillText("THANK YOU!", 304, 834);
  ctx.fillRect(304, 848, 34, 3);
  ctx.fillStyle = "#25364F";
  ctx.font = "13px Arial";
  drawWrappedText(ctx, "We truly appreciate your business and look forward to working with you again.", 304, 882, 190, 18, 4);

  drawRoundRect(ctx, 510, 806, 236, 168, 12);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.stroke();
  [
    ["Subtotal", invoice.totals.subtotal],
    ["Discount", -invoice.totals.discount],
    ["Tax (18% GST)", invoice.totals.tax],
  ].forEach(([label, value], index) => {
    const y = 838 + index * 30;
    ctx.fillStyle = "#25364F";
    ctx.font = "14px Arial";
    ctx.fillText(label, 536, y);
    ctx.fillStyle = dark;
    ctx.font = "700 14px Arial";
    ctx.textAlign = "right";
    ctx.fillText(formatMoney(value), 722, y);
    ctx.textAlign = "left";
  });
  ctx.fillStyle = blue;
  ctx.fillRect(510, 922, 236, 52);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 18px Arial";
  ctx.fillText("TOTAL", 536, 954);
  ctx.textAlign = "right";
  ctx.fillText(formatMoney(invoice.totals.total), 722, 954);
  ctx.textAlign = "left";

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 14px Arial";
  ctx.fillText("Creating solutions that spark growth and build your brand.", 106, 1062);
  ctx.fillText("Follow Us", 426, 1062);

  return canvas.toDataURL("image/jpeg", 0.92);
}

function binaryFromBase64(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function buildImagePdf(dataUrl, width, height) {
  const [, base64] = dataUrl.split(",");
  const imageBytes = binaryFromBase64(base64);
  const encoder = new TextEncoder();
  const chunks = [];
  const offsets = [0];
  let length = 0;

  function add(chunk) {
    const bytes = typeof chunk === "string" ? encoder.encode(chunk) : chunk;
    chunks.push(bytes);
    length += bytes.length;
  }

  function startObject(id) {
    offsets[id] = length;
    add(`${id} 0 obj\n`);
  }

  add("%PDF-1.4\n");
  startObject(1);
  add("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  startObject(2);
  add("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
  startObject(3);
  add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
  startObject(4);
  add(`<< /Type /XObject /Subtype /Image /Width ${width * 2} /Height ${height * 2} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`);
  add(imageBytes);
  add("\nendstream\nendobj\n");
  const content = `q\n${width} 0 0 ${height} 0 0 cm\n/Im0 Do\nQ\n`;
  startObject(5);
  add(`<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);
  const xrefOffset = length;
  add("xref\n0 6\n0000000000 65535 f \n");
  for (let id = 1; id <= 5; id += 1) {
    add(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  }
  add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob(chunks, { type: "application/pdf" });
}

function LogoImage({ size = 56, round = false }) {
  return (
    <Box
      component="img"
      src={company.logo}
      alt="My Sparkin logo"
      sx={{
        width: size,
        height: size,
        borderRadius: round ? "50%" : "0.65rem",
        objectFit: "contain",
        bgcolor: "#FFFFFF",
        p: round ? 1 : 0.4,
        boxShadow: round ? "0 10px 22px rgba(14,91,231,0.14)" : "none",
      }}
    />
  );
}

function InvoiceLogo() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
      <LogoImage size={58} />
      <Box>
        <Typography sx={{ color: "#102142", fontSize: "2rem", fontWeight: 950, lineHeight: 1 }}>
          MY <Box component="span" sx={{ color: "#0E5BE7" }}>SPARKIN</Box>
        </Typography>
        <Typography sx={{ mt: 0.35, color: "#4E5B72", fontSize: "0.95rem", fontWeight: 650 }}>
          Spark Ideas. Create Impact.
        </Typography>
      </Box>
    </Box>
  );
}

function ContactLine({ icon, children }) {
  return (
    <Stack direction="row" spacing={0.8} alignItems="center">
      <Box sx={{ color: "#0E5BE7", display: "grid", placeItems: "center" }}>{icon}</Box>
      <Typography sx={{ color: "#2C3B54", fontSize: "0.84rem", lineHeight: 1.45 }}>{children}</Typography>
    </Stack>
  );
}

export function InvoiceTemplatePreview({ payment }) {
  const invoice = buildInvoiceModel(payment);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "1.4rem",
        bgcolor: "#FFFFFF",
        border: "1px solid #D9E8FF",
        boxShadow: "0 18px 40px rgba(16,29,51,0.08)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -140,
          right: -140,
          width: 420,
          height: 420,
          borderRadius: "50%",
          bgcolor: "#0E5BE7",
        }}
      />
      <Box sx={{ position: "relative", p: { xs: 2, md: 4 } }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={3}>
          <InvoiceLogo />
          <Box sx={{ textAlign: { xs: "left", md: "right" }, color: "#FFFFFF" }}>
            <Typography sx={{ color: { xs: "#0E56C8", md: "#FFFFFF" }, fontSize: "2.8rem", fontWeight: 950, lineHeight: 1 }}>
              INVOICE
            </Typography>
            <Box
              sx={{
                mt: 1.4,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.8,
                px: 1.4,
                py: 0.65,
                borderRadius: "999px",
                bgcolor: "#2E87FF",
                color: "#FFFFFF",
                fontSize: "0.95rem",
                fontWeight: 900,
              }}
            >
              <DescriptionOutlinedIcon sx={{ fontSize: "1rem" }} />
              {invoice.invoiceNumber}
            </Box>
          </Box>
        </Stack>

        <Box
          sx={{
            mt: 4,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr" },
            gap: 2.4,
          }}
        >
          <Box sx={{ p: 2.4, borderRadius: "1.1rem", border: "1px solid #E1ECFF", boxShadow: "0 14px 34px rgba(16,29,51,0.07)" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2.4} alignItems={{ xs: "flex-start", sm: "center" }}>
              <LogoImage size={94} round />
              <Stack spacing={0.65}>
                <Typography sx={{ color: "#0E56C8", fontSize: "1.25rem", fontWeight: 950 }}>{invoice.company.name}</Typography>
                <ContactLine icon={<LocationOnOutlinedIcon sx={{ fontSize: "0.9rem" }} />}>{invoice.company.address}</ContactLine>
                <ContactLine icon={<EmailOutlinedIcon sx={{ fontSize: "0.9rem" }} />}>{invoice.company.email}</ContactLine>
                <ContactLine icon={<LocalPhoneOutlinedIcon sx={{ fontSize: "0.9rem" }} />}>{invoice.company.phone}</ContactLine>
                <ContactLine icon={<LanguageOutlinedIcon sx={{ fontSize: "0.9rem" }} />}>{invoice.company.website}</ContactLine>
              </Stack>
            </Stack>
          </Box>

          <Stack spacing={1.5} sx={{ pt: { xs: 0, lg: 3 } }}>
            {[
              ["Invoice Date", invoice.invoiceDate, <CalendarMonthOutlinedIcon />],
              ["Due Date", invoice.dueDate, <CalendarMonthOutlinedIcon />],
              ["Status", invoice.status, <CheckCircleRoundedIcon />],
            ].map(([label, value, icon]) => (
              <Stack key={label} direction="row" spacing={1.2} alignItems="center">
                <Box sx={{ color: "#0E56C8", display: "grid", placeItems: "center" }}>{icon}</Box>
                <Box>
                  <Typography sx={{ color: "#4F6078", fontSize: "0.78rem", fontWeight: 650 }}>{label}</Typography>
                  <Typography sx={{ color: "#102142", fontSize: "0.9rem", fontWeight: 900 }}>{value}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: 2.8, p: 2.4, borderRadius: "1rem", border: "1px solid #D9E8FF", bgcolor: "#F8FBFF" }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.4 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: "#0E56C8", color: "#FFFFFF", display: "grid", placeItems: "center" }}>
              <PersonOutlineRoundedIcon sx={{ fontSize: "1rem" }} />
            </Box>
            <Typography sx={{ color: "#0E56C8", fontSize: "0.85rem", fontWeight: 950 }}>BILL TO</Typography>
          </Stack>
          <Typography sx={{ color: "#102142", fontSize: "1.15rem", fontWeight: 950 }}>{invoice.customer.name}</Typography>
          <Typography sx={{ mt: 0.35, color: "#25364F", fontSize: "0.86rem", fontWeight: 700 }}>{invoice.customer.company}</Typography>
          <Typography sx={{ mt: 0.35, color: "#25364F", fontSize: "0.86rem", maxWidth: 420 }}>{invoice.customer.address}</Typography>
          <Stack spacing={0.45} sx={{ mt: 1.2 }}>
            <ContactLine icon={<EmailOutlinedIcon sx={{ fontSize: "0.9rem" }} />}>{invoice.customer.email}</ContactLine>
            <ContactLine icon={<LocalPhoneOutlinedIcon sx={{ fontSize: "0.9rem" }} />}>{invoice.customer.phone}</ContactLine>
          </Stack>
        </Box>

        <Box sx={{ mt: 2.8, overflow: "hidden", borderRadius: "1rem", border: "1px solid #D9E8FF" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "0.4fr 2fr 0.7fr 1fr 1fr", gap: 1, bgcolor: "#0E56C8", color: "#FFFFFF", px: 2, py: 1.2 }}>
            {["#", "Item / Description", "Qty", "Unit Price", "Amount"].map((heading) => (
              <Typography key={heading} sx={{ fontSize: "0.76rem", fontWeight: 950, textTransform: "uppercase" }}>{heading}</Typography>
            ))}
          </Box>
          {invoice.items.map((item, index) => (
            <Box key={item.title} sx={{ display: "grid", gridTemplateColumns: "0.4fr 2fr 0.7fr 1fr 1fr", gap: 1, px: 2, py: 1.5, borderTop: index ? "1px solid #E9EEF6" : "none", alignItems: "center" }}>
              <Typography sx={{ color: "#102142", fontSize: "0.8rem", fontWeight: 900 }}>{String(index + 1).padStart(2, "0")}</Typography>
              <Box>
                <Typography sx={{ color: "#102142", fontSize: "0.86rem", fontWeight: 950 }}>{item.title}</Typography>
                <Typography sx={{ mt: 0.15, color: "#41516A", fontSize: "0.76rem" }}>{item.description}</Typography>
              </Box>
              <Typography sx={{ color: "#102142", fontSize: "0.82rem" }}>{item.quantity}</Typography>
              <Typography sx={{ color: "#102142", fontSize: "0.82rem" }}>{formatMoney(item.unitPrice)}</Typography>
              <Typography sx={{ color: "#102142", fontSize: "0.82rem", fontWeight: 800 }}>{formatMoney(item.amount)}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 2.8, display: "grid", gridTemplateColumns: { xs: "1fr", lg: "0.9fr 0.9fr 1fr" }, gap: 2 }}>
          <Box sx={{ p: 2, borderRadius: "1rem", border: "1px solid #D9E8FF", bgcolor: "#F8FBFF" }}>
            <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 1.4 }}>
              <AccountBalanceWalletOutlinedIcon sx={{ color: "#0E56C8", fontSize: "1.1rem" }} />
              <Typography sx={{ color: "#0E56C8", fontSize: "0.85rem", fontWeight: 950 }}>PAYMENT INFORMATION</Typography>
            </Stack>
            {[
              ["Bank Name", invoice.bank.bankName],
              ["Account Name", invoice.bank.accountName],
              ["Account Number", invoice.bank.accountNumber],
              ["IFSC Code", invoice.bank.ifsc],
            ].map(([label, value]) => (
              <Stack key={label} direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 0.8 }}>
                <Typography sx={{ color: "#25364F", fontSize: "0.72rem", fontWeight: 800 }}>{label}</Typography>
                <Typography sx={{ color: "#25364F", fontSize: "0.72rem" }}>{value}</Typography>
              </Stack>
            ))}
          </Box>

          <Box sx={{ p: 2 }}>
            <Typography sx={{ color: "#0E56C8", fontSize: "1.2rem", fontWeight: 950 }}>THANK YOU!</Typography>
            <Box sx={{ mt: 1, width: 34, height: 3, bgcolor: "#0E56C8", borderRadius: "999px" }} />
            <Typography sx={{ mt: 1.4, color: "#25364F", fontSize: "0.78rem", lineHeight: 1.7 }}>
              We truly appreciate your business and look forward to working with you again.
            </Typography>
          </Box>

          <Box sx={{ overflow: "hidden", borderRadius: "1rem", border: "1px solid #E1ECFF", boxShadow: "0 14px 30px rgba(16,29,51,0.07)" }}>
            <Stack spacing={1.2} sx={{ p: 2 }}>
              {[
                ["Subtotal", invoice.totals.subtotal],
                ["Discount", -invoice.totals.discount],
                ["Tax (18% GST)", invoice.totals.tax],
              ].map(([label, value]) => (
                <Stack key={label} direction="row" justifyContent="space-between">
                  <Typography sx={{ color: "#25364F", fontSize: "0.84rem" }}>{label}</Typography>
                  <Typography sx={{ color: "#102142", fontSize: "0.84rem", fontWeight: 750 }}>{formatMoney(value)}</Typography>
                </Stack>
              ))}
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ bgcolor: "#0E56C8", color: "#FFFFFF", p: 2 }}>
              <Typography sx={{ fontSize: "1rem", fontWeight: 950 }}>TOTAL</Typography>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 950 }}>{formatMoney(invoice.totals.total)}</Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function renderInvoiceHtml(invoice, options = {}) {
  const itemRows = invoice.items
    .map(
      (item, index) => `
        <tr>
          <td>${String(index + 1).padStart(2, "0")}</td>
          <td><strong>${escapeHtml(item.title)}</strong><br><span>${escapeHtml(item.description)}</span></td>
          <td>${item.quantity}</td>
          <td>${escapeHtml(formatMoney(item.unitPrice))}</td>
          <td>${escapeHtml(formatMoney(item.amount))}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(invoice.invoiceNumber)}</title>
  <style>
    *{box-sizing:border-box} body{margin:0;background:#eef5ff;font-family:Inter,Arial,sans-serif;color:#102142}
    .page{max-width:980px;margin:24px auto;background:#fff;border-radius:26px;overflow:hidden;box-shadow:0 24px 60px rgba(16,29,51,.12);position:relative}
    .page:before{content:"";position:absolute;right:-140px;top:-140px;width:420px;height:420px;border-radius:50%;background:#0e5be7}
    .inner{position:relative;padding:42px}.top{display:flex;justify-content:space-between;gap:32px}.brand{display:flex;gap:14px;align-items:center}
    .mark{width:58px;height:58px;border-radius:12px;object-fit:contain;background:#fff;padding:4px}
    h1{margin:0;color:#fff;font-size:56px;line-height:1}.brand-title{font-size:32px;font-weight:900}.blue{color:#0e5be7}.muted{color:#4e5b72}.pill{display:inline-flex;margin-top:14px;padding:9px 20px;border-radius:999px;background:#2e87ff;color:#fff;font-weight:900}
    .grid-two{display:grid;grid-template-columns:1.2fr .8fr;gap:26px;margin-top:42px}.card{border:1px solid #d9e8ff;border-radius:18px;padding:22px;background:#fff;box-shadow:0 14px 34px rgba(16,29,51,.07)}
    .company{display:flex;gap:22px;align-items:center}.company .mark{width:94px;height:94px;border-radius:50%;padding:12px;box-shadow:0 10px 22px rgba(14,91,231,.14)}.line{margin:7px 0;color:#2c3b54;font-size:14px}.meta{padding-top:26px}.meta-row{display:flex;gap:14px;margin-bottom:18px}.label{font-size:13px;color:#4f6078}.value{font-size:15px;font-weight:900}
    .bill{margin-top:28px;background:#f8fbff}.section-title{color:#0e56c8;font-weight:900}.customer-name{font-size:22px;font-weight:900;margin-top:14px}
    table{width:100%;border-collapse:collapse;margin-top:28px;border:1px solid #d9e8ff;border-radius:18px;overflow:hidden}thead{background:#0e56c8;color:#fff;text-transform:uppercase}th,td{padding:16px;text-align:left;font-size:14px;border-top:1px solid #e9eef6}th{border-top:0;font-size:13px}td span{color:#41516a}
    .bottom{display:grid;grid-template-columns:.9fr .9fr 1fr;gap:22px;margin-top:28px}.total-card{border:1px solid #e1ecff;border-radius:18px;overflow:hidden}.total-card .row{display:flex;justify-content:space-between;padding:9px 18px}.grand{display:flex;justify-content:space-between;background:#0e56c8;color:#fff;padding:20px;font-size:20px;font-weight:900}
    @media print{body{background:#fff}.page{margin:0;box-shadow:none;border-radius:0}.inner{padding:30px}}
    @media(max-width:760px){.top,.company{display:block}h1{color:#0e56c8}.grid-two,.bottom{grid-template-columns:1fr}.meta{padding-top:0}}
  </style>
</head>
<body>
  <main class="page">
    <div class="inner">
      <section class="top">
        <div class="brand"><img class="mark" src="${escapeHtml(invoice.company.logo)}" alt="My Sparkin logo"><div><div class="brand-title">MY <span class="blue">SPARKIN</span></div><div class="muted">Spark Ideas. Create Impact.</div></div></div>
        <div><h1>INVOICE</h1><div class="pill">${escapeHtml(invoice.invoiceNumber)}</div></div>
      </section>
      <section class="grid-two">
        <div class="card company"><img class="mark" src="${escapeHtml(invoice.company.logo)}" alt="My Sparkin logo"><div><h2 class="section-title">${escapeHtml(invoice.company.name)}</h2><p class="line">${escapeHtml(invoice.company.address)}</p><p class="line">${escapeHtml(invoice.company.email)}</p><p class="line">${escapeHtml(invoice.company.phone)}</p><p class="line">${escapeHtml(invoice.company.website)}</p></div></div>
        <div class="meta"><div class="meta-row"><div><div class="label">Invoice Date</div><div class="value">${escapeHtml(invoice.invoiceDate)}</div></div></div><div class="meta-row"><div><div class="label">Due Date</div><div class="value">${escapeHtml(invoice.dueDate)}</div></div></div><div class="meta-row"><div><div class="label">Status</div><div class="value">${escapeHtml(invoice.status)}</div></div></div></div>
      </section>
      <section class="card bill"><div class="section-title">BILL TO</div><div class="customer-name">${escapeHtml(invoice.customer.name)}</div><p class="line"><strong>${escapeHtml(invoice.customer.company)}</strong></p><p class="line">${escapeHtml(invoice.customer.address)}</p><p class="line">${escapeHtml(invoice.customer.email)}</p><p class="line">${escapeHtml(invoice.customer.phone)}</p></section>
      <table><thead><tr><th>#</th><th>Item / Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead><tbody>${itemRows}</tbody></table>
      <section class="bottom">
        <div class="card"><div class="section-title">PAYMENT INFORMATION</div><p class="line">Bank Name: ${escapeHtml(invoice.bank.bankName)}</p><p class="line">Account Name: ${escapeHtml(invoice.bank.accountName)}</p><p class="line">Account Number: ${escapeHtml(invoice.bank.accountNumber)}</p><p class="line">IFSC Code: ${escapeHtml(invoice.bank.ifsc)}</p></div>
        <div class="card"><h2 class="section-title">THANK YOU!</h2><p class="line">We truly appreciate your business and look forward to working with you again.</p></div>
        <div class="total-card"><div class="row"><span>Subtotal</span><strong>${escapeHtml(formatMoney(invoice.totals.subtotal))}</strong></div><div class="row"><span>Discount</span><strong>${escapeHtml(formatMoney(-invoice.totals.discount))}</strong></div><div class="row"><span>Tax (18% GST)</span><strong>${escapeHtml(formatMoney(invoice.totals.tax))}</strong></div><div class="grand"><span>TOTAL</span><span>${escapeHtml(formatMoney(invoice.totals.total))}</span></div></div>
      </section>
    </div>
  </main>
${options.autoPrint ? `<script>window.addEventListener("load",function(){setTimeout(function(){window.print();},250);});</script>` : ""}
</body>
</html>`;
}
