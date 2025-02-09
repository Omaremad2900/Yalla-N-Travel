import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  entityType: {
    type: String,
    enum: ['Product', 'Trip', 'Booking'], // Type of entity being reviewed
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Product , Trip Or Booking model
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User (Tourist/Admin/Seller)
    ref: 'Tourist',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
  }
  
}, {timestamps : true});

export default mongoose.model('Review', reviewSchema);
