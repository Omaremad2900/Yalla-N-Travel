import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError.js';

export const shareResource = async (req, res, next) => {
  try {
    const shareService = req.container.resolve('shareService');  // Assuming you have DI in place
    const response = await shareService.shareResource(req);
    res.status(StatusCodes.OK).json(response);  // Return the generated link
  } catch (error) {
    next(new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};
