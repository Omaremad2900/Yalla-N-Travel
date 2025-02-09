import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const createItineraryValidator = [
  // Validate activities (ObjectId format)
  check("activities")
    .isArray({ min: 1 })
    .withMessage("Activities must be an array with at least one activity.")
    .bail()
    .custom((activities) => {
      activities.forEach((activity) => {
        if (!activity.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error("Each activity must be a valid ObjectId.");
        }
      });
      return true;
    }),

  // Validate duration
  check("duration")
    .isInt({ gt: 0 })
    .withMessage("Duration must be a positive integer representing the duration in minutes."),

  // Validate language
  check("language")
    .notEmpty()
    .withMessage("Please specify a language."),

  // Validate price
  check("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number."),

  // Validate availableDates array
  check("availableDates")
    .isArray({ min: 1 })
    .withMessage("Available dates must be an array with at least one date.")
    .bail()
    .custom((dates) => {
      dates.forEach((date) => {
        if (!Date.parse(date)) {
          throw new Error(`Invalid date format: ${date}`);
        }
      });
      return true;
    }),

  // Validate accessible boolean
  check("accessible")
    .optional()
    .isBoolean()
    .withMessage("Accessible must be a boolean value."),

  // Validate start_date
  check("start_date")
    .notEmpty()
    .withMessage("Start date is required.")
    .bail()
    .custom((startDate) => {
      if (!Date.parse(startDate)) {
        throw new Error("Invalid start date format.");
      }
      return true;
    }),

  // Validate end_date and check if it's after start_date
  check("end_date")
    .notEmpty()
    .withMessage("End date is required.")
    .bail()
    .custom((endDate, { req }) => {
      if (!Date.parse(endDate)) {
        throw new Error("Invalid end date format.");
      }
      const startDate = new Date(req.body.start_date);
      const endDateObj = new Date(endDate);
      if (endDateObj <= startDate) {
        throw new Error("End date must be after start date.");
      }
      return true;
    }),

    //validate availableTickets 
    check("availableTickets")
    .isInt({min:0})
    .withMessage("availableTickets must be a positive integer."),


  validatorMiddleware,
];

export const updateItineraryValidator = [
  // Validate activities (optional, ObjectId format)
  check("activities")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Activities must be an array with at least one activity.")
    .bail()
    .custom((activities) => {
      activities.forEach((activity) => {
        if (!activity.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error("Each activity must be a valid ObjectId.");
        }
      });
      return true;
    }),

  // Validate locations (optional, GeoJSON Point)
  check("locations")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Locations must be an array with at least one location.")
    .bail(),

  // Validate duration (optional)
  check("duration")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Duration must be a positive integer representing the duration in minutes."),

  // Validate language (optional)
  check("language")
    .optional()
    .notEmpty()
    .withMessage("Please specify a language."),

  // Validate price (optional)
  check("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number."),

  // Validate availableDates array (optional)
  check("availableDates")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Available dates must be an array with at least one date.")
    .bail()
    .custom((dates) => {
      dates.forEach((date) => {
        if (!Date.parse(date)) {
          throw new Error(`Invalid date format: ${date}`);
        }
      });
      return true;
    }),

  // Validate accessible boolean (optional)
  check("accessible")
    .optional()
    .isBoolean()
    .withMessage("Accessible must be a boolean value."),

  // Validate pickupLocation (optional, GeoJSON Point)
  check("pickupLocation")
    .optional(),

  // Validate dropOffLocation (optional, GeoJSON Point)
  check("dropOffLocation")
    .optional(),

  // Validate start_date (optional)
  check("start_date")
    .optional()
    .custom((startDate) => {
      if (!Date.parse(startDate)) {
        throw new Error("Invalid start date format.");
      }
      return true;
    }),

  // Validate end_date and check if it's after start_date (optional)
  check("end_date")
    .optional()
    .custom((endDate, { req }) => {
      if (!Date.parse(endDate)) {
        throw new Error("Invalid end date format.");
      }
      if (req.body.start_date) {
        const startDate = new Date(req.body.start_date);
        const endDateObj = new Date(endDate);
        if (endDateObj <= startDate) {
          throw new Error("End date must be after start date.");
        }
      }
      return true;
    }),

  // Validate tags (optional array of strings)
  check("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings.")
    .bail()
    .custom((tags) => {
      tags.forEach((tag) => {
        if (typeof tag !== 'string') {
          throw new Error("Each tag must be a string.");
        }
      });
      return true;
    }),
    check("availableTickets")
      .isInt({min:0})
      .withMessage("availableTickets must be a positive integer."),

  validatorMiddleware,
];
// add ratings validators
export const itineraryratingsValidators = [
  // Validate rating (required number between 1 and 5)
    check("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be an integer between 1 and 5."),
    validatorMiddleware,
  ];