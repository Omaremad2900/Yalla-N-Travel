import express from 'express';
import {
    searchHotelsInCity,
    getMultipleHotelOffers,
    createHotelOrder,
} from '../controllers/hotelBooking.controller.js';
import { verifyToken, authorizeRoles } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/search', verifyToken, authorizeRoles(['Tourist']), searchHotelsInCity);
router.get('/offers', verifyToken, authorizeRoles(['Tourist']), getMultipleHotelOffers);
router.post('/create-hotel-order', verifyToken, authorizeRoles(['Tourist']), createHotelOrder);
export default router;