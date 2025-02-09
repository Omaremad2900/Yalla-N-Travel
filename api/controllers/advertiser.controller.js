import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";

export const getMyActivities = async (req, res, next) => {
  try {
    const activities = await req.container
      .resolve("activityService")
      .getMyActivities(req);
    res.status(StatusCodes.OK).json(activities);
  } catch (error) {
    console.error("Error retrieving activities:", error);
    next(error);
  }
};

export const createActivity = async (req, res, next) => {
  try {
    const newActivity = await req.container
      .resolve("activityService")
      .createActivity(req);
    res.status(StatusCodes.CREATED).json(newActivity);
  } catch (error) {
    console.error("Error creating activity:", error);
    next(error);
  }
};

export const getActivityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const activity = await req.container
      .resolve("activityService")
      .getActivityById(id);
    res.status(StatusCodes.OK).json(activity);
  } catch (error) {
    console.error("Error retrieving activity by ID:", error);
    next(error);
  }
};

export const updateActivity = async (req, res, next) => {
  try {
    const updatedActivity = await req.container
      .resolve("activityService")
      .updateActivity(req);
    res.status(StatusCodes.OK).json(updatedActivity);
  } catch (error) {
    console.error("Error updating activity:", error);
    next(error);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const result = await req.container
      .resolve("activityService")
      .deleteActivity(req);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error("Error deleting activity:", error);
    next(error);
  }
};

export const createAdvertiserProfile = async (req, res, next) => {
  try {
    const newAdvertiser = await req.container
      .resolve("advertiserService")
      .createAdvertiserProfile(req);
    res.status(StatusCodes.CREATED).json(newAdvertiser);
  } catch (error) {
    console.error("Error creating advertiser profile:", error);
    next(error);
  }
};

export const getAllAdvertiserProfiles = async (req, res, next) => {
  try {
    const advertisers = await req.container
      .resolve("advertiserService")
      .getAllAdvertiserProfiles(req);
    res.status(StatusCodes.OK).json(advertisers);
  } catch (error) {
    console.error("Error retrieving advertiser profiles:", error);
    next(error);
  }
};

export const getAdvertiserById = async (req, res, next) => {
  try {
    console.log(req.user.id);
    const advertiser = await req.container
      .resolve("advertiserService")
      .getAdvertiserById(req.user.id);
    res.status(StatusCodes.OK).json(advertiser);
  } catch (error) {
    console.error("Error retrieving advertiser by ID:", error);
    next(error);
  }
};

export const updateAdvertiserProfile = async (req, res, next) => {
  try {
    const updatedAdvertiser = await req.container
      .resolve("advertiserService")
      .updateAdvertiserProfile(req);
    res.status(StatusCodes.OK).json(updatedAdvertiser);
  } catch (error) {
    console.error("Error updating advertiser profile:", error);
    next(error);
  }
};

export const getActivitiesForUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const activitiesService = await req.container.resolve("advertiserService");
    const activities = await activitiesService.getActivitiesForAdvertiser(
      userId
    );
    console.log(`activities: ${activities}`);

    res.status(StatusCodes.OK).json(activities);
  } catch (err) {
    next(err);
  }
};

export const requestDeleteAdvertiser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const advertiserService = await req.container.resolve("advertiserService");

    const advertiser = await advertiserService.getAdvertiserById(userId);
    const advertiserId = advertiser._id;

    const activityId = await advertiserService.getActivitiesForAdvertiser(
      userId
    );

    const requestDeleteAdvertiser =
      await advertiserService.requestAccountDeletion(
        advertiserId,
        userId,
        activityId
      );

    res.status(StatusCodes.OK).json({
      data: requestDeleteAdvertiser,
      message: "Account Deleted",
    });
  } catch (err) {
    next(err);
  }
};

export const getReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { month } = req.query;

    const advertiserService = await req.container.resolve("advertiserService");
    const report = await advertiserService.getReport(userId, {
      month: month ? parseInt(month, 10) : undefined,
    });

    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
};

export const getAdvReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { activityName, startDate, endDate, month } = req.query;

    const advertiserService = await req.container.resolve("advertiserService");
    const report = await advertiserService.getAdvertiserReport(userId, {
      activityName,
      startDate,
      endDate,
      month: month ? parseInt(month, 10) : undefined,
    });

    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
};
