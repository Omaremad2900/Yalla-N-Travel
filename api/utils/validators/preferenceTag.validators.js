import { body, param } from 'express-validator';
import { validationResult } from 'express-validator';
import ApiError from '../apiError.js';
import { StatusCodes } from 'http-status-codes';

// Validator for creating a preference tag
export const createPreferenceTagValidator = [
  body('name')
    .notEmpty()
    .withMessage('Preference tag name is required')
    .isString()
    .withMessage('Preference tag name must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(errors.array().map(err => err.msg).join(', '), StatusCodes.BAD_REQUEST));
    }
    next();
  },
];

// Validator for updating a preference tag
export const updatePreferenceTagValidator = [
  param('id')
    .notEmpty()
    .withMessage('Tag ID is required')
    .isMongoId()
    .withMessage('Tag ID must be a valid MongoDB ObjectId'),
  body('name')
    .notEmpty()
    .withMessage('Preference tag name is required')
    .isString()
    .withMessage('Preference tag name must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(errors.array().map(err => err.msg).join(', '), StatusCodes.BAD_REQUEST));
    }
    next();
  },
];