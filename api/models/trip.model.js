import mongoose from 'mongoose';

const { Schema } = mongoose;

const tripSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    advertiser_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
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

// Export the Trip model
export default mongoose.model('Trip', tripSchema);