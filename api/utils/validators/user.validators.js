import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const changePasswordValidator = [
  check("password").notEmpty().withMessage("Please enter a new password"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your new password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  validatorMiddleware,
];
