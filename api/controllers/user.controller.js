import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import Otp from "../models/otp.model.js";
import { StatusCodes } from "http-status-codes";
import { sendAcceptanceEmail } from "../utils/Jobs/mailer.js";

import {
  formatResponse,
  MAX_LIMIT,
} from "../utils/Helpers/formatPaginationResponse.js"; // Importing the format response utility

export const test = (req, res) => {
  res.json({
    message: "Api route is working!",
  });
};
// Controller to get all users with filtering and pagination
export const getAllUsers = async (req, res, next) => {
  try {
    // Extract query parameters for filtering and pagination
    const { page = 1, limit = 10, isAccepted, isCompleted } = req.query;

    // Build the filter object dynamically based on query params
    const filter = {};
    if (isAccepted !== undefined) filter.isAccepted = isAccepted === "true";
    if (isCompleted !== undefined) filter.isCompleted = isCompleted === "true";

    // Define pagination options
    const options = {
      page: parseInt(page, 10),
      limit: Math.min(parseInt(limit, 10), MAX_LIMIT), // Limit max items per page to 50
      sort: { createdAt: -1 }, // Sort by creation date, newest first
      lean: true, // Improve performance by returning plain objects
    };

    // Use mongoose-paginate-v2 to fetch users with filtering and pagination
    const users = await User.paginate(filter, options);

    if (!users || users.totalDocs === 0) {
      return next(new ApiError("No users found", StatusCodes.NOT_FOUND));
    }

    // Format and send the paginated response
    const formattedResponse = formatResponse(users);
    res.status(StatusCodes.OK).json(formattedResponse);
  } catch (error) {
    next(
      new ApiError("Error retrieving users", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(new apiError(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(new ApiError(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(new apiError(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const acceptTerms = async (req, res, next) => {
  try {
    // Call the acceptTerms method from the service
    const { user, token } = await req.container
      .resolve("userService")
      .acceptTerms(req.user.id);

    res.status(200).json({
      message: "Terms and conditions accepted successfully!",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { password: newPassword } = req.body;

    // Use the userService to change the password
    const { user, message } = await req.container
      .resolve("userService")
      .changePassword(req.user.id, newPassword);

    // Send an email notification to the user
    try {
      await sendAcceptanceEmail(user.email, "Password Changed", message);
    } catch (error) {
      return next(new ApiError("Failed to send email", 500));
    }

    res
      .status(200)
      .json({ success: true, message: "Successfully Changed Password!" });
  } catch (error) {
    next(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    //const userId = req.user.id;
    const email = req.body.email;
    const userService = await req.container.resolve("userService");
    const user = await userService.forgetPassword(email);

    res
      .status(200)
      .json({ message: `Verification code has been sent to ${email}` });
  } catch (err) {
    next(err);
  }
};

export const verifyResetCode = async (req, res, next) => {
  try {
    //const user = req.user.id;
    const userService = await req.container.resolve("userService");
    const verify = await userService.verifyResetCode(req.body.resetCode);

    res
      .status(200)
      .json({ message: "Reset Code Has Been Verified Successfully!" });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    //const user = req.user.id;
    const email = req.body.email;
    const userService = await req.container.resolve("userService");
    const reset = await userService.resetPassword(email, req.body.newPassword);

    res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (err) {
    next(err);
  }
};
