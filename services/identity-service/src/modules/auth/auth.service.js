import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { AppError } from "../../common/errors/app-error.js";
import { authRepository } from "./auth.repository.js";
import { tokenService } from "./token.service.js";

function toPublicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phoneNumber: user.phoneNumber ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function buildSession(user) {
  const payload = {
    sub: user.id,
    role: user.role,
    email: user.email,
  };

  return {
    accessToken: tokenService.createAccessToken(payload),
    refreshToken: tokenService.createRefreshToken(payload),
  };
}

export const authService = {
  async register(input) {
    const existingUser = await authRepository.findUserByEmail(input.email);

    if (existingUser) {
      throw new AppError(409, "An account already exists with this email");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const timestamp = new Date().toISOString();

    const user = await authRepository.createUser({
      id: crypto.randomUUID(),
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      passwordHash,
      role: input.role,
      phoneNumber: input.phoneNumber ?? null,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const session = buildSession(user);
    await authRepository.storeRefreshToken(user.id, session.refreshToken);

    return {
      user: toPublicUser(user),
      tokens: session,
    };
  },

  async login(input) {
    const user = await authRepository.findUserByEmail(input.email.toLowerCase());

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const matches = await bcrypt.compare(input.password, user.passwordHash);

    if (!matches) {
      throw new AppError(401, "Invalid email or password");
    }

    const session = buildSession(user);
    await authRepository.storeRefreshToken(user.id, session.refreshToken);

    return {
      user: toPublicUser(user),
      tokens: session,
    };
  },

  async refresh(refreshToken) {
    const persisted = await authRepository.findRefreshToken(refreshToken);

    if (!persisted) {
      throw new AppError(401, "Refresh token is invalid or expired");
    }

    let payload;

    try {
      payload = tokenService.verifyRefreshToken(refreshToken);
    } catch {
      await authRepository.deleteRefreshToken(refreshToken);
      throw new AppError(401, "Refresh token is invalid or expired");
    }

    const user = await authRepository.findUserById(payload.sub);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    await authRepository.deleteRefreshToken(refreshToken);

    const session = buildSession(user);
    await authRepository.storeRefreshToken(user.id, session.refreshToken);

    return {
      user: toPublicUser(user),
      tokens: session,
    };
  },

  async logout(refreshToken) {
    await authRepository.deleteRefreshToken(refreshToken);
    return { success: true };
  },

  async getCurrentUser(userId) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return toPublicUser(user);
  },
};
