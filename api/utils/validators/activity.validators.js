import { check,body } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";


// Validator for creating an activity
export const createActivityValidator = [
    body('name')
    .exists().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .trim(),
    body('dateTime')
      .exists().withMessage('dateTime is required')
      .isISO8601().withMessage('dateTime must be a valid ISO 8601 date'),
    body('location.type')
      .exists().withMessage('Location type is required')
      .equals('Point').withMessage("Location type must be 'Point'"),
    body('location.coordinates')
      .exists().withMessage('Coordinates are required')
      .isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of [longitude, latitude]')
      .custom((coordinates) => {
        if (coordinates.length !== 2 || !coordinates.every(coord => typeof coord === 'number')) {
          throw new Error('Coordinates must be valid numbers');
        }
        return true;
      }),
    body('price')
      .exists().withMessage('Price is required')
      .isNumeric().withMessage('Price must be a number'),
    body('category')
      .exists().withMessage('Category is required'),
    body('tags')
      .optional().isArray().withMessage('Tags must be an array of strings'),
    body('specialDiscounts')
      .optional().isString().withMessage('Special discounts must be a string'),
    body('isBookingOpen')
      .optional().isBoolean().withMessage('isBookingOpen must be a boolean'),
    body('ratings')
      .optional()
      .isNumeric().withMessage('Ratings must be a number')
      .isFloat({ min: 0, max: 5 }).withMessage('Ratings must be an integer between 0 and 5'),
      check("availableTickets")
      .isInt({min:0})
      .withMessage("availableTickets must be a positive integer."),
      validatorMiddleware
  ];
  
  // Validator for updating an activity
  export const updateActivityValidator = [
    body('name')
      .optional()
      .isString().withMessage('Name must be a string')
      .trim(),
    body('dateTime')
      .optional().isISO8601().withMessage('dateTime must be a valid ISO 8601 date'),
    body('location.type')
      .optional()
      .equals('Point').withMessage("Location type must be 'Point'"),
    body('location.coordinates')
      .optional()
      .isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of [longitude, latitude]')
      .custom((coordinates) => {
        if (coordinates.length !== 2 || !coordinates.every(coord => typeof coord === 'number')) {
          throw new Error('Coordinates must be valid numbers');
        }
        return true;
      }),
    body('price')
      .optional().isNumeric().withMessage('Price must be a number'),
    body('category')
      .optional(),
    body('tags')
      .optional().isArray().withMessage('Tags must be an array of strings'),
    body('specialDiscounts')
      .optional().isString().withMessage('Special discounts must be a string'),
    body('isBookingOpen')
      .optional().isBoolean().withMessage('isBookingOpen must be a boolean'),
    body('ratings')
      .optional()
      .isNumeric().withMessage('Ratings must be a number')
      .isFloat({ min: 0, max: 5 }).withMessage('Ratings must be an integer between 0 and 5'),
      check("availableTickets")
      .isInt({min:0})
      .withMessage("availableTickets must be a positive integer."),
    validatorMiddleware
  
  ];
// add ratings validators
export const activityratingsValidators = [
  // Validate rating (required number between 1 and 5)
  check("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5."),
  validatorMiddleware,
];