import { check,body } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const createAdvertiserValidator = [
  check("website")
    .isURL().withMessage("Please enter a valid website URL")
    .notEmpty().withMessage("Website is required"),
  
  check("hotline")
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/).withMessage("Please enter a valid hotline number")
    .notEmpty().withMessage("Hotline is required"),
  
  check("company_profile")
    .isLength({ max: 500 }).withMessage("Company profile can't be longer than 500 characters")
    .notEmpty().withMessage("Company profile is required"),
    validatorMiddleware
];

export const validateAdvertiserId = [
    check("id").isMongoId()
    .withMessage("Invalid advertiser ID format")
    .notEmpty().withMessage("Invalid advertiser ID is required"),
  
   validatorMiddleware
  ];

  export const updateAdvertiserValidator = [
    check("website")
      .optional()
      .isURL().withMessage("Please enter a valid website URL"),
  
    check("hotline")
      .optional()
      .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/).withMessage("Please enter a valid hotline number"),
  
    check("company_profile")
      .optional()
      .isLength({ max: 500 }).withMessage("Company profile can't be longer than 500 characters"),
  
    validatorMiddleware,
  ];
