import express from "express";
import {
  verifyToken,
  authorizeRoles,
  checkTermsAccepted,
} from "../utils/verifyUser.js";

import {
  createSeller,
  getSeller,
  updateSeller,
  requestDeleteSeller,
  getProducts,
  getSellerRevenue,
} from "../controllers/seller.controller.js";

import {
  createSellerValidator,
  getSellerValidator,
  updateSellerValidator,
} from "../utils/validators/seller.validators.js";

const router = express.Router();

router
  .route("/createseller")
  .post(verifyToken, authorizeRoles(["Seller"]), createSeller);
router
  .route("/updateSeller")
  .put(verifyToken, authorizeRoles(["Seller"]), updateSeller);

router
  .route("/getProducts")
  .get(verifyToken, authorizeRoles(["Seller"]), getProducts);

router
  .route("/getSeller")
  .get(verifyToken, authorizeRoles(["Seller"]), getSeller);

router
  .route("/requestDeleteSeller")
  .put(verifyToken, authorizeRoles(["Seller"]), requestDeleteSeller);

router
  .route("/getSellerRevenue")
  .get(verifyToken, authorizeRoles(["Seller"]), getSellerRevenue);

export default router;
