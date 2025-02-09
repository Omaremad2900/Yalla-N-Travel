import Itinerary from "../models/itinerary.model.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import { mongoose } from "mongoose";
import {
  MAX_LIMIT,
  formatResponse,
} from "../utils/Helpers/formatPaginationResponse.js";
import Tag from "../models/tag.model.js";

class ItineraryService {
  async createItinerary(tourGuideId, itineraryData) {
    const {
      activities,
      locations,
      start_date,
      end_date,
      availableTickets,
      title
    } = itineraryData;

    // Ensure activities is an array of valid ObjectIds
    if (
      !Array.isArray(activities) ||
      !activities.every((activity) => mongoose.Types.ObjectId.isValid(activity))
    ) {
      throw new ApiError(
        "Invalid activities format. Each activity must be a valid ObjectId.",
        StatusCodes.BAD_REQUEST
      );
    }

    // Validate dates
    if (new Date(start_date) >= new Date(end_date)) {
      throw new ApiError(
        "Start date must be before the end date.",
        StatusCodes.BAD_REQUEST
      );
    }

    // Create the itinerary
    const itinerary = new Itinerary({
      tourGuideId,
      ...itineraryData,
    });

    // Save the itinerary to the database
    return await itinerary.save();
  }

  async getItinerary(itineraryId) {
    const itinerary = await Itinerary.findById(itineraryId)
      .populate({
        path: "activities", // Path to the activities field
        select: "name", // Only select the 'name' field of the activities
      })
     ;

    if (!itinerary) {
      throw new ApiError("Itinerary not found", StatusCodes.NOT_FOUND);
    }

    if (itinerary.isFlagged) {
      throw new ApiError(
        "Itinerary is flagged, cannot be retrieved, sorry for the inconvience",
        StatusCodes.CONFLICT
      );
    }

    return itinerary;
  }

  async updateItinerary(itineraryId, updateData) {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      itineraryId,
      updateData,
      { new: true }
    );

    if (!updatedItinerary) {
      throw new ApiError("Itinerary not found", StatusCodes.NOT_FOUND);
    }

    return updatedItinerary;
  }

  async deleteItinerary(itineraryId) {
    const result = await Itinerary.findByIdAndDelete(itineraryId);
    if (!result) {
      throw new ApiError("Itinerary not found", StatusCodes.NOT_FOUND);
    }
    return { message: "Itinerary deleted successfully" };
  }

  async getAllItinerariesByGuide(user, paginationOptions) {
    const { page, limit } = paginationOptions;

    // Ensure that the user has the role 'Tour Guide'
    if (user.role !== "Tour Guide") {
      throw new ApiError(
        "Only tour guides can see their itineraries",
        StatusCodes.FORBIDDEN
      );
    }

    const options = {
      page,
      limit,
      sort: { createdAt: -1 }, // Sort by creation date in descending order
      lean: true, // Return plain JavaScript objects for better performance
      populate: [
        {
          path: "activities", // Path to the activities field
          select: "name", // Only populate the name field of the Activity model
        },
      ],
    };

    // Paginate itineraries for the authenticated tour guide
    const itineraries = await Itinerary.paginate(
      { tourGuideId: user.id },
      options
    );

    // Check if no itineraries were found
    if (!itineraries || itineraries.totalDocs === 0) {
      throw new ApiError(
        "No itineraries found for this tour guide",
        StatusCodes.NOT_FOUND
      );
    }

    // Optionally format the response
    return formatResponse(itineraries);
  }

  async searchItinerariesByTag(query) {
    const { tag, page = 1, limit = 10 } = query;

    // Ensure that a tag name is provided
    if (!tag) {
      throw new ApiError(
        "Tag query parameter is required",
        StatusCodes.BAD_REQUEST
      );
    }

    // Handle multiple tags
    const tagsArray = Array.isArray(tag) ? tag : [tag];

    // Find tags in a case-insensitive way
    const foundTags = await Tag.find({
      name: { $in: tagsArray.map((t) => t.toLowerCase()) },
    }).select("_id"); // Only fetch the IDs

    // If no tags were found, return 404
    if (foundTags.length === 0) {
      throw new ApiError("No matching tags found", StatusCodes.NOT_FOUND);
    }

    // Extract the tag ObjectIds
    const tagIds = foundTags.map((tag) => tag._id);

    // Pagination options
    const options = {
      page: parseInt(page, 10),
      limit: Math.min(parseInt(limit, 10), MAX_LIMIT),
      sort: { createdAt: -1 }, // Sort by creation date in descending order
      lean: true, // Use lean for performance
      populate: [
        {
          path: "activities",
          select: "name", // Only populate the activity name
        },
        {
          path: "tags",
          select: "name", // Only populate the tag name
        },
      ],
    };

    // Find itineraries by tags
    const itineraries = await Itinerary.paginate(
      { tags: { $in: tagIds }, isFlagged: false }, //Exclude Flagged itineraries
      options
    );

    // If no itineraries were found, return 404
    if (itineraries.totalDocs === 0) {
      throw new ApiError(
        "No itineraries found for the provided tag(s)",
        StatusCodes.NOT_FOUND
      );
    }

    // Optionally format the response
    return formatResponse(itineraries);
  }
  async getUpcomingItineraries(query) {
    const currentDate = new Date(); // Get the current date and time

    const { page = 1, limit = 10 } = query;

    // Set pagination options
    const options = {
      page: parseInt(page, 10),
      limit: Math.min(parseInt(limit, 10), MAX_LIMIT),
      sort: { start_date: 1 }, // Sort by start_date in ascending order
      lean: true,
      populate: [
          {
              path: "activities",
              select: "name", // Only populate the activity name
              populate: [
                  {path: "tags", // Populate the tags field inside each activity
                  select: "name"}, // Only populate the tag name (adjust if you need more fields)
                  { path: 'category', select: 'name' }],
          },
      ],
  };

    // Query to find itineraries with a start_date greater than or equal to the current date
    const queryCondition = {
      start_date: { $gte: currentDate },
      isFlagged: false, //Excluding flagged itineraries
      status:"active"
    };

    // Use mongoose-paginate-v2 to paginate the results
    const itineraries = await Itinerary.paginate(queryCondition, options);

    // If no itineraries are found, return a 404 error
    if (!itineraries.docs.length) {
      throw new ApiError(
        "No upcoming itineraries found",
        StatusCodes.NOT_FOUND
      );
    }

    // Format the response if needed
    return formatResponse(itineraries);
  }

  async getUpcomingItinerariesWithSorting(query) {
    const currentDate = new Date(); // Get the current date and time

    const { price, rating, page = 1, limit = 10 } = query;

    // Initialize pagination options
    const options = {
      page: parseInt(page, 10),
      limit: Math.min(parseInt(limit, 10), MAX_LIMIT),
      sort: {}, // Initialize an empty sort object
      lean: true, // Use lean for better performance
      populate: [
        {
          path: "activities",
          select: "name", // Only populate the activity name
        },
        {
          path: "tags",
          select: "name", // Only populate the tag name
        },
      ],
    };

    // Build the query dynamically based on filters
    const queryCondition = {
      availableDates: { $gte: currentDate }, // Always filter future itineraries
      isFlagged: false, // Always filter out flagged itineraries
    };

    // Handle sorting by price (if provided)
    if (price === "asc" || price === "desc") {
      options.sort.price = price === "asc" ? 1 : -1; // 1 for ascending, -1 for descending
    }

    // Handle sorting by rating (if provided)
    if (rating === "asc" || rating === "desc") {
      options.sort.ratings = rating === "asc" ? 1 : -1; // 1 for ascending, -1 for descending
    }

    // Use mongoose-paginate-v2 to paginate the results
    const itineraries = await Itinerary.paginate(queryCondition, options);

    // If no itineraries are found, return a 404 error
    if (!itineraries.docs.length) {
      throw new ApiError(
        "No upcoming itineraries found",
        StatusCodes.NOT_FOUND
      );
    }

    // Format the response if needed
    return formatResponse(itineraries);
  }

  async getFilteredUpcomingItineraries(query) {
    const currentDate = new Date(); // Get the current date

    // Destructure query parameters for filtering
    const { maxPrice, date, tag, language, page = 1, limit = 10 } = query;

    // Initialize pagination options
    const options = {
      page: parseInt(page, 10),
      limit: Math.min(parseInt(limit, 10), MAX_LIMIT),
      sort: { start_date: 1 }, // Sort by start date in ascending order (soonest first)
      lean: true, // Use lean to improve performance
      populate: [
        {
          path: "activities",
          select: "name", // Only populate the activity name
        },
        {
          path: "tags",
          select: "name", // Only populate the tag name
        },
      ],
    };

    // Build the query for filtering
    const queryCondition = {
      availableDates: { $gte: currentDate }, // Always filter for upcoming itineraries
    };

    // Filter by max price if provided
    if (maxPrice) {
      const parsedMaxPrice = parseFloat(maxPrice);
      if (!isNaN(parsedMaxPrice)) {
        queryCondition.price = { $lte: parsedMaxPrice }; // Filter itineraries with price <= maxPrice
      } else {
        throw new ApiError("Invalid maxPrice value", StatusCodes.BAD_REQUEST);
      }
    }

    // Filter by specific date if provided
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate)) {
        queryCondition.availableDates = { $gte: currentDate, $lte: parsedDate }; // Filter itineraries between now and the provided date
      } else {
        throw new ApiError("Invalid date format", StatusCodes.BAD_REQUEST);
      }
    }

    // Filter by tags if provided
    if (tag) {
      const tagsArray = Array.isArray(tag) ? tag : [tag]; // Ensure tags is an array

      // Find tags by name
      const foundTags = await Tag.find({
        name: { $in: tagsArray.map((t) => t.toLowerCase()) }, // Case-insensitive search
      }).select("_id"); // Only return _id fields

      if (foundTags.length === 0) {
        throw new ApiError("No matching tags found", StatusCodes.NOT_FOUND);
      }

      const tagIds = foundTags.map((tag) => tag._id);
      queryCondition.tags = { $in: tagIds }; // Filter by matching tags
    }

    // Filter by language if provided
    if (language) {
      queryCondition.language = new RegExp(language, "i"); // Case-insensitive search for language
    }

    // Query the database with pagination and filters
    const itineraries = await Itinerary.paginate(queryCondition, options);

    // If no itineraries found, throw a 404 error
    if (!itineraries.docs.length) {
      throw new ApiError(
        "No filtered upcoming itineraries found",
        StatusCodes.NOT_FOUND
      );
    }

    // Format the response using formatResponse
    return formatResponse(itineraries);
  }
}

export default ItineraryService;
