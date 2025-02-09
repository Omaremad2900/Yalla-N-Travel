import mongoose from 'mongoose';

const { Schema } = mongoose;

const advertisementSchema = new Schema({
    advertiser_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to Advertiser (User)
        required: true,
    },
    content: {
        type: String,
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

// Export the Advertisement model
export default mongoose.model('Advertisement', advertisementSchema);