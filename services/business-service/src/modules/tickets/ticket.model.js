import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["customer", "admin", "internal"],
      required: true,
    },
    sender: { type: String, required: true },
    senderId: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    isInternal: { type: Boolean, default: false },
    attachments: [
      {
        name: { type: String, trim: true },
        url: { type: String, trim: true },
        size: { type: String, trim: true },
        mimeType: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true, _id: true },
);

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    issueType: { type: String, trim: true, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      index: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed", "cancelled"],
      default: "open",
      index: true,
    },
    // Who raised the ticket
    customerId: { type: String, required: true, index: true },
    customerName: { type: String, trim: true, required: true },
    customerEmail: { type: String, trim: true, lowercase: true, default: null },
    customerType: { type: String, trim: true, default: "Residential User" },
    customerPlan: { type: String, trim: true, default: "Standard Plan" },
    customerLocation: { type: String, trim: true, default: null },
    // Assignment
    assignedAgentId: { type: String, default: null, index: true },
    assignedAgentName: { type: String, trim: true, default: null },
    // SLA
    resolutionTargetHours: { type: Number, default: 48 },
    resolvedAt: { type: Date, default: null },
    // Metadata
    category: { type: String, trim: true, default: "General" },
    categoryNote: { type: String, trim: true, default: null },
    satisfactionPotential: {
      type: String,
      trim: true,
      default: "Medium Impact",
    },
    satisfactionNote: { type: String, trim: true, default: null },
    // Attachments on the ticket itself
    attachments: [
      {
        name: { type: String, trim: true },
        url: { type: String, trim: true },
        size: { type: String, trim: true },
        mimeType: { type: String, trim: true },
      },
    ],
    // Communication thread
    messages: [messageSchema],
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

export const TicketModel =
  mongoose.models.Ticket ?? mongoose.model("Ticket", ticketSchema);
