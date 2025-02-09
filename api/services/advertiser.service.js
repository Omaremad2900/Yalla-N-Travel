import Advertiser from "../models/advertiser.model.js";
import User from "../models/user.model.js";
import Ticket from "../models/ticket.model.js";
import Activity from "../models/activity.model.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import {
  formatResponse,
  MAX_LIMIT,
} from "../utils/Helpers/formatPaginationResponse.js";

class AdvertiserService {
  // Create Advertiser Profile
  async createAdvertiserProfile(req) {
    if (req.user.role !== "Advertiser") {
      throw new ApiError(
        "Only advertisers can create profiles",
        StatusCodes.FORBIDDEN
      );
    }

    const existingAdvertiser = await Advertiser.findOne({
      user_id: req.user.id,
    });
    if (existingAdvertiser) {
      throw new ApiError(
        "Advertiser profile already exists.",
        StatusCodes.BAD_REQUEST
      );
    }

    const advertiserData = {
      user_id: req.user.id,
      website: req.body.website,
      hotline: req.body.hotline,
      company_profile: req.body.company_profile,
      mobile: req.body.mobile,
      profilePicture: req.body.profilePicture,
    };
    await User.findByIdAndUpdate(req.user.id, { isCompleted: true });

    const newAdvertiser = new Advertiser(advertiserData);
    await newAdvertiser.save();
    return newAdvertiser;
  }

  // Get All Advertiser Profiles with Pagination
  async getAllAdvertiserProfiles(req) {
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: Math.min(parseInt(req.query.limit, 10) || 10, MAX_LIMIT),
      sort: { createdAt: -1 },
      lean: true,
    };

    const advertisers = await Advertiser.paginate({}, options);
    return formatResponse(advertisers);
  }

  // Get Advertiser by ID
  async getAdvertiserById(id) {
    const advertiser = await Advertiser.findOne({ user_id: id }).lean();
    if (!advertiser) {
      throw new ApiError("Advertiser not found", StatusCodes.NOT_FOUND);
    }
    return advertiser;
  }

  //Update Advertiser Profile
  async updateAdvertiserProfile(req) {
    const { id } = req.params;
    const { website, hotline, company_profile, mobile, profilePicture } =
      req.body;

    const advertiser = await Advertiser.findOne({ user_id: id });
    if (!advertiser) {
      throw new ApiError("Advertiser not found", StatusCodes.NOT_FOUND);
    }

    if (advertiser.user_id.toString() !== req.user.id) {
      throw new ApiError(
        "You are not authorized to update this profile",
        StatusCodes.FORBIDDEN
      );
    }

    advertiser.website = website || advertiser.website;
    advertiser.hotline = hotline || advertiser.hotline;
    advertiser.company_profile = company_profile || advertiser.company_profile;
    advertiser.mobile = mobile || advertiser.mobile;
    advertiser.profilePicture = profilePicture || advertiser.profilePicture;

    await advertiser.save();
    return advertiser;
  }

  async getActivitiesForAdvertiser(userId) {
    const activities = await Activity.find({ advertiser_id: userId });
    return activities;
  }

  async requestAccountDeletion(advertiserId, userId, activityId) {
    const advertiser = await Advertiser.find({ user_id: userId });
    if (!advertiser) {
      throw new ApiError("Advertiser not found", StatusCodes.NOT_FOUND);
    }

    const activity = await Activity.find({ advertiser_id: userId });
    console.log(activity);
    if (activity.length > 0) {
      throw new ApiError(
        "Advertiser cannot request delete as you have an upcomming activity",
        StatusCodes.NOT_FOUND
      );
    }

    const user = await User.findByIdAndDelete(userId);
    // Mark the advertiser as requestDelete
    // user.requestDelete = true;
    // await user.save();
  }

  async getReport(userId, { month }) {
    const advertiser = await Advertiser.findById(userId);

    // Step 1: Find all activities by the advertiser
    const activities = await Activity.find({ advertiser_id: userId });

    if (activities.length === 0) {
      return { totalTourists: 0, activities: [] };
    }

    // Step 2: Prepare activity IDs
    const activityIds = activities.map((activity) => activity._id);

    // Step 3: Calculate the date filter based on month
    let dateFilter = {};
    if (month) {
      const currentYear = new Date().getFullYear();
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);
      dateFilter.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    }

    // Step 4: Count tickets grouped by activity and filtered by date range
    const ticketsCount = await Ticket.aggregate([
      {
        $match: {
          activity: { $in: activityIds },
          status: "Paid",
          ...dateFilter, // Apply date filter if month is provided
        },
      },
      { $group: { _id: "$activity", touristCount: { $sum: 1 } } },
    ]);

    // Step 5: Build the report
    let totalTourists = 0;
    const activityBreakdown = activities.map((activity) => {
      const ticketData = ticketsCount.find(
        (ticket) => ticket._id.toString() === activity._id.toString()
      );
      const touristCount = ticketData ? ticketData.touristCount : 0;
      totalTourists += touristCount;
      return {
        activityName: activity.name,
        touristCount,
      };
    });

    return {
      totalTourists,
      activities: activityBreakdown,
    };
  }

  async getAdvertiserReport(
    userId,
    { activityName, startDate, endDate, month }
  ) {
    const advertiser = await Advertiser.findById(userId);

    // Step 1: Find all activities by the advertiser and optionally filter by activity name
    const activityQuery = { advertiser_id: userId };
    if (activityName) {
      activityQuery.name = activityName;
    }
    const activities = await Activity.find(activityQuery);

    if (activities.length === 0) {
      return { totalTourists: 0, totalRevenue: 0, activities: [] };
    }

    // Step 2: Prepare activity IDs
    const activityIds = activities.map((activity) => activity._id);

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

    // Step 4: Count tickets grouped by activity and filtered by date range
    const ticketsCount = await Ticket.aggregate([
      {
        $match: {
          activity: { $in: activityIds },
          status: "Paid",
          ...dateFilter, // Apply date filter if provided
        },
      },
      {
        $group: {
          _id: "$activity",
          touristCount: { $sum: 1 },
          revenue: { $sum: "$price" },
        },
      },
    ]);

    // Step 5: Build the report
    let totalTourists = 0;
    let totalRevenue = 0;
    const activityBreakdown = activities.map((activity) => {
      const ticketData = ticketsCount.find(
        (ticket) => ticket._id.toString() === activity._id.toString()
      );
      const touristCount = ticketData ? ticketData.touristCount : 0;
      const revenue = ticketData ? ticketData.revenue : 0;
      totalTourists += touristCount;
      totalRevenue += revenue;
      return {
        activityName: activity.name,
        touristCount,
        revenue,
      };
    });

    return {
      totalTourists,
      totalRevenue,
      activities: activityBreakdown,
    };
  }
}

export default AdvertiserService;
