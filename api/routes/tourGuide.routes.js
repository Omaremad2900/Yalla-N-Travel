import express from "express";
import {
  authorizeRoles,
  verifyToken,
  CheckProfile,
  checkTermsAccepted,
} from "../utils/verifyUser.js";

import {
  createTourGuide,
  getTourGuides,
  getTourGuide,
  updateTourGuide,
  deleteTourGuide,
  getMyItineraries,
  createItinerary,
  toggleItineraryStatus,
  requestTourGuideDelete,
  getItinerariesForTourGuide,
  getTourGuideByIdForRating,
  getTouristReport,
  getTourGuideRevenue,
} from "../controllers/tourGuide.controller.js";

import {
  createTourGuideValidator,
  updateTourGuideValidator,
  deleteTourGuideValidator,
} from "../utils/validators/tourGuide.validators.js";

import { signup, signin } from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/createTourGuide")
  .post(verifyToken, createTourGuideValidator, createTourGuide);
router.route("/getTourGuides").get(getTourGuides);

router.route("/getTourGuide").get(verifyToken, getTourGuide);

router
  .route("/updateTourGuide")
  .put(
    verifyToken,
    updateTourGuideValidator,
    authorizeRoles(["Tour Guide"]),
    updateTourGuide
  );
router
  .route("/deleteTourGuide/:id")
  .delete(
    verifyToken,
    authorizeRoles(["Tour Guide"]),
    deleteTourGuideValidator,
    deleteTourGuide
  );

router
  .route("/toggleStatus")
  .put(verifyToken, authorizeRoles(["Tour Guide"]), toggleItineraryStatus);

router
  .route("/requestDeleteTourGuide")
  .put(verifyToken, authorizeRoles(["Tour Guide"]), requestTourGuideDelete);

router
  .route("/GetActiveItineraries")
  .get(verifyToken, authorizeRoles(["Tour Guide"]), getItinerariesForTourGuide);

router
  .route("/getTourguideForRating/:id")
  .get(verifyToken, authorizeRoles(["Tourist"]), getTourGuideByIdForRating);

router
  .route("/getTouristReport")
  .get(verifyToken, authorizeRoles(["Tour Guide"]), getTouristReport);

router
  .route("/getRevenue")
  .get(verifyToken, authorizeRoles(["Tour Guide"]), getTourGuideRevenue);

export default router;
