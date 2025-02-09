import slugify from "slugify";
import { check, body } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

import User from "../../models/user.model.js";

export const createTourGuideValidator = [validatorMiddleware];

export const getTourGuideValidator = [
  check("id").isMongoId().withMessage("Invalid Tour Guide id format"),
  validatorMiddleware,
];

export const updateTourGuideValidator = [
  //check("id").isMongoId().withMessage("Invalid Tour Guide id format"),
  body("previousWork")
    .optional()
    .isString()
    .withMessage("Previous work must be a string"),
  body("mobileNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid mobile number format"),
  body("yearsOfExperience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Years of Experience must be a positive integer"),
  validatorMiddleware,
];

export const deleteTourGuideValidator = [
  check("id").isMongoId().withMessage("Invalid Tour Guide id format"),
  validatorMiddleware,
];
