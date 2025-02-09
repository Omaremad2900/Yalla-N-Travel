import express from 'express';
import { verifyToken, authorizeRoles } from '../utils/verifyUser.js';
import {
  createHistoricalPlaceController,
  getHistoricalPlaceController,
  updateHistoricalPlaceController,
  deleteHistoricalPlaceController,
  getAllHistoricalPlacesController,
  searchHistoricalPlaces,
  getAllUpcomingHistoricalPlaces,
  filterHistoricalPlacesByTag
} from '../controllers/historicalPlace.controller.js';
import { createHistoricalPlaceValidator, updateHistoricalPlaceValidator } from '../utils/validators/historicalPlace.validators.js';

const router = express.Router();
router.get('/historical-places/filter-by-tag', filterHistoricalPlacesByTag);
router.get('/historical-places/getAllUpcoming', getAllUpcomingHistoricalPlaces);
router.post('/historical-places', verifyToken, authorizeRoles(['Tourism Governor']), createHistoricalPlaceValidator, createHistoricalPlaceController);
router.get('/historical-places/:id', getHistoricalPlaceController);
router.patch('/historical-places/:id', verifyToken, authorizeRoles(['Tourism Governor']), updateHistoricalPlaceValidator, updateHistoricalPlaceController);
router.delete('/historical-places/:id', verifyToken, authorizeRoles(['Tourism Governor']), deleteHistoricalPlaceController);
router.get('/historical-places', verifyToken, authorizeRoles(['Tourism Governor']), getAllHistoricalPlacesController);
router.get('/search/historical-places', verifyToken, authorizeRoles(['Tourist']), searchHistoricalPlaces);

export default router;