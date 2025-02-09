import jwt from "jsonwebtoken";
import apiError from "./apiError.js";
import User from "../models/user.model.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new apiError("Unauthorized", 401));
  }

  // Extract the token from the 'Bearer <token>' format
  const token = authHeader.split(" ")[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new apiError("Forbidden", 403));

    req.user = user; // Attach the user to the request
    next();
  });
};

export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new apiError("Unauthorized", 401));
    }

      const token = authHeader.split(' ')[1]; // Extract the token
   
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        
          if (err) return next(new apiError('Forbidden',403));

      if (!roles.includes(user.role)) {
        return next(new apiError("Access denied", 403));
      }

      req.user = user; // Attach user to the request
      next();
    });
  };
};

export const CheckProfile = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new apiError("Forbidden", 403));

    if (!user.isCompleted) {
      return next(new apiError("profile is not completed", 403));
    }
    req.user = user; // Attach user to the request
    next();
  });
};

export const checkTermsAccepted = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return next(new apiError("Forbidden", 403));

    // Fetch the latest user data from the database
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new apiError("User not found", 404));
    }

    if (!user.acceptedTermsAndConditions) {
      return next(
        new apiError(
          "You must accept the terms and conditions to use the system",
          403
        )
      );
    }

    req.user = user; // Attach the latest user data to the request
    next();
  });
};
