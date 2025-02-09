import slugify from "slugify";

import { check } from "express-validator";

import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

import User from "../../models/user.model.js";

export const signUpValidator = [
  check("username").notEmpty().withMessage("Please enter your username"),
  check("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Invalid Email Address"),
  check("password").notEmpty().withMessage("Please enter your password"),
  validatorMiddleware,
];

export const signInValidator = [
  check("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Invalid Email Address"),
  check("password").notEmpty().withMessage("Please enter your password"),
  validatorMiddleware,
];
