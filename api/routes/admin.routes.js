import express from "express";
import { addAdmin } from "../controllers/admin.controller.js";
import { addAdminValidator } from "../utils/validators/admin.validators.js";
import { addTourismGovernor } from "../controllers/admin.controller.js";
import {
  flagInappItinerary,
  viewReqUsersForDeletion,
} from "../controllers/admin.controller.js";
import { addTourismGovernorValidator } from "../utils/validators/admin.validators.js";
import { verifyToken, authorizeRoles } from "../utils/verifyUser.js";
import { deleteAccountController } from "../controllers/admin.controller.js";
import { deleteAccountValidator } from "../utils/validators/admin.validators.js";
import { viewUploadedUserDocuments } from "../controllers/admin.controller.js";
import {
  listComplaints,
  getComplaintDetails,
  updateComplaintStatus,
  replyToComplaint,
  flagInappActivity,
  getUserStats,
} from "../controllers/admin.controller.js";
import { readProfile } from "../controllers/admin.controller.js";
import {
  createPromoCode,
  updateExpirationDate,
  deactivatePromoCode,
  listPromoCodes,
  getPromoCodeById,
  getTotalRevenue,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Route for adding an admin
router.post(
  "/add-admin",
  verifyToken,
  authorizeRoles(["Admin"]),
  addAdminValidator,
  addAdmin
);

router
  .route("/readProfile")
  .get(verifyToken, authorizeRoles(["Admin"]), readProfile);
// Route to add a Tourism Governor given an adminId, username, password, email, and adminPassword.
router.post(
  "/addTourismGovernor",
  verifyToken,
  authorizeRoles(["Admin"]),
  addTourismGovernorValidator,
  addTourismGovernor
);
// Route to delete any user account given an ID
router.delete(
  "/delete-account",
  verifyToken,
  authorizeRoles(["Admin"]),
  deleteAccountValidator,
  deleteAccountController
);

router
  .route("/flagItinerary")
  .patch(verifyToken, authorizeRoles(["Admin"]), flagInappItinerary);

router
  .route("/flagActivity")
  .patch(verifyToken, authorizeRoles(["Admin"]), flagInappActivity);

router
  .route("/viewUploadedUserDocuments/:userId")
  .get(verifyToken, authorizeRoles(["Admin"]), viewUploadedUserDocuments);

router
  .route("/viewUsersRequestingDeletion")
  .get(verifyToken, authorizeRoles(["Admin"]), viewReqUsersForDeletion);

router.get(
  "/complaints",
  verifyToken,
  authorizeRoles(["Admin"]),
  listComplaints
);
router.get(
  "/complaints/:complaintId",
  verifyToken,
  authorizeRoles(["Admin"]),
  getComplaintDetails
);
router.patch(
  "/complaints/:complaintId/status",
  verifyToken,
  authorizeRoles(["Admin"]),
  updateComplaintStatus
);
router.post(
  "/complaints/:complaintId/reply",
  verifyToken,
  authorizeRoles(["Admin"]),
  replyToComplaint
);
router
  .route("/flagActivity")
  .patch(verifyToken, authorizeRoles(["Admin"]), flagInappActivity);

router
  .route("/getUsersStats")
  .get(verifyToken, authorizeRoles(["Admin"]), getUserStats);

router.post(
  "/promoCode/create",
  verifyToken,
  authorizeRoles(["Admin"]),
  createPromoCode
);

router.get(
  "/promoCode/:promoCodeId",
  verifyToken,
  authorizeRoles(["Admin"]),
  getPromoCodeById
);

router.patch(
  "/promoCode/update-expiration/:promoCodeId/",
  verifyToken,
  authorizeRoles(["Admin"]),
  updateExpirationDate
);

router.patch(
  "/promoCode/deactivate/:promoCodeId",
  verifyToken,
  authorizeRoles(["Admin"]),
  deactivatePromoCode
);

router.get("/list", verifyToken, authorizeRoles(["Admin"]), listPromoCodes);

router
  .route("/revenue")
  .get(verifyToken, authorizeRoles(["Admin"]), getTotalRevenue);

export default router;
