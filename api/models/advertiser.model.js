import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";    // importing pagination package to do pagination

const advertiserSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    website: {
      type: String,
      required: true, // Website is required
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
        "Please enter a valid website URL",
      ], // URL validation
    },
    hotline: {
      type: String,
      required: true, // Hotline is required
      match: [
        /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
        "Please enter a valid hotline number",
      ], // Basic phone number validation
    },
    company_profile: {
      type: String,
      required: true, // Company profile description is required
      maxlength: [500, "Company profile can't be longer than 500 characters"], // Limit the length of the company profile
    },
    mobile: {
      type: String,
    }
    ,
    profilePicture:{
      type: String,
    }
  },
  
  { timestamps: true } // Automatically adds created_at and updated_at fields
);

// apply pagination plug in to the schema
advertiserSchema.plugin(mongoosePaginate);

const Advertiser = mongoose.model("Advertiser", advertiserSchema);

export default Advertiser;