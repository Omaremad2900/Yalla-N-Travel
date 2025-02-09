import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

// Validator middleware for tag creation
export const createTagValidator = [
  check('name')
    .notEmpty()
    .withMessage('Tag name is required')
    .isString()
    .withMessage('Tag name must be a string'),
  
  check('type')
    .notEmpty()
    .withMessage('Tag type is required')
    .isString()
    .withMessage('Tag type must be a string'),

  validatorMiddleware,
];