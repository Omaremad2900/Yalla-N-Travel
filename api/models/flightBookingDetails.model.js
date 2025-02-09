import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema({
  deviceType: {
    type: String,
    enum: ['MOBILE', 'LANDLINE'],
    required: true
  },
  countryCallingCode: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  documentType: {
    type: String,
    enum: ['PASSPORT', 'NATIONAL_ID'],
    required: true
  },
  birthPlace: {
    type: String,
    required: true
  },
  issuanceLocation: {
    type: String,
    required: true
  },
  issuanceDate: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  issuanceCountry: {
    type: String,
    required: true
  },
  validityCountry: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  holder: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const travelerSchema = new mongoose.Schema({
  id: {
    type: String, // Traveler ID (e.g., "1", "2", etc.)
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  name: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE'],
    required: true
  },
  contact: {
    emailAddress: {
      type: String,
      required: true
    },
    phones: [phoneSchema] // Embedded phone schema
  },
  documents: [documentSchema] // Embedded documents schema
}, { _id: false });

const bookingDetailsSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model who is a tourist
    required: true
  },
  travelers: [travelerSchema] // Array of travelers with detailed info
});

export default mongoose.model('TouristFlightBookingDetails', bookingDetailsSchema);