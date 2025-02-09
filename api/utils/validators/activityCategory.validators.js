import { check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';

export const createActivityCategoryValidator = [
  check('name').notEmpty().withMessage('Activity category name is required'),
  validatorMiddleware,
];

export const updateActivityCategoryValidator = [
  check('name').optional().notEmpty().withMessage('Activity category name cannot be empty'),
  validatorMiddleware,
];