import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const createMuseumValidator = [
  check("name").notEmpty().withMessage("Please enter the name of the museum"),
  check("description").notEmpty().withMessage("Please enter a description"),
  check("pictures").isArray().withMessage("Pictures must be an array").notEmpty().withMessage("Pictures cannot be empty"),
  check("location").notEmpty().withMessage("Please enter the location"),
  check("openingHours").notEmpty().withMessage("Please enter opening hours"),
  check("ticketPrices").isNumeric().withMessage("Please enter a valid ticket price"),
  validatorMiddleware,
];

export const updateMuseumValidator = [
  check("name").optional().notEmpty().withMessage("Please enter the name of the museum"),
  check("description").optional().notEmpty().withMessage("Please enter a description"),
  check("pictures").optional().isArray().withMessage("Pictures must be an array"),
  check("location").optional().notEmpty().withMessage("Please enter the location"),
  check("openingHours").optional().notEmpty().withMessage("Please enter opening hours"),
  check("ticketPrices").optional().isNumeric().withMessage("Please enter a valid ticket price"),
  validatorMiddleware,
];