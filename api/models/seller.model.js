import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxLength: [50, "Name cant be more then 50 characters"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [255, "Description cant be more then 255 characters"],
    },

    accepted: {
      type: Boolean,
      default: true, // By default, the seller is not accepted until reviewed
    },
    mobile:{
      type: String,
    },
    profilePicture:{
      type: String,
    }
  },
  { timestamps: true }
);
sellerSchema.plugin(mongoosePaginate);

export default mongoose.model("Seller", sellerSchema);
