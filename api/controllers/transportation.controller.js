import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/apiError.js";


// Create a transportation
export const createTransportationController = async (req, res, next) => {
  try {
    const id =req.user.id
    const transportationService = req.container.resolve("transportationService");
    const transportation = await transportationService.createTransportation(id,req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: transportation });
  } catch (error) {
    next(error);
  }
};
 
// get transportations
export const getTransportationController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const transportationService = req.container.resolve("transportationService");
    const transportations = await transportationService.getTransportation(page, limit);
    res.status(StatusCodes.OK).json({ success: true, data: transportations });
  } catch (error) {
    next(error);
  }
};