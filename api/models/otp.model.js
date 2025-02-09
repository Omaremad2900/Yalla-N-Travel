import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
});

otpSchema.plugin(mongoosePaginate);

export default mongoose.model("Otp", otpSchema);
