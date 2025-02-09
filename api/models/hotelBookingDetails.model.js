import mongoose from "mongoose";

// Define a schema for guests
const guestSchema = new mongoose.Schema({
  tid: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
}, { _id: false });

// Define a schema for room associations
const roomAssociationSchema = new mongoose.Schema({
  guestReferences: [{
    guestReference: {
      type: String,
      required: true
    }
  }],
  hotelOfferId: {
    type: String,
    required: true
  }
}, { _id: false });

// Define a schema for payment card information
const paymentCardInfoSchema = new mongoose.Schema({
  vendorCode: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  holderName: {
    type: String,
    required: true
  }
}, { _id: false });

// Define a schema for payment details
const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL'], // Add other payment methods as needed
    required: true
  },
  paymentCard: {
    paymentCardInfo: paymentCardInfoSchema
  }
}, { _id: false });

// Define a schema for the hotel order
const hotelOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  guests: [guestSchema],
  travelAgent: {
    contact: {
      email: {
        type: String,
        required: true
      }
    }
  },
  roomAssociations: [roomAssociationSchema],
  payment: paymentSchema
});

// Export the Hotel Order model
export default mongoose.model('HotelOrder', hotelOrderSchema);