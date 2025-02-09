import express from "express";
import { createPreferenceTag, getAllPreferenceTags, updatePreferenceTag, deletePreferenceTag } from "../controllers/preferenceTag.controller.js";
import { createPreferenceTagValidator, updatePreferenceTagValidator } from '../utils/validators/preferenceTag.validators.js';
import { verifyToken, authorizeRoles } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles(['Admin']), createPreferenceTagValidator, createPreferenceTag);
router.get("/", getAllPreferenceTags);
router.put("/:id", verifyToken, authorizeRoles(['Admin']), updatePreferenceTagValidator, updatePreferenceTag);
router.delete("/:id", verifyToken, authorizeRoles(['Admin']), deletePreferenceTag);

export default router;