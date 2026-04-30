import fs from "node:fs/promises";
import path from "node:path";
import { AppError } from "../../common/errors/app-error.js";
import { vendorsRepository } from "./vendors.repository.js";

const allowedDocumentTypes = new Map([
  ["application/pdf", "pdf"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const maxDocumentBytes = 5 * 1024 * 1024;

function assertVendor(user) {
  if (user.role !== "vendor" && user.role !== "admin") {
    throw new AppError(403, "Only vendors can manage vendor profiles");
  }
}

function buildDefaultProfile(user) {
  return {
    vendorId: user.userId,
    account: {
      fullName: user.email?.split("@")[0] || "Vendor",
      email: user.email,
      phoneNumber: null,
    },
    company: {},
    services: {
      installation: true,
      maintenance: false,
      siteSurvey: true,
      consultation: false,
    },
    verificationStatus: "draft",
  };
}

function flattenPatch(input) {
  const patch = {};

  for (const [groupKey, groupValue] of Object.entries(input)) {
    if (!groupValue || typeof groupValue !== "object") continue;

    for (const [fieldKey, fieldValue] of Object.entries(groupValue)) {
      patch[`${groupKey}.${fieldKey}`] = fieldValue;
    }
  }

  return patch;
}

function decodeDocument(input) {
  const extension = allowedDocumentTypes.get(input.mimeType);

  if (!extension) {
    throw new AppError(400, "Only PDF, JPG, PNG, or WEBP documents are supported");
  }

  const base64 = input.data.includes(",") ? input.data.split(",").at(-1) : input.data;
  const buffer = Buffer.from(base64, "base64");

  if (!buffer.length || buffer.length > maxDocumentBytes) {
    throw new AppError(400, "Document must be smaller than 5MB");
  }

  return { buffer, extension };
}

async function ensureProfile(user) {
  const existing = await vendorsRepository.findByVendorId(user.userId);

  if (existing) {
    return existing;
  }

  return vendorsRepository.create(buildDefaultProfile(user));
}

export const vendorsService = {
  async getMyProfile(user) {
    assertVendor(user);
    return ensureProfile(user);
  },

  async updateMyProfile(user, input) {
    assertVendor(user);
    await ensureProfile(user);

    const patch = flattenPatch(input);
    if (!Object.keys(patch).length) {
      throw new AppError(400, "At least one vendor profile field must be provided");
    }

    return vendorsRepository.updateByVendorId(user.userId, patch);
  },

  async uploadDocument(user, input) {
    assertVendor(user);
    await ensureProfile(user);

    const { buffer, extension } = decodeDocument(input);
    const uploadDir = path.resolve("uploads", "vendor-documents");
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${user.userId}-${Date.now()}.${extension}`;
    await fs.writeFile(path.join(uploadDir, fileName), buffer);

    return vendorsRepository.addDocument(user.userId, {
      type: input.type,
      title: input.title,
      fileName: input.fileName,
      mimeType: input.mimeType,
      size: buffer.length,
      url: `/uploads/vendor-documents/${fileName}`,
      uploadedAt: new Date(),
    });
  },

  async deleteDocument(user, documentId) {
    assertVendor(user);
    const profile = await ensureProfile(user);
    const document = profile.documents.find((item) => item.id === documentId);

    if (!document) {
      throw new AppError(404, "Document not found");
    }

    const updated = await vendorsRepository.removeDocument(user.userId, documentId);

    if (document.url?.startsWith("/uploads/vendor-documents/")) {
      fs.unlink(path.resolve(document.url.slice(1))).catch(() => {});
    }

    return updated;
  },

  async submitApplication(user) {
    assertVendor(user);
    await ensureProfile(user);

    return vendorsRepository.updateByVendorId(user.userId, {
      verificationStatus: "submitted",
      onboardingSubmittedAt: new Date(),
    });
  },
};
