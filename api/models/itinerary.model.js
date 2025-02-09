import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const itinerarySchema = new mongoose.Schema(
  {
    tourGuideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: true,
      },
    ],
    locations: [
      {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        }
      },
    ],
    duration: {
      type: Number, // Duration in minutes
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableDates: [
      {
        type: Date,
        required: true,
      },
    ],
    accessible: {
      type: Boolean,
      default: false,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropOffLocation: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number, // Average rating for the activity
      min: 1,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    comments:  [
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
      default: 30,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "deactivated"],
      default: "active",
    },
    title:{
      type: String,
      required:true
    },
    interestedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }]
  },
  { timestamps: true }
);

// apply pagination plug in to the schema
itinerarySchema.plugin(mongoosePaginate);
itinerarySchema.index({ location: "2dsphere" });

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;
