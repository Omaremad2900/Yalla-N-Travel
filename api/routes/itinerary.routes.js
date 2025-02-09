import express from 'express';
import {
  createItineraryController,
  getItineraryController,
  updateItineraryController,
  deleteItineraryController,
  getAllItinerariesByGuideController,
  searchItineraries,
  getUpcomingItineraries,
  getAllUpcomingItinerariesWithSorting,
  getFilteredUpcomingItineraries
} from '../controllers/itinerary.controller.js';
import { verifyToken, authorizeRoles } from '../utils/verifyUser.js';
import {
  createItineraryValidator,
  updateItineraryValidator
} from '../utils/validators/itinerary.validators.js';

const router = express.Router();

// Routes to CRUD an itinerary

router.get('/itineraries/filter-upcoming-itineraries', getFilteredUpcomingItineraries); // Move this route up
router.get('/itineraries/sort-upcoming-itineraries', getAllUpcomingItinerariesWithSorting); // Move this route up
router.get('/itineraries/getAllUpcoming', getUpcomingItineraries); // Move this route up
router.post('/itineraries', verifyToken, authorizeRoles(['Tour Guide']), createItineraryValidator, createItineraryController);
router.get('/itineraries/:id', getItineraryController);
router.patch('/itineraries/:id', verifyToken, authorizeRoles(['Tour Guide']), updateItineraryValidator, updateItineraryController);
router.delete('/itineraries/:id', verifyToken, authorizeRoles(['Tour Guide']), deleteItineraryController);
router.get('/itineraries', verifyToken, authorizeRoles(['Tour Guide']), getAllItinerariesByGuideController);
router.get('/search/itineraries', verifyToken, authorizeRoles(['Tourist']), searchItineraries);

export default router;