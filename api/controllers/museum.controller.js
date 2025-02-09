import Museum from '../models/museum.model.js';
import Tag from '../models/tag.model.js';
import ApiError from '../utils/apiError.js';
import { StatusCodes } from 'http-status-codes';
import{MAX_LIMIT, formatResponse} from "../utils/Helpers/formatPaginationResponse.js"


export const createMuseumController = async (req, res, next) => {
  try {
    // user id to data sent to service
    req.body.tourismGovernor = req.user.id;
    const museum = await Museum.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: museum });
  } catch (error) {
    next(new ApiError("Error creating museum", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const getMuseumController = async (req, res, next) => {
  try {
    const museum = await Museum.findById(req.params.id);
    if (!museum) {
      return next(new ApiError("Museum not found", StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({ success: true, data: museum });
  } catch (error) {
    next(new ApiError("Error fetching museum", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const updateMuseumController = async (req, res, next) => {
  try {
    const museumService = await req.container.resolve('museumService');
    const updatedMuseum = await museumService.updateMuseum(req.params.id, req.body);

    if (!updatedMuseum) {
      return next(new ApiError("Museum not found", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedMuseum,
    });
  } catch (error) {
    next(new ApiError("Error updating museum", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const deleteMuseumController = async (req, res, next) => {
  try {
    const museum = await Museum.findByIdAndDelete(req.params.id);
    if (!museum) {
      return next(new ApiError("Museum not found", StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({ success: true, message: "Museum deleted successfully" });
  } catch (error) {
    next(new ApiError("Error deleting museum", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const getAllMuseumsController = async (req, res, next) => {
  try {
    //paginate result
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: Math.min(parseInt(req.query.limit, 10) || 10, MAX_LIMIT),
    };
    //find by tourism governer id
    const museums = await Museum.find({tourismGovernor: req.user.id
    }).paginate({}, options);
    
    res.status(StatusCodes.OK).json({ success: true, data: museums });
  } catch (error) {
    next(new ApiError("Error fetching museums", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};
export const searchMuseums = async (req, res, next) => {
  try {
    const { name, location } = req.query;

    // Build search query
    const query = {};
    if (name) {
      query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search
    }
    if (location) {
      query.location = { $regex: new RegExp(location, 'i') }; // Case-insensitive location search
    }

    const museums = await Museum.find(query);

    if (museums.length === 0) {
      return next(new ApiError("No museums found", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json(museums);
  } catch (error) {
    next(new ApiError("Error searching museums", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const getAllUpcomingMuseums = async (req, res, next) => {
  try {
    const currentDate = new Date(); // Get the current date and time

    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: Math.min(parseInt(req.query.limit, 10) || 10, MAX_LIMIT),
      sort: { start_date: 1 }, // Sort by start_date in ascending order (soonest first)
      lean: true, // Use lean for better performance
      populate: { path: 'tags', select: 'name' } // Populate the 'tags' field with 'name' only
    };

    // Query for museums where end_date is in the future
    const query = {
      end_date: { $gte: currentDate },
    };

    // Use mongoose-paginate-v2 to paginate the results
    const museums = await Museum.paginate(query, options);

    // Format the response using formatResponse function
    const formattedResponse = formatResponse(museums);

    res.status(StatusCodes.OK).json(formattedResponse);
  } catch (error) {
    console.error("Error retrieving upcoming museums:", error);
    next(new ApiError("Error retrieving upcoming museums", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

export const filterMuseumsByTag = async (req, res, next) => {
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

    // Filter museums by tag ObjectIds
    const museums = await Museum.find({ tags: { $in: tagIds } })
      .populate('tags', 'name') // Populate the 'tags' field with only the 'name'
      .lean(); // Use lean for performance improvement

    // If no museums are found, return a 404
    if (museums.length === 0) {
      return next(new ApiError("No museums found for the provided tag", StatusCodes.NOT_FOUND));
    }

    // Return the matching museums
    res.status(StatusCodes.OK).json({
      success: true,
      data: museums,
    });
  } catch (error) {
    console.error("Error filtering museums by tag:", error); // Log the error for debugging
    next(new ApiError("Error filtering museums by tag", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};