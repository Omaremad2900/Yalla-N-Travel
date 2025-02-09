import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ActivitySchema = new mongoose.Schema(
  {
    advertiser_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertiser",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActivityCategory",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PreferenceTag", // Reference to the Tag model
      },
    ],
    specialDiscounts: {
      type: String,
    },
    isBookingOpen: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Number, // Average rating for the activity
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        username: { type: String, required: true },
        comment: { type: String, required: true },
      },
    ],
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
    availableTickets: {
      type: Number,
      Default: 30,
    },
    pictures: {
      type: [String],
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    interestedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }]
  },
  { timestamps: true }
);

// apply pagination plug in to the schema
ActivitySchema.plugin(mongoosePaginate);

// Create a geospatial index for location
ActivitySchema.index({ location: "2dsphere" });

const Activity = mongoose.model("Activity", ActivitySchema);
export default Activity;
