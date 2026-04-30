import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, index: true },
    customerEmail: { type: String, trim: true, lowercase: true, default: null },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null, index: true },
    ticketNumber: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      enum: ["maintenance", "repair", "warranty"],
      required: true,
    },
    description: { type: String, trim: true, required: true },
    preferredDate: { type: String, trim: true, default: null },
    preferredTime: { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: ["requested", "under_review", "technician_assigned", "resolved", "cancelled"],
      default: "requested",
      index: true,
    },
    activity: [
      {
        title: { type: String, required: true },
        note: { type: String, default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
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

export const ServiceRequestModel =
  mongoose.models.ServiceRequest ?? mongoose.model("ServiceRequest", serviceRequestSchema);
