import crypto from "node:crypto";
import { RefreshTokenModel } from "./refresh-token.model.js";
import { UserModel } from "./user.model.js";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function normalizeUser(user) {
  return user?.toObject ? user.toObject() : user;
}

export const authRepository = {
  async createUser(user) {
    const created = await UserModel.create({
      ...user,
      _id: user.id,
    });

    return normalizeUser(created);
  },

  async findUserByEmail(email) {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    return normalizeUser(user);
  },

  async findUserById(id) {
    const user = await UserModel.findById(id);
    return normalizeUser(user);
  },

  async storePasswordResetToken(userId, token, expiresAt) {
    const updated = await UserModel.findByIdAndUpdate(
      userId,
      {
        passwordResetTokenHash: hashToken(token),
        passwordResetExpiresAt: expiresAt,
      },
      { new: true },
    );

    return normalizeUser(updated);
  },

  async findUserByPasswordResetToken(token) {
    const now = new Date();
    const user = await UserModel.findOne({
      passwordResetTokenHash: hashToken(token),
      passwordResetExpiresAt: { $gt: now },
    });

    return normalizeUser(user);
  },

  async clearPasswordResetToken(userId) {
    await UserModel.findByIdAndUpdate(userId, {
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
    });
  },

  async storeRefreshToken(userId, token) {
    await RefreshTokenModel.create({
      userId,
      tokenHash: hashToken(token),
    });
  },

  async findRefreshToken(token) {
    const refreshToken = await RefreshTokenModel.findOne({ tokenHash: hashToken(token) }).lean();
    return refreshToken ?? null;
  },

  async deleteRefreshToken(token) {
    await RefreshTokenModel.deleteOne({ tokenHash: hashToken(token) });
  },

  async deleteRefreshTokensForUser(userId) {
    await RefreshTokenModel.deleteMany({ userId });
  },

  async replaceUser(userId, updater) {
    const user = await UserModel.findById(userId);

    if (!user) {
      return null;
    }

    const nextUser = updater(normalizeUser(user));
    user.set({
      fullName: nextUser.fullName,
      email: nextUser.email,
      passwordHash: nextUser.passwordHash,
      role: nextUser.role,
      phoneNumber: nextUser.phoneNumber ?? null,
      avatarUrl: nextUser.avatarUrl ?? null,
      passwordResetTokenHash: nextUser.passwordResetTokenHash ?? null,
      passwordResetExpiresAt: nextUser.passwordResetExpiresAt ?? null,
    });

    const saved = await user.save();
    return normalizeUser(saved);
  },
};
