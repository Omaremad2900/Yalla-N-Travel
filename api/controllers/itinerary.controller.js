import { StatusCodes } from 'http-status-codes';
import Itinerary from '../models/itinerary.model.js';
import ApiError from '../utils/apiError.js';
import Activity from '../models/activity.model.js';
import { MAX_LIMIT,formatResponse } from '../utils/Helpers/formatPaginationResponse.js';
import mongoose from 'mongoose';
import Tag from '../models/tag.model.js'

// done using service
export const createItineraryController = async (req, res, next) => {
  try {
    const itineraryService = await req.container.resolve('itineraryService');
    const tourGuideId = req.user.id; // Assuming user ID is attached by authentication middleware
    const itineraryData = req.body;

    // Call the service to create the itinerary
    const savedItinerary = await itineraryService.createItinerary(tourGuideId, itineraryData);

    // Return the newly created itinerary
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Itinerary created successfully',
      itinerary: savedItinerary
    });
  } catch (error) {
    console.log(error);
    next(error);  // Pass the error to the global error handler
  }
};

export const getItineraryController = async (req, res, next) => {
  try {
    const itineraryId = req.params.id;
    const itineraryService = await req.container.resolve('itineraryService');
    
    const itinerary = await itineraryService.getItinerary(itineraryId);
    return res.status(StatusCodes.OK).json(itinerary);
  } catch (error) {
    next(error);
  }
};

// done using service
export const updateItineraryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Resolve the Itinerary service from the DI container
    const itineraryService = await req.container.resolve('itineraryService');

    // Call the service to update the itinerary
    const updatedItinerary = await itineraryService.updateItinerary(id, updateData);

    if (!updatedItinerary) {
      return next(new ApiError('Itinerary not found', StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Itinerary updated successfully',
      data: updatedItinerary,
    });
  } catch (error) {
    console.error('Error updating itinerary:', error);
    next(new ApiError('Error updating itinerary', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const deleteItineraryController = async (req, res, next) => {
  try {
    const itineraryId = req.params.id;
    const itineraryService = await req.container.resolve('itineraryService');
    
    const result = await itineraryService.deleteItinerary(itineraryId);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
 
// done using service
export const getAllItinerariesByGuideController = async (req, res, next) => {
  try {
    // Resolve the Itinerary service from the DI container
    const itineraryService = await req.container.resolve('itineraryService');

    // Extract pagination options from query params
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, MAX_LIMIT);

    // Call the service to get all itineraries for the tour guide
    const itineraries = await itineraryService.getAllItinerariesByGuide(req.user, { page, limit });

    // Respond with the paginated itineraries
    res.status(StatusCodes.OK).json(itineraries);
  } catch (error) {
    console.error("Error retrieving itineraries:", error);
    next(error);
  }
};

// done using services
export const searchItineraries = async (req, res, next) => {
  try {
    const itineraryService = await req.container.resolve('itineraryService');

    // Call the service to perform the search based on tags
    const itineraries = await itineraryService.searchItinerariesByTag(req.query);

    // Respond with the paginated itineraries
    res.status(StatusCodes.OK).json(itineraries);
  } catch (error) {
    console.error("Error searching itineraries:", error);
    next(new ApiError("Error searching itineraries", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

// done using services
export const getUpcomingItineraries = async (req, res, next) => {
  try {
    const itineraryService = await req.container.resolve('itineraryService');

    // Call the service to fetch upcoming itineraries with pagination
    const itineraries = await itineraryService.getUpcomingItineraries(req.query);

    // Respond with the paginated itineraries
    res.status(StatusCodes.OK).json(itineraries);
  } catch (error) {
    console.error("Error retrieving upcoming itineraries:", error);
    next(error);
  }
};


// done using services
export const getAllUpcomingItinerariesWithSorting = async (req, res, next) => {
  try {
    const itineraryService = await req.container.resolve('itineraryService');

    // Call the service to fetch upcoming itineraries with filtering, sorting, and pagination
    const itineraries = await itineraryService.getUpcomingItinerariesWithSorting(req.query);

    // Respond with the filtered and sorted itineraries
    res.status(StatusCodes.OK).json(itineraries);
  } catch (error) {
    console.error("Error retrieving filtered and sorted itineraries:", error);
    next(new ApiError("Error retrieving upcoming itineraries", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

// done using services
export const getFilteredUpcomingItineraries = async (req, res, next) => {
  try {
    const itineraryService = await req.container.resolve('itineraryService');

    // Call the service to fetch filtered upcoming itineraries
    const filteredItineraries = await itineraryService.getFilteredUpcomingItineraries(req.query);

    // Respond with the filtered itineraries
    res.status(StatusCodes.OK).json(filteredItineraries);
  } catch (error) {
    console.error("Error retrieving filtered itineraries:", error);
    next(new ApiError("Error retrieving filtered itineraries", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};
