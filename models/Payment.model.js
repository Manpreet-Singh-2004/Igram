import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    stripePaymentIntentId: {
      type: String,
      required: true,
    },

    stripeChargeId: String,

    amount: {
      type: Number, // CAD Dollars
      required: true,
    },

    currency: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["requires_payment", "succeeded", "failed", "refunded"],
      required: true,
    },

    receiptUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);