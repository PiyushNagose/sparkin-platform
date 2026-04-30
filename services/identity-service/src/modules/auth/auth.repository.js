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
    });

    const saved = await user.save();
    return normalizeUser(saved);
  },
};
