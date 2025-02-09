import express from "express";
import { readProfile } from "../controllers/tourismGovernor.controller.js";
import { authorizeRoles, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router
  .route("/readProfile")
  .get(verifyToken, authorizeRoles(["Tourism Governor"]), readProfile);

export default router;
