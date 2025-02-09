//tourist.model
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const touristSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    nationality: {
      type: String,
      required: [true, "Nationality is required"],
    },
    occupationStatus: {
      type: String,
      enum: ["job", "student"],
      required: [true, "Occupation Status is required"],
    },
    mobileNumber: {
      type: String,
    },
    wallet: {
      type: Number,
      min: 0,
      default: 0, // Initialize with 0
    },
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
    // New fields to track booking info
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookedFlight", // Reference to booked flights
      },
    ],
    level: {
      type: Number,
      default: 1,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    preferences: {
      type: [String],
      default: [],
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address", // Reference to booked flights
      },
    ],
    savedActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    savedItineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
  },
  { timestamps: true }
);
touristSchema.plugin(mongoosePaginate);

export default mongoose.model("Tourist", touristSchema);
