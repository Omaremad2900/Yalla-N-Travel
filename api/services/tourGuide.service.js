// services/tourGuideService.js
import Itinerary from "../models/itinerary.model.js";
import tourGuideModel from "../models/tourGuide.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Ticket from "../models/ticket.model.js";

class TourGuideService {
  //get by id
  async getById(id) {
    return await tourGuideModel.findById(id).populate("user");
  }
  //get all
  async getAll() {
    return await tourGuideModel.find();
  }
  //create
  async create(data) {
    return await tourGuideModel.create(data);
  }
  //update
  async update(id, data) {
    return await tourGuideModel.findByIdAndUpdate(id, data, { new: true });
  }
  //delete
  async delete(id) {
    return await tourGuideModel.findByIdAndDelete(id);
  }

  // Create a new tour guide profile
  async createTourGuideProfile(userId, tourGuideData) {
    const existingTourGuide = await tourGuideModel.findOne({ user: userId });
    if (existingTourGuide) {
      throw new ApiError(
        "Tour Guide profile already exists.",
        StatusCodes.BAD_REQUEST
      );
    }

    const newTourGuide = new tourGuideModel({
      user: userId,
      ...tourGuideData,
    });
    await newTourGuide.save();

    // Update the User to mark the profile as complete
    await User.findByIdAndUpdate(userId, { isCompleted: true });

    const populatedTourGuide = await tourGuideModel
      .findById(newTourGuide._id)
      .populate("user", "username email");

    return populatedTourGuide;
  }

  // Get all tour guides with pagination
  async getAllTourGuides(page, limit) {
    const skip = (page - 1) * limit;

    // Query the Tourguide model, which references the User model
    const tourGuides = await tourGuideModel
      .find({})
      .skip(skip)
      .limit(limit)
      .populate("user", "username email"); // Populating user details from the User model

    const totalTourGuides = await tourGuideModel.countDocuments();

    return { total: totalTourGuides, page, data: tourGuides };
  }

  // Get a specific tour guide by ID
  async getTourGuideById(userId) {
    const tourGuide = await tourGuideModel
      .findOne({ user: userId }) // Find the tour guide using the user ID
      .populate("user", "username email"); // Populate the user details
    if (!tourGuide) {
      throw new ApiError(
        `No Tour Guide with user ID: ${userId}`,
        StatusCodes.NOT_FOUND
      );
    }

    return tourGuide;
  }

  // Update a tour guide profile
  async updateTourGuideProfile(userId, updateData) {
    console.log(updateData);
    // Find the tour guide profile by userId and populate the user details
    const tourGuide = await tourGuideModel
      .findOne({ user: userId })
      .populate("user", "username email"); // Populate user details

    if (!tourGuide) {
      throw new ApiError("Tour Guide not found", StatusCodes.NOT_FOUND);
    }

    // Extract fields meant for the User model
    const userFieldsToUpdate = {};
    if (updateData.username) userFieldsToUpdate.username = updateData.username;
    if (updateData.email) userFieldsToUpdate.email = updateData.email;

    // If there are user fields to update, update the User model
    if (Object.keys(userFieldsToUpdate).length > 0) {
      await User.findByIdAndUpdate(userId, userFieldsToUpdate, {
        new: true,
        runValidators: true,
      });
    }

    // Update the tour guide-specific fields
    const tourGuideFieldsToUpdate = {};
    if (updateData.yearsOfExperience !== undefined) {
      tourGuideFieldsToUpdate.yearsOfExperience = updateData.yearsOfExperience;
    }
    if (updateData.mobileNumber !== undefined) {
      tourGuideFieldsToUpdate.mobileNumber = updateData.mobileNumber;
    }
    if (updateData.previousWork !== undefined) {
      tourGuideFieldsToUpdate.previousWork = updateData.previousWork;
    }
    if (updateData.profilePicture !== undefined) {
      tourGuideFieldsToUpdate.profilePicture = updateData.profilePicture;
    }

    // Update the tour guide document if there are fields to update
    Object.assign(tourGuide, tourGuideFieldsToUpdate);

    await tourGuide.save();

    // Return the updated tour guide profile with populated user details
    const updatedTourGuide = await tourGuideModel
      .findById(tourGuide._id)
      .populate("user", "username email"); // Populate again to return the updated user data

    return updatedTourGuide;
  }

  // Delete a tour guide profile
  async deleteTourGuide(id) {
    const tourGuide = await User.findByIdAndDelete(id);
    if (!tourGuide) {
      throw new ApiError(`No Tour Guide with id ${id}`, StatusCodes.NOT_FOUND);
    }
    return { message: "Tour Guide deleted successfully" };
  }

  async toggleItineraryStatus(itineraryId, status, userId) {
    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      throw new ApiError("Itinerary not found", StatusCodes.NOT_FOUND);
    }

    // if (itinerary.tourGuideId.toString() !== userId) {
    //   throw new ApiError("Unauthorized access", StatusCodes.UNAUTHORIZED);
    // }

    if (status !== "active" && status !== "deactivated") {
      throw new ApiError(
        "Invalid status. Status must be 'active' or 'deactivated'.",
        StatusCodes.BAD_REQUEST
      );
    }

    if (itinerary.status === "active" && status === "active") {
      throw new ApiError("Itinerary is already active.", StatusCodes.CONFLICT);
    }

    if (itinerary.status === "deactivated" && status === "deactivated") {
      throw new ApiError(
        "Itinerary is already deactivated.",
        StatusCodes.CONFLICT
      );
    }

    // Allow deactivation only if there are tickets booked
    if (
      status === "deactivated" &&
      (!itinerary.tickets || itinerary.tickets.length === 0)
    ) {
      throw new ApiError(
        "Only itineraries with bookings can be deactivated",
        StatusCodes.BAD_REQUEST
      );
    }

    itinerary.status = status;

    //adding debugging statements
    console.log(
      `Updated itinerary status: ID=${itineraryId}, New Status=${status}`
    );

    await itinerary.save();
    return itinerary;
  }

  async getItinerariesByTourGuideId(id) {
    const itineraries = await Itinerary.find({
      tourGuideId: id,
      status: "active",
    });

    return itineraries;
  }

  async requestAccountDeletion(id, userId, itineraryId) {
    // Find the tour guide associated with the user
    const tourGuide = await tourGuideModel.findById(id);
    if (!tourGuide) {
      throw new ApiError("Tour Guide not found", StatusCodes.NOT_FOUND);
    }

    const upcomingItineraries = await Itinerary.find({ _id: itineraryId });

    // If there are any active or upcoming itineraries, throw an error
    if (upcomingItineraries.length > 0) {
      throw new ApiError(
        "Cannot delete account with upcoming itineraries or activities",
        StatusCodes.CONFLICT
      );
    }

    // Find the user and set the requestDelete flag to true
    const user = await User.findByIdAndDelete(userId);
    // const user = await User.findByIdAndUpdate(
    //   userId,
    //   { requestDelete: true },
    //   { new: true }
    // );
  }

  async getTouristReport(tourGuideObjectId, { month }) {
    // Step 1: Find the tour guide (if needed for validation)
    const tourGuide = await tourGuideModel.find({user:tourGuideObjectId});
    if (!tourGuide) {
      throw new Error("Tour guide not found");
    }
  
    // Step 2: Find all itineraries by the tour guide
    const itineraries = await Itinerary.find({ tourGuideId: tourGuideObjectId });
  
    if (itineraries.length === 0) {
      return { totalTourists: 0, itineraries: [] };
    }
  
    // Step 3: Prepare itinerary IDs
    const itineraryIds = itineraries.map((itinerary) => itinerary._id);
  
    // Step 4: Calculate the date filter based on month
    let dateFilter = {};
    if (month) {
      const currentYear = new Date().getFullYear();
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);
      dateFilter.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    }
  
    // Step 5: Count tickets grouped by itinerary and filtered by date range
    const ticketsCount = await Ticket.aggregate([
      {
        $match: {
          itinerary: { $in: itineraryIds },
          status: "Paid",
          ...dateFilter, // Apply date filter if month is provided
        },
      },
      { $group: { _id: "$itinerary", touristCount: { $sum: 1 } } },
    ]);
  
    // Step 6: Build the report
    let totalTourists = 0;
    const itineraryBreakdown = itineraries.map((itinerary) => {
      const ticketData = ticketsCount.find(
        (ticket) => ticket._id.toString() === itinerary._id.toString()
      );
      const touristCount = ticketData ? ticketData.touristCount : 0;
      totalTourists += touristCount;
      return {
        itineraryName: itinerary.title,
        touristCount,
      };
    });
  
    return {
      totalTourists,
      itineraries: itineraryBreakdown,
    };
  }
  

  async getTourGuideSalesReport(
    userId,
    { itineraryName, startDate, endDate, month }
  ) {
    // Step 1: Find all itineraries by the tour guide and optionally filter by itinerary name
    const itineraryQuery = { tourGuideId: userId };
    if (itineraryName) {
      itineraryQuery.title = itineraryName;
    }
    const itineraries = await Itinerary.find(itineraryQuery);

    if (itineraries.length === 0) {
      return { totalRevenue: 0, itineraries: [] };
    }

    // Step 2: Prepare itinerary IDs
    const itineraryIds = itineraries.map((itinerary) => itinerary._id);

    // Step 3: Calculate the date filter based on startDate, endDate, and month
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    if (month) {
      const currentYear = new Date().getFullYear();
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);
      dateFilter.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    }

    // Step 4: Count tickets grouped by itinerary and filtered by date range
    const ticketsCount = await Ticket.aggregate([
      {
        $match: {
          itinerary: { $in: itineraryIds },
          status: "Paid",
          ...dateFilter, // Apply date filter if provided
        },
      },
      {
        $group: {
          _id: "$itinerary",
          revenue: { $sum: "$price" },
        },
      },
    ]);

    // Step 5: Build the report
    let totalRevenue = 0;
    const itineraryBreakdown = itineraries.map((itinerary) => {
      const ticketData = ticketsCount.find(
        (ticket) => ticket._id.toString() === itinerary._id.toString()
      );
      const revenue = ticketData ? ticketData.revenue : 0;
      totalRevenue += revenue;
      return {
        itineraryName: itinerary.title,
        revenue,
      };
    });

    return {
      totalRevenue,
      itineraries: itineraryBreakdown,
    };
  }
}

export default TourGuideService;
