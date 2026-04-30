import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import { AppError } from "../../common/errors/app-error.js";
import { authRepository } from "../auth/auth.repository.js";

const allowedAvatarTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const maxAvatarBytes = 2 * 1024 * 1024;

function toPublicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phoneNumber: user.phoneNumber ?? null,
    avatarUrl: user.avatarUrl ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function decodeAvatarData(input) {
  const contentType = input.contentType?.toLowerCase();
  const extension = allowedAvatarTypes.get(contentType);

  if (!extension) {
    throw new AppError(400, "Only JPG, PNG, or WEBP profile photos are supported");
  }

  const base64 = input.data.includes(",") ? input.data.split(",").at(-1) : input.data;
  const buffer = Buffer.from(base64, "base64");

  if (!buffer.length || buffer.length > maxAvatarBytes) {
    throw new AppError(400, "Profile photo must be smaller than 2MB");
  }

  return { buffer, extension };
}

export const usersService = {
  async getProfile(userId) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return toPublicUser(user);
  },

  async updateProfile(userId, input) {
    const updated = await authRepository.replaceUser(userId, (user) => ({
      ...user,
      ...(input.fullName ? { fullName: input.fullName } : {}),
      ...(Object.prototype.hasOwnProperty.call(input, "phoneNumber")
        ? { phoneNumber: input.phoneNumber }
        : {}),
      updatedAt: new Date().toISOString(),
    }));

    if (!updated) {
      throw new AppError(404, "User not found");
    }

    return toPublicUser(updated);
  },

  async updateAvatar(userId, input) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const { buffer, extension } = decodeAvatarData(input);
    const uploadDir = path.resolve("uploads", "avatars");
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${userId}-${Date.now()}.${extension}`;
    const absolutePath = path.join(uploadDir, fileName);
    await fs.writeFile(absolutePath, buffer);

    if (user.avatarUrl?.startsWith("/uploads/avatars/")) {
      const previousPath = path.resolve(user.avatarUrl.slice(1));
      fs.unlink(previousPath).catch(() => {});
    }

    const avatarUrl = `/uploads/avatars/${fileName}`;
    const updated = await authRepository.replaceUser(userId, (currentUser) => ({
      ...currentUser,
      avatarUrl,
      updatedAt: new Date().toISOString(),
    }));

    return toPublicUser(updated);
  },

  async changePassword(userId, input) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const matches = await bcrypt.compare(input.currentPassword, user.passwordHash);

    if (!matches) {
      throw new AppError(401, "Current password is incorrect");
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 12);

    await authRepository.replaceUser(userId, (currentUser) => ({
      ...currentUser,
      passwordHash,
      updatedAt: new Date().toISOString(),
    }));
  },
};
