import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const createHistoricalPlaceValidator = [
  check("name").notEmpty().withMessage("Please enter the name of the historical place"),
  check("description").notEmpty().withMessage("Please enter a description"),
  check("pictures").isArray().withMessage("Pictures must be an array").notEmpty().withMessage("Pictures cannot be empty"),
  check("location").notEmpty().withMessage("Please enter the location"),
  check("openingHours").notEmpty().withMessage("Please enter opening hours"),
  check("ticketPrices").isNumeric().withMessage("Please enter a valid ticket price"),
  validatorMiddleware,
];

export const updateHistoricalPlaceValidator = [
  check("name").optional().notEmpty().withMessage("Name must not be empty"),
  check("description").optional().notEmpty().withMessage("Description must not be empty"),
  check("pictures").optional().isArray().withMessage("Pictures must be an array"),
  check("location").optional().notEmpty().withMessage("Location must not be empty"),
  check("openingHours").optional().notEmpty().withMessage("Opening hours must not be empty"),
  check("ticketPrices").optional().isNumeric().withMessage("Ticket prices must be a number"),
  check("tags").optional().isArray().withMessage("Tags must be an array"),
  validatorMiddleware,
];