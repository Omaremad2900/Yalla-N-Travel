
import { check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';
import { body, validationResult } from 'express-validator';
import ApiError from '../apiError.js';
import { StatusCodes } from 'http-status-codes'
// Validator method for adding a Tourism Governor given an adminId, username, password, email, and adminPassword.
export const addTourismGovernorValidator = [
  body("adminId").notEmpty().withMessage("Admin ID is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("adminPassword").notEmpty().withMessage("Admin password is required")];


// Validator for deleting any user account given an ID
export const deleteAccountValidator = [
  check("targetUserId")
    .notEmpty()
    .withMessage("Please provide the user ID to delete"),
  validatorMiddleware,
];
// Validator method for adding an admin
export const addAdminValidator = [
    body('adminId').isString().withMessage('Admin ID is required'),
    body('username').isString().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('adminPassword').isString().withMessage('Admin password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ApiError(errors.array().map(err => err.msg).join(', '), StatusCodes.BAD_REQUEST));
        }
        next();
    },
];