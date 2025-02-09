//Service file for activity
import Activity from '../models/activity.model.js';
import Tag from '../models/tag.model.js';
import preferenceTagModel from '../models/preferenceTag.model.js';
import ActivityCategory from '../models/activityCategory.model.js';
import ApiError from '../utils/apiError.js';
import { formatResponse, MAX_LIMIT } from "../utils/Helpers/formatPaginationResponse.js";
import { StatusCodes } from 'http-status-codes';

class ActivityService {
    //get by id
    async getById(id) {
        return await Activity.findById(id);
    }
    //get all
    async getAll() {
        return await Activity.find();
    }
    //create
    async create(data) {
        return await Activity.create(data);
    }
    //update
    async update(id, data) {
        return await Activity.findByIdAndUpdate(id, data, { new: true });
    }
    //delete
    async delete(id) {
        return await Activity.findByIdAndDelete(id);
    }

  // Get all activities for the authenticated advertiser with pagination
  async getMyActivities(req) {
    if (req.user.role !== "Advertiser") {
        throw new ApiError("Only advertisers can see activities", StatusCodes.FORBIDDEN);
    }

    const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: Math.min(parseInt(req.query.limit, 10) || 10, MAX_LIMIT),
        sort: { createdAt: -1 },
        lean: true,
        populate: [{ path: 'tags', select: 'name' }, { path: 'category', select: 'name' }]
    };

    let categoryFilter = {};
    if (req.query.category) {
        const activityCategory = await ActivityCategory.findOne({ name: req.query.category });
        if (!activityCategory) {
            throw new ApiError("Category not found", StatusCodes.NOT_FOUND);
        }
        categoryFilter = { category: activityCategory._id };
    }

    const activities = await Activity.paginate({ advertiser_id: req.user.id, ...categoryFilter }, options);

    if (!activities || activities.totalDocs === 0) {
        throw new ApiError("No activities found for this advertiser", StatusCodes.NOT_FOUND);
    }

    return activities;
  }

  // Create a new activity
  async createActivity(req) {
    if (req.user.role !== "Advertiser") {
      throw new ApiError("Only advertisers can create activities", StatusCodes.FORBIDDEN);
    }

    const { name, dateTime, location, price,  category, tags, specialDiscounts, isBookingOpen, ratings,availableTickets,pictures } = req.body;
    console.log(pictures)

    if (!name || !dateTime || !location || !price || !category) {
      throw new ApiError("Missing required fields", StatusCodes.BAD_REQUEST);
    }

    const activityCategory = await ActivityCategory.findOne({ name: category });
    if (!activityCategory) {
      throw new ApiError("Category not found", StatusCodes.NOT_FOUND);
    }

    let tagIds = [];
    if (tags && tags.length > 0) {
      const foundTags = await preferenceTagModel.find({ name: { $in: tags.map(tag => tag.toLowerCase()) } }).select('_id');
      if (foundTags.length === 0) {
        throw new ApiError("No matching tags found", StatusCodes.NOT_FOUND);
      }
      tagIds = foundTags.map(tag => tag._id);
    }

    const activityData = {
      advertiser_id: req.user.id,
      name,
      dateTime,
      location,
      price,
      category: activityCategory._id,
      tags: tagIds,
      specialDiscounts,
      isBookingOpen: isBookingOpen || false,
      ratings: ratings || 0,
      availableTickets,
      pictures
      
    };

    const newActivity = await new Activity(activityData).save();
    return await Activity.findById(newActivity._id).populate('tags', 'name').lean();
  }

  // Get activity by ID
  async getActivityById(id) {
    const activity = await Activity.findById(id).lean().populate('category','name');
    if (!activity) {
      throw new ApiError("Activity not found", StatusCodes.NOT_FOUND);
    }
    return activity;
  }
  async getTagIdsByNames(tagNames) {
    try {
      // Find tags with names that match any of the names in tagNames array
      const tags = await preferenceTagModel.find({ name: { $in: tagNames.map(name => name.toLowerCase()) } });
  
      // Extract and return an array of tag IDs
      return tags.map(tag => tag._id);
    } catch (error) {
      console.error("Error fetching tag IDs:", error);
      throw new Error("Unable to fetch tag IDs");
    }
  }
  // Update activity by ID
  async updateActivity(req) {
    const { id } = req.params;
    let { name, dateTime, location, price, category, tags, specialDiscounts, isBookingOpen, ratings,availableTickets,pictures } = req.body;

    category = category.trim().toLowerCase();

    const activity = await Activity.findById(id);
    if (!activity) {
      throw new ApiError("Activity not found", StatusCodes.NOT_FOUND);
    }

    if (activity.advertiser_id.toString() !== req.user.id) {
      throw new ApiError("You are not authorized to update this activity", StatusCodes.FORBIDDEN);
    }

    if (category) {
      const activityCategory = await ActivityCategory.findOne({ name: { $regex: new RegExp('^' + category + '$', 'i') } });
      if (!activityCategory) {
        throw new ApiError("Category not found", StatusCodes.NOT_FOUND);
      }
      activity.category = activityCategory._id;
    }
    let tagIds = null
    if(tags){
      tagIds = await this.getTagIdsByNames(tags)
    }
    
    if (name) activity.name = name;
    if (dateTime) activity.dateTime = new Date(dateTime);
    if (location && location.type === 'Point' && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
      activity.location = location;
    }
    if (price)
    activity.price = price;
    if (specialDiscounts) activity.specialDiscounts = specialDiscounts;
    if (typeof isBookingOpen === 'boolean') activity.isBookingOpen = isBookingOpen;
    if (typeof ratings === 'number' && ratings >= 0 && ratings <= 5) activity.ratings = ratings;
    if (availableTickets) activity.availableTickets = availableTickets;
    if(tagIds) activity.tags=tagIds
    if(pictures) activity.pictures=pictures
    if(isBookingOpen)
    activity.isBookingOpen=isBookingOpen;
    await activity.save();
    // populate tag and category

    return await Activity.findById(id).populate('tags', 'name').populate('category','name').lean();
  }

  // Delete activity by ID
  async deleteActivity(req) {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      throw new ApiError("Activity not found", StatusCodes.NOT_FOUND);
    }

    if (activity.advertiser_id.toString() !== req.user.id) {
      throw new ApiError("You are not authorized to delete this activity", StatusCodes.FORBIDDEN);
    }

    await Activity.findByIdAndDelete(id);
    return { message: "Activity deleted successfully" };
  }
}

export default ActivityService;
