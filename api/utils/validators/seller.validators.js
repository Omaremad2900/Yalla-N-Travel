import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const createSellerValidator = [
  check("name").notEmpty().withMessage("Please enter name"),
  validatorMiddleware,
  check("description").notEmpty().withMessage("Description is required"),
  validatorMiddleware,
];

export const getSellerValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Seller ID format")
    .notEmpty()
    .withMessage("Invalid Seller ID is required"),

  validatorMiddleware,
];

export const updateSellerValidator = [
  check("name").notEmpty().withMessage("Please enter a name"),
  check("description").notEmpty().withMessage("Please enter a description"),
  validatorMiddleware,
];
