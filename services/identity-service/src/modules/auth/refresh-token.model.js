import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      ref: "User",
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const RefreshTokenModel =
  mongoose.models.RefreshToken ?? mongoose.model("RefreshToken", refreshTokenSchema);
