import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number, // cents
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    subtotal: {
      type: Number, // cents
      required: true,
    },

    tax: {
      type: Number, // cents
      default: 0,
    },

    total: {
      type: Number, // cents
      required: true,
    },

    currency: {
      type: String,
      default: "CAD",
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded"],
      default: "pending",
    },

    locked: {
      type: Boolean,
      default: false,
    },

    paymentAttempts: {
      type: Number,
      default: 0,
    },

    stripeSessionId: String,
    stripePaymentIntentId: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
