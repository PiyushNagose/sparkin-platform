import { AppError } from "../../common/errors/app-error.js";
import { authRepository } from "../auth/auth.repository.js";

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
};
