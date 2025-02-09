import express from 'express';
const router = express.Router();

import {
    searchActivities,
    getAllUpcomingActivities,
    getAllUpcomingActivitiesWithFilter,
    getAllUpcomingActivitiesWithSorting,
    getActivityById
} from  '../controllers/activity.controller.js';

import { verifyToken, authorizeRoles } from '../utils/verifyUser.js';

router.get('/activity/sort-upcoming-activities', getAllUpcomingActivitiesWithSorting);
router.get('/search/activity', verifyToken, authorizeRoles(['Tourist']), searchActivities);
router.get('/activity/upcoming-activities', getAllUpcomingActivities);
router.get('/activity/filter-upcoming-activities', getAllUpcomingActivitiesWithFilter);
router.get('/activity/:id', getActivityById);

export default router;