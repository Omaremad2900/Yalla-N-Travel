// routes/flight.routes.js
import express from 'express';
import {
  searchFlights,
  saveBookingDetails,
  confirmFlightPrice,
  bookFlight,
  checkIfTouristFlightBookingDetailsSaved
} from '../controllers/flightBooking.controller.js';
import { verifyToken, authorizeRoles } from '../utils/verifyUser.js';

const router = express.Router();

// Route to search for flights
router.get('/search',verifyToken, authorizeRoles(['Tourist']), searchFlights);

// Route to save tourist booking details
router.post('/save-tourist-booking-details',verifyToken, authorizeRoles(['Tourist']), saveBookingDetails);

// Route to confirm flight price
router.post('/confirm-price',verifyToken, authorizeRoles(['Tourist']), confirmFlightPrice);

// Route to book the flight
router.post('/book',verifyToken, authorizeRoles(['Tourist']), bookFlight);

// Route to check if booking details are saved
router.get('/check-booking-details-saved', verifyToken, authorizeRoles(['Tourist']), checkIfTouristFlightBookingDetailsSaved);

export default router;