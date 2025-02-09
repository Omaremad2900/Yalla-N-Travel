//transportation model
import mongoose from "mongoose";

const transportationSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        required: [true, "Transportation name is required"],
        },
        type: {
        type: String,
        enum: ["bus", "train", "flight", "ferry"],
        required: [true, "Transportation type is required"],
        },
        from: {
        type: String,
        required: [true, "Departure location is required"],
        },
        to: {
        type: String,
        required: [true, "Arrival location is required"],
        },
        price: {
        type: Number,
        required: [true, "Price is required"],
        },
        departureTime: {
        type: Date,
        required: [true, "Departure time is required"],
        },
        arrivalTime: {
        type: Date,
        required: [true, "Arrival time is required"],
        },
        availableSeats: {
        type: Number,
        required: [true, "Available seats is required"],
        },
        advertiser:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Advertiser is required"],
        }
    },
    { timestamps: true }
    );
    const Transportation = mongoose.model("Transportation", transportationSchema);

export default Transportation;