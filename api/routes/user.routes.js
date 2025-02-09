import express from "express";
import {
  deleteUser,
  test,
  updateUser,
  getUser,
  getAllUsers,
  acceptTerms,
  changePassword,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} from "../controllers/user.controller.js";

import { changePasswordValidator } from "../utils/validators/user.validators.js";
import { authorizeRoles, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.route("/forgotPassword").put(forgetPassword);

router.route("/verifyResetCode").put(verifyResetCode);

router.route("/resetPassword").put(resetPassword);

router.get("/test", test);
router.get("/", verifyToken, authorizeRoles(["Admin"]), getAllUsers);
router.post("/update/:id", verifyToken, authorizeRoles(["Admin"]), updateUser);
router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles(["Admin"]),
  deleteUser
);
router.get("/:id", verifyToken, getUser);

router.route("/acceptTerms").put(verifyToken, acceptTerms);

router
  .route("/changePassword")
  .put(verifyToken, changePasswordValidator, changePassword);

export default router;
