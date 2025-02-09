import { check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';

// Validator middleware for review creation
export const createReviewValidator = [
  check('rating')
    .exists({ checkFalsy: true }) // Ensure rating is present and not falsy
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }) // Ensure rating is an integer between 1 and 5
    .withMessage('Rating must be an integer between 1 and 5'),

  check('comment')
    .optional() // Allow comment to be optional (it can be null)
    .isString() // Check that if provided, it's a string
    .withMessage('Comment must be a string'),

  validatorMiddleware, // Custom middleware to handle validation errors
];
