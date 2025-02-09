import mongoose from 'mongoose';
import culturalSiteCategories from "../constants/culturalSiteCategories"; // Import the categories

const CulturalSiteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: [1000, "Description can't be longer than 1000 characters"],
    },
    pictures: {
        type: [String], // Array of URLs for pictures
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // Geospatial data type
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    openingHours: {
        type: String, // e.g., "9 AM - 5 PM"
        required: true,
    },
    ticketPrices: {
        native: {
            type: Number,
            required: true,
        },
        foreigner: {
            type: Number,
            required: true,
        },
    },
    category: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Create a 2dsphere index for geospatial queries
CulturalSiteSchema.index({ location: '2dsphere' });

const CulturalSite = mongoose.model('CulturalSite', CulturalSiteSchema);
export default CulturalSite;