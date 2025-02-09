import User from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/apiError.js";

//Read Tourism Govener Profile
export const readProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tourismGovenor = await User.findById(userId);
    if (!tourismGovenor) {
      return next(
        new ApiError(
          `Tourism Governor with id ${userId} Doesnt exist`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({ data: tourismGovenor });
  } catch (err) {
    next(err);
  }
};
