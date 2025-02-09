import express from 'express';
import { createTagController, findOrCreateTagController, getAllTagsController } from '../controllers/tag.controller.js';
import { verifyToken, authorizeRoles } from '../utils/verifyUser.js';
import { createTagValidator } from '../utils/validators/tag.validators.js';

const router = express.Router();

// Route for creating a tag
router.get('/', getAllTagsController);
router.post('/', verifyToken, authorizeRoles(['Tourism Governor']), createTagValidator, createTagController);
// Route for finding tag and if not found, creating it
router.post('/find-or-create', verifyToken, authorizeRoles(['Tourism Governor']), findOrCreateTagController);

export default router;