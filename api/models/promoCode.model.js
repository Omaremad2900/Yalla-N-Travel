import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
  expirationDate: {
    type: Date,
    default: null,
  },
  discountMultiplier: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
});

export default mongoose.model("PromoCode", promoCodeSchema);