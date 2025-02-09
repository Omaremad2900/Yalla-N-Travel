import express from "express";
import {
  getMyActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityById,
  createAdvertiserProfile,
  updateAdvertiserProfile,
  getAllAdvertiserProfiles,
  getAdvertiserById,
  getActivitiesForUser,
  requestDeleteAdvertiser,
  getReport,
  getAdvReport,
} from "../controllers/advertiser.controller.js";
import {
  createTransportationController,
  getTransportationController,
} from "../controllers/transportation.controller.js";

import {
  createAdvertiserValidator,
  validateAdvertiserId,
  updateAdvertiserValidator,
} from "../utils/validators/advertisor.validators.js";
import { createTransportationValidator } from "../utils/validators/transportation.validators.js";
import {
  verifyToken,
  authorizeRoles,
  checkTermsAccepted,
} from "../utils/verifyUser.js";

import {
  createActivityValidator,
  updateActivityValidator,
} from "../utils/validators/activity.validators.js";

const router = express.Router();

router
  .route("/requestDeleteAdvertiser")
  .put(verifyToken, authorizeRoles(["Advertiser"]), requestDeleteAdvertiser);

router.get(
  "/my-activities",
  verifyToken,
  authorizeRoles(["Advertiser"]),
  getMyActivities
);
router.post(
  "/create-activity",
  verifyToken,
  authorizeRoles(["Advertiser"]),
  createActivityValidator,
  createActivity
);
router.patch(
  "/:id",
  verifyToken,
  authorizeRoles(["Advertiser"]),
  updateActivityValidator,
  updateActivity
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(["Advertiser"]),
  deleteActivity
);
router.post(
  "/",
  verifyToken,
  createAdvertiserValidator,
  createAdvertiserProfile
);

router.get("/", getAllAdvertiserProfiles);
router.get(
  "/getAllTransportation",
  verifyToken,
  authorizeRoles(["Advertiser", "Tourist"]),
  getTransportationController
);
router.get(
  "/read/:id",
  verifyToken,
  authorizeRoles(["Advertiser"]),
  validateAdvertiserId,
  getAdvertiserById
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(["Advertiser"]),
  updateAdvertiserValidator,
  updateAdvertiserProfile
);

router
  .route("/getActivitiesAdvertisor")
  .get(verifyToken, authorizeRoles(["Advertiser"]), getActivitiesForUser);
router.post(
  "/createTransportation",
  verifyToken,
  authorizeRoles(["Advertiser"]),
  createTransportationController
);

router
  .route("/getReport")
  .get(verifyToken, authorizeRoles(["Advertiser"]), getReport);

router
  .route("/getAdvReport")
  .get(verifyToken, authorizeRoles(["Advertiser"]), getAdvReport);

router.get("/:id", verifyToken, getActivityById);

export default router;
