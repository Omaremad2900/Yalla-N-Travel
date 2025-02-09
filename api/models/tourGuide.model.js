import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const tourguideSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    yearsOfExperience: {
      type: Number,
      required: false,
      min: [0, "Years of Experience must be a positive number"],
    },
    previousWork: {
      type: String,
      required: false,
    },
    mobileNumber: {
      type: String,
      required: false,
      sparse: true,
    },
    ratings: {
      type: Number, 
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    comments:  [
      {
        username: { type: String, required: true },
        comment: { type: String, required: true },
      },
    ],
    
    profilePicture:{
      type: String,
    }
    
  },
  { timestamps: true }
);
tourguideSchema.plugin(mongoosePaginate);

export default mongoose.model("Tourguide", tourguideSchema);
