import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: "Project" },
    quoteId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    customer: {
      fullName: { type: String, trim: true, required: true },
      email: { type: String, trim: true, lowercase: true, default: null },
    },
    vendorEmail: { type: String, trim: true, lowercase: true, default: null },
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    milestone: {
      key: { type: String, required: true },
      title: { type: String, required: true },
    },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
      index: true,
    },
    dueAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

export const PaymentModel = mongoose.models.Payment ?? mongoose.model("Payment", paymentSchema);
