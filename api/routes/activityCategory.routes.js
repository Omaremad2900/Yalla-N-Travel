import express from 'express';
import {
  createActivityCategoryController,
  getActivityCategoryController,
  getAllActivityCategoriesController,
  updateActivityCategoryController,
  deleteActivityCategoryController,
} from '../controllers/activityCategory.controller.js';
import { verifyToken, authorizeRoles } from '../utils/verifyUser.js';
import {
  createActivityCategoryValidator,
  updateActivityCategoryValidator,
} from '../utils/validators/activityCategory.validators.js';
import Advertiser from '../models/advertiser.model.js';

const router = express.Router();


router.post('/', verifyToken, authorizeRoles(['Admin']), createActivityCategoryValidator, createActivityCategoryController);
router.get('/:id', verifyToken, authorizeRoles(['Admin']), getActivityCategoryController);
router.get('/', verifyToken, authorizeRoles(['Admin','Advertiser','Tourist']), getAllActivityCategoriesController);
router.put('/:id', verifyToken, authorizeRoles(['Admin']), updateActivityCategoryValidator, updateActivityCategoryController);
router.delete('/:id', verifyToken, authorizeRoles(['Admin']), deleteActivityCategoryController);

export default router;
