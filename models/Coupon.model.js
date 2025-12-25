const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },

    minCartValue: {
      type: Number,
      default: 0,
    },

    maxDiscount: {
      type: Number,
    },

    expiresAt: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    usageLimit: {
      type: Number, // total global uses
    },

    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon ||
  mongoose.model("Coupon", CouponSchema);
