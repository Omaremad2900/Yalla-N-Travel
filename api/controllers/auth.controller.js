import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import apiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import { scheduleAcceptanceEmail } from "../utils/Jobs/agenda.js";

export const tourSignUp = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      date_of_birth,
      nationality,
      occupationStatus,
      mobileNumber,
      acceptTerms,
    } = req.body; // Destructure name instead of username
    // Hash the password
    const hash_password = await bcrypt.hash(password, 10);
    //check if username or email already exists
    const Check = await User.findOne({ $or: [{ username }, { email }] });
    if (Check) {
      return next(new apiError("User already exists", 400));
    }
    if (acceptTerms !== true) {
      return next(
        new apiError(
          "Please accept the terms of service before signing up",
          401
        )
      );
    }
    // Create User using injected UserService
    const user = await req.container.resolve("userService").createUser({
      username, // Replace `username` with `name`
      email,
      password: hash_password,
      role: "Tourist", // Force role to be 'Tourist'
      date_of_birth,
      isAccepted: true,
      isCompleted: true,
    });

    // Create Tourist using injected TouristService
    const tourist = await req.container
      .resolve("touristService")
      .createTourist({
        userId: user._id,
        nationality,
        occupationStatus,
        mobileNumber,
      });
    if (!tourist) {
      // delete the user
      await User.findByIdAndDelete(user._id);
      return next(new apiError("Tourist not created", 400));
    }

    // Return the created user and tourist in the response
    res
      .status(201)
      .json({ message: "Tourist created successfully", user, tourist });
  } catch (error) {
    next(new apiError(error.message, 400));
  }
};

export const signup = async (req, res, next) => {
  const {
    username,
    email,
    password,
    role,
    date_of_birth,
    nationalId,
    credentials,
    acceptTerms,
  } = req.body;

  // Ensure role is valid
  const validRoles = ["Advertiser", "Tour Guide", "Seller", "Tourism Governor"];
  if (role && !validRoles.includes(role)) {
    return next(new ApiError("Invalid role provided", 400)); // Handle invalid role
  }

  if (acceptTerms !== true) {
    return next(
      new ApiError("Please accept the terms of service before signing up", 401)
    );
  }
  try {
    // Hash the password
    const hash_password = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hash_password,
      role,
      credentials, // Save file path to credentials
      nationalId, // Save file path to nationalId
      date_of_birth,
    });

    // Save the user
    await user.save();
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    if (!user.isAccepted) {
      return next(new ApiError("User not accepted", 404));
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return next(new ApiError("Invalid credentials", 401));
    }

    // Include role in the JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        isCompleted: user.isCompleted,
        username: user.username,
      }, // Include role in token payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );
    user.refreshToken = refreshToken;
    await user.save();

    const { password: pass, ...rest } = user._doc; // Exclude password from the response
    res
      .status(200)
      .set("Authorization", `Bearer ${token}`)
      .json({ ...rest, token, refreshToken }); // Send user data along with token
  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.body.refreshToken;
    if (!token) throw new ApiError("No token provided", StatusCodes.FORBIDDEN);
    // No token provided

    const user = await User.findOne({ refreshToken: token });
    if (!user)
      throw new ApiError("Invalid refresh token", StatusCodes.FORBIDDEN);
    // Invalid refresh token

    jwt.verify(token, process.env.REFRESH_SECRET_KEY, (err) => {
      if (err)
        throw new ApiError("Invalid refresh token", StatusCodes.FORBIDDEN);
      // Token expired or invalid

      const newAccessToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
          isCompleted: user.isCompleted,
          username: user.username,
        }, // Include role in token payload
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token: newAccessToken });
    });
  } catch (error) {
    next(error);
  }
};

// Controller method to accept a user
export const acceptUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find the user by ID and update isAccepted to true
    const user = await User.findByIdAndUpdate(
      userId,
      { isAccepted: true },
      { new: true } // Returns the updated document
    );

    if (!user) {
      return next(new ApiError("User not found", StatusCodes.NOT_FOUND));
    }
    const { email, username } = user;
    console.log("before");
    await scheduleAcceptanceEmail(email, username);
    console.log("after");

    res.status(StatusCodes.OK).json({
      message: "User has been accepted",
      user,
    });
  } catch (error) {
    next(
      new ApiError(
        "An error occurred while accepting the user",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};
