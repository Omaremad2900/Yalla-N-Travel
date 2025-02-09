import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookingSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to Tourist (User)
        required: true,
    },
    trip_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',  // Reference to Trip
        required: true,
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Pending', 'Cancelled'],
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

// Export the Booking model
export default mongoose.model('Booking', bookingSchema);