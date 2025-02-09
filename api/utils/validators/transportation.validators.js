import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const createTransportationValidator = [
    check("name")
        .notEmpty()
        .withMessage("Transportation name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Transportation name must be between 3 and 50 characters"),

    check("type")
        .notEmpty()
        .withMessage("Transportation type is required")
        .isIn(["bus", "train", "flight", "ferry"])
        .withMessage("Transportation type must be one of: bus, train, flight, ferry"),

    check("from")
        .notEmpty()
        .withMessage("Departure location is required")
        .isString()
        .withMessage("Departure location must be a string"),

    check("to")
        .notEmpty()
        .withMessage("Arrival location is required")
        .isString()
        .withMessage("Arrival location must be a string"),

    check("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ gt: 0 })
        .withMessage("Price must be a positive number"),

    check("departureTime")
        .notEmpty()
        .withMessage("Departure time is required")
        .isISO8601()
        .withMessage("Departure time must be a valid date"),

    check("arrivalTime")
        .notEmpty()
        .withMessage("Arrival time is required")
        .isISO8601()
        .withMessage("Arrival time must be a valid date")
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.departureTime)) {
                throw new Error("Arrival time must be after departure time");
            }
            return true;
        }),

    check("availableSeats")
        .notEmpty()
        .withMessage("Available seats is required")
        .isInt({ gt: 0 })
        .withMessage("Available seats must be a positive integer"),

    validatorMiddleware
];
