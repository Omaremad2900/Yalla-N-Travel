// services/userService.js
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import apiError from "../utils/apiError.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendAcceptanceEmail } from "../utils/Jobs/mailer.js";

class UserService {
  //User Accepting terms
  async acceptTerms(userId) {
    try {
      // Find user by ID
      const user = await User.findById(userId);

      if (!user) {
        throw new apiError(
          `User with id ${userId} not found`,
          StatusCodes.NOT_FOUND
        );
      }

      // Update the acceptedTermsAndConditions field
      await User.findByIdAndUpdate(userId, {
        acceptedTermsAndConditions: true,
      });

      // Save the updated user
      await user.save();

      // Generate a new JWT token with updated acceptedTermsAndConditions
      const newToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
          acceptedTermsAndConditions: user.acceptedTermsAndConditions,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return { user, token: newToken }; // Return updated user and new token
    } catch (error) {
      throw new apiError(error.message, StatusCodes.BAD_REQUEST);
    }
  }
  // Create a new user
  async createUser(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      throw new apiError(error.message, StatusCodes.BAD_REQUEST);
    }
  }

  // Find user by email
  async findUserByEmail(email) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw new apiError("User not found", StatusCodes.NOT_FOUND);
    }
  }

  // Find user by ID
  async findUserById(userId) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new apiError("User not found", StatusCodes.NOT_FOUND);
    }
  }

  // Update user by ID
  async updateUser(userId, updateData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });
      return updatedUser;
    } catch (error) {
      throw new apiError("Unable to update user", StatusCodes.BAD_REQUEST);
    }
  }

  // Delete user by ID
  async deleteUser(userId) {
    try {
      await User.findByIdAndDelete(userId);
      return { message: "User deleted successfully" };
    } catch (error) {
      throw new apiError("Unable to delete user", StatusCodes.BAD_REQUEST);
    }
  }

  async changePassword(userId, newPassword) {
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        throw new apiError(
          `User with id ${userId} not found`,
          StatusCodes.NOT_FOUND
        );
      }

      // Hash the new password
      const hashedPassword = await bcryptjs.hash(newPassword, 12);

      // Update the user's password and set the passwordChangedAt timestamp
      user.password = hashedPassword;
      user.passwordChangedAt = Date.now();

      // Save the updated user
      await user.save();

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      // Create a message for the password change notification
      const message = `Hi ${user.username}!, \n Please note your password has been changed at ${formattedDate} \n If this was you, then you can ignore this email \n Otherwise, please contact support`;

      return { user, message };
    } catch (error) {
      throw new apiError(error.message, StatusCodes.BAD_REQUEST);
    }
  }

  async forgetPassword(email) {
    const user = await User.findOne({ email: email });
    console.log(`user: ${user}`);
    if (!user) {
      throw new apiError("User not found", StatusCodes.NOT_FOUND);
    }

    let userOtp = await Otp.findOne({ user: user._id });
    if (!userOtp) {
      userOtp = new Otp({ user: user._id });
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    userOtp.passwordResetCode = hashedResetCode;

    userOtp.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    userOtp.passwordResetVerified = false;

    await userOtp.save();

    const subject = "Your Password Reset Code";
    const message = `Hi ${user.username},\n We received a request to reset the password on your Yalla n'Travel Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Yalla n'Travel Team`;
    try {
      await sendAcceptanceEmail(user.email, subject, message);
    } catch (err) {
      userOtp.passwordResetCode = undefined;
      userOtp.passwordResetExpires = undefined;
      userOtp.passwordResetVerified = undefined;

      await userOtp.save();
      throw new apiError(
        "Failed to send password reset email",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    return user;
  }

  async verifyResetCode(resetCode) {
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    const userOtp = await Otp.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!userOtp) {
      throw new apiError(
        "Invalid or expired reset code",
        StatusCodes.BAD_REQUEST
      );
    }

    userOtp.passwordResetVerified = true;
    await userOtp.save();
  }

  async resetPassword(email, newPassword) {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new apiError("User not found", StatusCodes.NOT_FOUND);
    }

    // Find associated Otp document
    const userOtp = await Otp.findOne({ user: user._id });
    console.log(userOtp);
    if (userOtp.passwordResetVerified === false) {
      throw new apiError("Reset code not verified", StatusCodes.BAD_REQUEST);
    }

    // Update user password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clear reset code fields in Otp document
    userOtp.passwordResetCode = undefined;
    userOtp.passwordResetExpires = undefined;
    userOtp.passwordResetVerified = undefined;
    await userOtp.save();
  }
}

export default UserService;
