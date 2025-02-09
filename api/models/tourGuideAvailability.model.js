import mongoose from 'mongoose';

const { Schema } = mongoose;

const tourGuideAvailabilitySchema = new Schema({
    tour_guide_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to Tour Guide (User)
        required: true,
    },
    available_dates: {
        type: [Date],  // Array of available dates
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Export the TourGuideAvailability model
export default mongoose.model('TourGuideAvailability', tourGuideAvailabilitySchema);