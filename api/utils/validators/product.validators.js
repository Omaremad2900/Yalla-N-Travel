import { check,query } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const createProductValidator = [
    check("name")
      .notEmpty().withMessage("Product name is required")
      .isLength({ min: 3, max: 100 }).withMessage("Product name must be between 3 and 100 characters long"),
    
    check("description")
      .notEmpty().withMessage("Description is required")
      .isLength({ min: 10, max: 1000 }).withMessage("Description must be between 10 and 1000 characters long"),
    
    check("price")
      .isNumeric().withMessage("Price must be a number")
      .notEmpty().withMessage("Price is required")
      .isFloat({ min: 0 }).withMessage("Price must be greater than or equal to 0"),
    
    check("imageUrl")
      .isURL().withMessage("Image URL must be valid")
      .notEmpty().withMessage("Image URL is required"),
    
    check("availableQuantity")
      .isInt({ min: 0 }).withMessage("Available quantity must be a positive integer")
      .notEmpty().withMessage("Available quantity is required"),
    
    // check("seller")
    //   .isMongoId().withMessage("Invalid seller ID format")
    //   .notEmpty().withMessage("Seller ID is required"),
    
    // check("rating")
    //   .isFloat({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5")
    //   .notEmpty().withMessage("Rating is required"),
  
    validatorMiddleware,
  ];
  
  export const editProductValidator = [
    check("name")
      .optional() // This means the field is optional during the edit
      .isString().withMessage("Name must be a string")
      .notEmpty().withMessage("Product name is required if provided"),
  
    check("description")
      .optional()
      .isString().withMessage("Description must be a string")
      .notEmpty().withMessage("Product description is required if provided"),
  
    check("price")
      .optional()
      .isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  
    check("imageUrl")
      .optional(),
  
    check("availableQuantity")
      .optional()
      .isInt({ min: 0 }).withMessage("Available quantity must be a non-negative integer"),
  
    // Custom validation middleware to handle validation results
    validatorMiddleware,
  ];  

  
  export const filterProductsValidator = [
    query('minPrice')
      .optional() // This means the field is optional
      .isFloat({ min: 0 }).withMessage('Minimum price must be a positive number'),
  
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 }).withMessage('Maximum price must be a positive number'),
  
    // Custom validation to check if minPrice is greater than maxPrice
    query('maxPrice').optional().custom((value, { req }) => {
      if (req.query.minPrice && Number(req.query.minPrice) > value) {
        throw new Error('Minimum price cannot be greater than maximum price');
      }
      return true; // Return true if validation passes
    }),
  
    // Custom validation middleware to handle validation results
    validatorMiddleware,
  ];