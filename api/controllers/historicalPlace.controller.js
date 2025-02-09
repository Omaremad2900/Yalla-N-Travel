import HistoricalPlace from '../models/historicalPlace.model.js';
import ApiError from '../utils/apiError.js'; 
import { StatusCodes } from 'http-status-codes';
import Tag from "../models/tag.model.js"
import{MAX_LIMIT, formatResponse} from "../utils/Helpers/formatPaginationResponse.js"

export const createHistoricalPlaceController = async (req, res, next) => {
  try {
    req.body.tourismGovernor = req.user.id;
    const historicalPlace = await req.container.resolve('historicalPlaceService').createHistoricalPlace(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: historicalPlace });
  } catch (error) {
    next(new Error("Error creating historical place: " + error.message));
  }
};

export const getHistoricalPlaceController = async (req, res, next) => {
  try {
    const historicalPlace = await req.container.resolve('historicalPlaceService').getHistoricalPlace(req.params.id);
    if (!historicalPlace) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Historical place not found' });
    }
    res.status(StatusCodes.OK).json({ success: true, data: historicalPlace });
  } catch (error) {
    next(new Error("Error retrieving historical place: " + error.message));
  }
};

export const updateHistoricalPlaceController = async (req, res, next) => {
  try {
    const historicalPlaceService = await req.container.resolve('historicalPlaceService'); // Dependency injection
    const updatedHistoricalPlace = await historicalPlaceService.updateHistoricalPlace(req.params.id, req.body);

    if (!updatedHistoricalPlace) {
      return next(new ApiError("Historical place not found", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedHistoricalPlace,
    });
  } catch (error) {
    next(new ApiError("Error updating historical place", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const deleteHistoricalPlaceController = async (req, res, next) => {
  try {
    const deletedPlace = await req.container.resolve('historicalPlaceService').deleteHistoricalPlace(req.params.id);
    if (!deletedPlace) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Historical place not found' });
    }
    res.status(StatusCodes.OK).json({ success: true, message: 'Historical place deleted successfully' });
  } catch (error) {
    next(new Error("Error deleting historical place: " + error.message));
  }
};

export const getAllHistoricalPlacesController = async (req, res, next) => {
  try {
    //take page limit from params
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, MAX_LIMIT);
    const id=req.user.id;
    const historicalPlaces = await req.container.resolve('historicalPlaceService').getAllHistoricalPlaces(id,page,limit);
    res.status(StatusCodes.OK).json({ success: true, data: historicalPlaces });
  } catch (error) {
    next(new Error("Error retrieving historical places: " + error.message));
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////
export const searchHistoricalPlaces = async (req, res, next) => {
  try {
    const { name, tag } = req.query;

    // Build search query
    const query = {};

    // If a name is provided, perform a case-insensitive search using regex
    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };  // Search by historical place name
    }

    // If tag is provided, find the corresponding tag ObjectId(s)
    if (tag) {
      // Convert tag string into an array if multiple tags are passed
      const tagsArray = Array.isArray(tag) ? tag : [tag];  

      // Find the corresponding tag ObjectIds in the database
      const foundTags = await Tag.find({
        name: { $in: tagsArray.map(t => t.toLowerCase()) }  // Case-insensitive tag search
      }).select('_id');  // Only select the _id of the matching tags

      // If no tags are found, return an error
      if (foundTags.length === 0) {
        return next(
          new ApiError("No matching tags found", StatusCodes.NOT_FOUND)
        );
      }

      // Extract the tag ObjectIds
      const tagIds = foundTags.map(tag => tag._id);

      // Add the tags filter to the query
      query.tags = { $in: tagIds };  // Search historical places that have one of the provided tags
    }

    // Perform the search based on the query
    const historicalPlaces = await HistoricalPlace.find(query);

    // If no historical places are found, return an error
    if (historicalPlaces.length === 0) {
      return next(new ApiError("No historical places found", StatusCodes.NOT_FOUND));
    }

    // Respond with the found historical places
    res.status(StatusCodes.OK).json(historicalPlaces);
  } catch (error) {
    console.error("Error searching historical places:", error);
    next(new ApiError("Error searching historical places", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const getAllUpcomingHistoricalPlaces = async (req, res, next) => {
  try {
    const currentDate = new Date(); // Get the current date and time

    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: Math.min(parseInt(req.query.limit, 10) || 10, MAX_LIMIT),
      sort: { start_date: 1 }, // Sort by start_date in ascending order (soonest first)
      lean: true, // Use lean for better performance
      populate: { path: 'tags', select: 'name' } // Populate the 'tags' field with 'name' only
    };

    // Query for historical places where end_date is in the future
    const query = {
      end_date: { $gte: currentDate },
    };

    // Use mongoose-paginate-v2 to paginate the results
    const historicalPlaces = await HistoricalPlace.paginate(query, options);

    // Format the response using formatResponse function
    const formattedResponse = formatResponse(historicalPlaces);

    res.status(StatusCodes.OK).json(formattedResponse);
  } catch (error) {
    console.error("Error retrieving upcoming historical places:", error);
    next(new ApiError("Error retrieving upcoming historical places", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const filterHistoricalPlacesByTag = async (req, res, next) => {
  try {
    const { tag } = req.query; // Fetch the tag from query params

    // Ensure that the tag is provided
    if (!tag) {
      return next(new ApiError("Tag query parameter is required", StatusCodes.BAD_REQUEST));
    }

    // Convert the tag query to an array (in case multiple tags are provided)
    const tagsArray = Array.isArray(tag) ? tag : [tag];

    // Find the Tag documents that match the provided tag names (case-insensitive)
    const foundTags = await Tag.find({
      name: { $in: tagsArray.map(t => t.toLowerCase()) } // Case-insensitive matching
    }).select('_id'); // Only return the _id fields since we need the ObjectIds

    // If no matching tags are found, return an empty result
    if (foundTags.length === 0) {
      return next(new ApiError("No matching tags found", StatusCodes.NOT_FOUND));
    }

    // Extract the tag ObjectIds
    const tagIds = foundTags.map(tag => tag._id);

    // Filter historical places by tag ObjectIds
    const historicalPlaces = await HistoricalPlace.find({ tags: { $in: tagIds } })
      .populate('tags', 'name') // Populate the 'tags' field with only the 'name'
      .lean(); // Use lean for performance improvement

    // If no historical places are found, return a 404
    if (historicalPlaces.length === 0) {
      return next(new ApiError("No historical places found for the provided tag", StatusCodes.NOT_FOUND));
    }

    // Return the matching historical places
    res.status(StatusCodes.OK).json({
      success: true,
      data: historicalPlaces,
    });
  } catch (error) {
    console.error("Error filtering historical places by tag:", error); // Log the error for debugging
    next(new ApiError("Error filtering historical places by tag", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};