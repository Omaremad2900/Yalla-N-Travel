import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "Tourist",
        "Advertiser",
        "Tour Guide",
        "Seller",
        "Tourism Governor",
        "Admin",
      ],
      default: "Tourist", // Default role
    },
    nationalId: {
      type: String,
      required: false,
    },
    credentials: {
      type: String, // Add the credentials field as a string
      required: false, // Set to true if it's required
    },
    date_of_birth: {
      type: Date, // Using Date type for date of birth
      required: false, // Mark as required if age-based features depend on this
      immutable: true, //Cant be changed
    },
    passwordChangedAt: {
      type: Date, // Field to store the timestamp when the password was changed
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    requestDelete: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
); // Automatically adds created_at and updated_at fields

// Instance method to check if the password was changed after token issuance
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // If the password was changed after the JWT was issued, return true
    return JWTTimestamp < changedTimestamp;
  }
  // False means password wasn't changed after token was issued
  return false;
};
// Apply pagination plugin
userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema);
export default User;
