import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError.js';
import Activity from '../models/activity.model.js'; // Import the Activity model
import { formatResponse, MAX_LIMIT } from "../utils/Helpers/formatPaginationResponse.js";
import Tag from '../models/tag.model.js'; // Assuming the Tag model is in models folder
import path from 'path';

export const searchActivities = async (req, res, next) => {
  try {
    const { category, tag } = req.query;

    // Ensure that at least one filter is provided
    if (!category && !tag) {
      return next(new ApiError("At least one filter (category or tag) query parameter is required", StatusCodes.BAD_REQUEST));
    }

    // Build search query
    const query = {};
    
    // If category is provided, add it to the query
    if (category) {
      query.category = category;
    }

    // If tag is provided, we need to find the corresponding Tag objects first
    if (tag) {
      const tagsArray = Array.isArray(tag) ? tag : [tag]; // Ensure tag is an array

      // Find the Tag documents that match the provided tag names
      const foundTags = await Tag.find({
        name: { $in: tagsArray.map(t => t.toLowerCase()) } // Match case-insensitive tag names
      }).select('_id'); // Only return the _id fields since we need the ObjectIds

      // If no tags were found, return an empty result
      if (foundTags.length === 0) {
        return next(new ApiError("No matching tags found", StatusCodes.NOT_FOUND));
      }

      // Extract the tag ObjectIds
      const tagIds = foundTags.map(tag => tag._id);

      // Add the tags filter to the query, checking if any of the activity's tags match the tag ObjectIds
      query.tags = { $in: tagIds };
    }

    // Find activities that match the query, populate tags with their names
    const activities = await Activity.find(query)
      .populate('tags', 'name') // Populate tags with only the 'name' field
      .lean(); // Use lean for performance improvement

    // If no activities are found, return a 404
    if (activities.length === 0) {
      return next(new ApiError("No activities found for the provided filters", StatusCodes.NOT_FOUND));
    }

    // Return the matching activities
    res.status(StatusCodes.OK).json(activities);
  } catch (error) {
    console.error("Error searching activities:", error); // Log the error for debugging
    next(new ApiError("Error searching activities", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const getAllUpcomingActivities = async (req, res, next) => {
  try {
    const currentDate = new Date(); // Get the current date and time

    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: Math.min(parseInt(req.query.limit, 10) || 10, MAX_LIMIT),
      sort: { dateTime: 1 }, // Sort by dateTime in ascending order (soonest first)
      lean: true, // Use lean for better performance
      populate:[ { path: 'tags', select: 'name' } // Populate the 'tags' field with 'name' only
        ,{path:'category',select:'name'}]
    };

    // Query for activities where dateTime is in the future
    const query = {
      dateTime: { $gte: currentDate },
      isFlagged: false
    };

    // Use mongoose-paginate-v2 to paginate the results
    const activities = await Activity.paginate(query, options);

    // Format the response using formatResponse function
    const formattedResponse = formatResponse(activities);

    res.status(StatusCodes.OK).json(formattedResponse);
  } catch (error) {
    next(new ApiError("Error retrieving upcoming activities", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const getAllUpcomingActivitiesWithFilter = async (req, res, next) => {
  try {
    const currentDate = new Date(); // Get the current date and time

    // Extract relevant query parameters
    const {
      price,
      startDate,
      category,
      rating,
      page,
      limit,
    } = req.query;

    const options = {
      page: parseInt(page, 10) || 1,
      limit: Math.min(parseInt(limit, 10) || 10, MAX_LIMIT),
      sort: { dateTime: 1 }, // Sort by dateTime in ascending order (soonest first)
      lean: true, // Use lean for better performance
      populate: { path: 'tags', select: 'name' }, // Populate the 'tags' field with 'name' only
    };

    // Build the query dynamically based on filters
    const query = {
      dateTime: { $gte: currentDate }, // Always filter future activities
    };

// Filter by price range (from 0 to max price if provided)
if (price !== undefined) {
  query.price = { $lte: parseFloat(price) }; // Activities with price <= specified price
}

    // Filter by date (if provided)
    if (startDate) {
      query.dateTime = { $gte: new Date(startDate) };
    }

    // Filter by category (if provided)
    if (category) {
      query.category = category; // Exact match for the category
    }

    // Filter by exact rating (if provided)
    if (rating !== undefined) {
      query.ratings = parseFloat(rating);
    }

    // Use mongoose-paginate-v2 to paginate the results
    const activities = await Activity.paginate(query, options);

    // Format the response using formatResponse function
    const formattedResponse = formatResponse(activities);

    res.status(StatusCodes.OK).json(formattedResponse);
  } catch (error) {
    console.error("Error retrieving filtered activities:", error);
    next(new ApiError("Error retrieving upcoming activities", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const getAllUpcomingActivitiesWithSorting = async (req, res, next) => {
  try {
    const currentDate = new Date(); // Get the current date and time

    // Extract query parameters
    const { price, rating, sortOrder } = req.query;

    // Build the query object for upcoming activities
    const query = {
      dateTime: { $gte: currentDate }, // Only upcoming activities
    };

    // Set sorting options based on provided parameters
    const sortOptions = {};

    // Add price sort option if provided
    if (price) {
      const parsedPrice = parseFloat(price);
      if (!isNaN(parsedPrice)) {
        sortOptions.price = sortOrder === 'asc' ? 1 : -1; // Ascending or descending based on sortOrder
      }
    }

    // Add rating sort option if provided
    if (rating) {
      const parsedRating = parseFloat(rating);
      if (!isNaN(parsedRating)) {
        sortOptions.ratings = sortOrder === 'asc' ? 1 : -1; // Ascending or descending based on sortOrder
      }
    }

    // Default to sort by date if no other sorting is provided
    if (Object.keys(sortOptions).length === 0) {
      sortOptions.dateTime = 1; // Sort by dateTime ascending by default
    }

    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: Math.min(parseInt(req.query.limit, 10) || 10, MAX_LIMIT),
      sort: sortOptions,
      lean: true,
      populate: { path: 'tags', select: 'name' },
    };

    // Use mongoose-paginate-v2 to paginate the results
    const activities = await Activity.paginate(query, options);

    // Format and return the response
    res.status(StatusCodes.OK).json(formatResponse(activities));
  } catch (error) {
    // Handle the error and return an appropriate message
    next(new ApiError("Error retrieving filtered and sorted activities", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};
// controller get activity by id
export const getActivityById = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('tags', 'name').lean();

    if (!activity) {
      return next(new ApiError("Activity not found", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json(activity);
  } catch (error) {
    console.error("Error fetching activity by ID:", error);
    next(new ApiError("Error fetching activity", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

