import express from "express";
import {
  tourSignUp,
  signup,
  signin,
  acceptUser,
  refreshToken
} from "../controllers/auth.controller.js";
import {
  signUpValidator,
  signInValidator
} from "../utils/validators/auth.validators.js";
import { upload } from "../middlewares/uploadFileMiddleware.js";
import { authorizeRoles, verifyToken } from '../utils/verifyUser.js';

const router = express.Router();
router.post('/signupTour',signUpValidator,tourSignUp);
router.post('/signup', signUpValidator,upload.fields([
  { name: 'credentials', maxCount: 1 },
  { name: 'nationalId', maxCount: 1 }
]), signup);
router.post("/signin", signInValidator, signin);
router.put("/accept/:userId", verifyToken, authorizeRoles(["Admin"]), acceptUser);
router.post("/refresh", refreshToken);


export default router;
