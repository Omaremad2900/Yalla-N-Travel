import slugify from "slugify";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Itinerary from "../models/itinerary.model.js";
import Event from "../models/activity.model.js";
import { StatusCodes } from "http-status-codes";

import {
  formatResponse,
  MAX_LIMIT,
} from "../utils/Helpers/formatPaginationResponse.js";

// @desc    Create a tour guide
// @route   /api/tourguide/create
// @access   private
export const createTourGuide = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.role !== "Tour Guide") {
      return next(new ApiError("Only Tour Guides can create accounts!", 401));
    }

    const tourGuideData = {
      mobileNumber: req.body.mobileNumber,
      yearsOfExperience: req.body.yearsOfExperience,
      previousWork: req.body.previousWork,
      profilePicture: req.body.profilePicture,
    };

    const newTourGuide = await req.container
      .resolve("tourGuideService")
      .createTourGuideProfile(req.user.id, tourGuideData);

    res.status(StatusCodes.CREATED).json(newTourGuide);
  } catch (error) {
    console.error("Error creating Tour Guide profile:", error);
    next(error);
  }
});

// @desc  Get All Tour Guides
// @route /api/tourGuides/
// @access Private
export const getTourGuides = asyncHandler(async (req, res, next) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const tourGuides = await req.container
      .resolve("tourGuideService")
      .getAllTourGuides(page, limit);
    res.status(StatusCodes.OK).json(tourGuides);
  } catch (error) {
    next(error);
  }
});

// @desc    Get a Specific Tour Guide
// @route   /api/tourguide/:id
// @access   Public
export const getTourGuide = asyncHandler(async (req, res, next) => {
  try {
    const tourGuide = await req.container
      .resolve("tourGuideService")
      .getTourGuideById(req.user.id);
    res.status(StatusCodes.OK).json({ data: tourGuide });
  } catch (error) {
    next(error);
  }
});

// @desc    Update a Tour Guide
// @route   /api/tourguide/:id
// @access   Public
export const updateTourGuide = asyncHandler(async (req, res, next) => {
  try {
    const updatedTourGuide = await req.container
      .resolve("tourGuideService")
      .updateTourGuideProfile(req.user.id, req.body);
    res.status(StatusCodes.OK).json(updatedTourGuide);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a Tour Guide
// @route   /api/tourguide/:id
// @access  Private
export const deleteTourGuide = asyncHandler(async (req, res, next) => {
  try {
    const result = await req.container
      .resolve("tourGuideService")
      .deleteTourGuide(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
});

// View a list of all itineraries created by a tourguide
export const getMyItineraries = async (req, res, next) => {
  try {
    // Ensure the user is authenticated and is a tour guide
    if (req.user.role !== "Tour Guide") {
      return next(
        new ApiError(
          "Only tour guides can access itineraries",
          StatusCodes.FORBIDDEN
        )
      );
    }

    // Extract pagination options and filters from query params
    const { page = 1, limit = 10 } = req.query;

    // Set pagination options
    const options = {
      page: parseInt(page, 10),
      limit: Math.min(parseInt(limit, 10), MAX_LIMIT), // Limit to a max of 50 items per page
      sort: { createdAt: -1 }, // Sort by newest itineraries first
      populate: "events", // Populate the events related to each itinerary
      lean: true, // Use lean for better performance
    };

    // Find the itineraries for the authenticated tour guide
    const itineraries = await Itinerary.paginate(
      { tourguide_id: req.user.id },
      options
    );

    // If no itineraries are found
    if (!itineraries || itineraries.totalDocs === 0) {
      return next(
        new ApiError(
          "No itineraries found for this tour guide",
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Format the paginated response
    const formattedResponse = formatResponse(itineraries);

    // Send the response
    res.status(StatusCodes.OK).json(formattedResponse);
  } catch (error) {
    console.error("Error retrieving itineraries:", error);
    next(
      new ApiError(
        "Error retrieving itineraries",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const createItinerary = async (req, res, next) => {
  try {
    // Ensure that only tour guides can create itineraries
    if (req.user.role !== "Tour Guide") {
      return next(
        new ApiError(
          "Only tour guides can create itineraries",
          StatusCodes.FORBIDDEN
        )
      );
    }

    const { events, start_date, end_date, tags } = req.body;

    // Validate that at least one event is provided
    if (!events || events.length === 0) {
      return next(
        new ApiError("At least one event is required", StatusCodes.BAD_REQUEST)
      );
    }

    // Validate the provided event IDs
    const validEvents = await Event.find({ _id: { $in: events } });
    if (validEvents.length !== events.length) {
      return next(
        new ApiError(
          "One or more event IDs are invalid",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Create the itinerary for the authenticated tour guide
    const itinerary = await Itinerary.create({
      tourguide_id: req.user.id, // Use the authenticated user's ID
      events,
      start_date,
      end_date,
      tags,
    });

    // Respond with the newly created itinerary
    res.status(StatusCodes.CREATED).json(itinerary);
  } catch (error) {
    console.error("Error creating itinerary:", error);
    next(
      new ApiError(
        "Error creating itinerary",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const toggleItineraryStatus = asyncHandler(async (req, res, next) => {
  const { id: itineraryId } = req.body;
  const { status } = req.body;

  const updatedItinerary = await req.container
    .resolve("tourGuideService")
    .toggleItineraryStatus(itineraryId, status, req.user.id);

  res.status(StatusCodes.OK).json({ data: updatedItinerary });
});

export const getItinerariesForTourGuide = async (req, res) => {
  try {
    const tourGuideId = req.user.id;

    const tourGuideService = await req.container.resolve("tourGuideService");
    const itineraries = await tourGuideService.getItinerariesByTourGuideId(
      tourGuideId
    );

    res.status(StatusCodes.OK).json({ data: itineraries });
  } catch (err) {
    next(err);
  }
};

export const requestTourGuideDelete = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const tourGuideService = req.container.resolve("tourGuideService");
  const tourGuide = await tourGuideService.getTourGuideById(userId);
  const id = tourGuide._id;

  const itineraryId = await tourGuideService.getItinerariesByTourGuideId(
    userId
  );

  const requestDeleteTourGuide = await tourGuideService.requestAccountDeletion(
    id,
    userId,
    itineraryId
  );

  res.status(StatusCodes.OK).json({
    data: requestDeleteTourGuide,
    message: "Account Deleted!",
  });
});
//get tourguide by id from
export const getTourGuideByIdForRating = asyncHandler(
  async (req, res, next) => {
    try {
      const tourGuide = await req.container
        .resolve("tourGuideService")
        .getTourGuideById(req.params.id);
      res.status(StatusCodes.OK).json({ data: tourGuide });
    } catch (error) {
      next(error);
    }
  }
);

export const getTouristReport = asyncHandler(async (req, res, next) => {
  try {
    const tourGuideId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(tourGuideId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid Tour Guide ID",
      });
    }

    const { month } = req.query;

    // Convert to ObjectId for MongoDB operations
    const tourGuideObjectId = new mongoose.Types.ObjectId(tourGuideId);
    const tourGuideService = await req.container.resolve("tourGuideService");
    const report = await tourGuideService.getTouristReport(tourGuideObjectId, {
      month: month ? parseInt(month, 10) : undefined,
    });
    res.status(StatusCodes.OK).json({ data: report });
  } catch (err) {
    next(err);
  }
});

export const getTourGuideRevenue = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request
    const { itineraryName, startDate, endDate, month } = req.query;
    const tourGuideService = await req.container.resolve("tourGuideService");
    const report = await tourGuideService.getTourGuideSalesReport(userId, {
      itineraryName,
      startDate,
      endDate,
      month,
    });
    res.status(StatusCodes.OK).json({ data: report });
  } catch (err) {
    next(err);
  }
});
