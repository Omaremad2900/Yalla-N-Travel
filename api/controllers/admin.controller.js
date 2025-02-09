import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

export const readProfile = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const adminService = await req.container.resolve("adminService");
    const admin = await adminService.readAdminProfile(adminId);

    res.status(StatusCodes.OK).json({ data: admin });
  } catch (error) {
    next(error);
  }
};

// Controller method to add a Tourism Governor given an adminId, username, password, email, and adminPassword.
export const addTourismGovernor = async (req, res, next) => {
  const { adminId, username, password, email, adminPassword } = req.body;

  try {
    const adminService = await req.container.resolve("adminService");
    const response = await adminService.createTourismGovernor(
      adminId,
      username,
      password,
      email,
      adminPassword
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: response.message,
      newUser: response.newUser,
    });
  } catch (error) {
    next(error);
  }
};

// Controller method for adding an admin
export const addAdmin = async (req, res, next) => {
  const { adminId, username, password, email, adminPassword } = req.body;

  try {
    const adminService = await req.container.resolve("adminService");
    const response = await adminService.createAdmin(
      adminId,
      username,
      password,
      email,
      adminPassword
    );
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: response.message,
      newAdmin: response.newAdmin,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteAccountController = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;

    const adminService = await req.container.resolve("adminService");
    const result = await adminService.deleteAccount(req.user.id, targetUserId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const flagInappItinerary = async (req, res, next) => {
  const { itineraryId } = req.body; // Itinerary ID

  const adminService = await req.container.resolve("adminService");

  try {
    const flaggedItinerary = await adminService.flagItinerary(itineraryId);

    res.status(200).json({
      success: true,
      message: `Itinerary with id ${itineraryId} was flagged successfully`,
      itinerary: flaggedItinerary,
    });
  } catch (error) {
    next(error);
  }
};

export const flagInappActivity = async (req, res, next) => {
  const { activityId } = req.body; // Itinerary ID

  const adminService = req.container.resolve("adminService");

  try {
    const flaggedActivity = await adminService.flagActivity(activityId);

    res.status(200).json({
      success: true,
      message: `Activity with id ${activityId} was flagged successfully`,
      activity: flaggedActivity,
    });
  } catch (error) {
    next(error);
  }
};

export const viewUploadedUserDocuments = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const adminService = await req.container.resolve("adminService");
    const userDocuments = await adminService.getUserDocumentsById(userId);

    res.status(StatusCodes.OK).json(userDocuments);
  } catch (error) {
    next(error);
  }
};

export const viewReqUsersForDeletion = async (req, res, next) => {
  try {
    const adminService = await req.container.resolve("adminService");
    const reqUsers = await adminService.viewUsersRequestingDelete();
    res.status(StatusCodes.OK).json(reqUsers);
  } catch (err) {
    next(err);
  }
};

export const listComplaints = async (req, res, next) => {
  try {
    const adminService = await req.container.resolve("adminService");

    const { status, sort = "desc" } = req.query;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const response = await adminService.listComplaints(
      page,
      limit,
      sort,
      status
    );

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const getComplaintDetails = async (req, res, next) => {
  const { complaintId } = req.params;
  try {
    const adminService = await req.container.resolve("adminService");
    const complaint = await adminService.getComplaintDetails(complaintId);
    res.status(StatusCodes.OK).json(complaint);
  } catch (error) {
    next(error);
  }
};

export const updateComplaintStatus = async (req, res, next) => {
  const complaintId = req.params.complaintId;
  const { status } = req.body;

  try {
    const adminService = await req.container.resolve("adminService");
    const response = await adminService.updateComplaintStatus(
      complaintId,
      status
    );
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const replyToComplaint = async (req, res, next) => {
  const complaintId = req.params.complaintId;
  const { replyText } = req.body;
  // const adminEmail = req.user.email;
  const adminEmail = "ismaielnagaty@live.com";

  try {
    const adminService = await req.container.resolve("adminService");
    const response = await adminService.replyToComplaint(
      complaintId,
      adminEmail,
      replyText
    );
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const adminService = await req.container.resolve("adminService");
    const userStats = await adminService.getUserStatistics();
    res.status(StatusCodes.OK).json({ data: userStats });
  } catch (error) {
    next(error);
  }
};
// export const flagInappActivity = async (req, res, next) => {
//   const { activityId } = req.body; // Itinerary ID

//   const adminService = req.container.resolve("adminService");

//   try {
//     const flaggedActivity = await adminService.flagActivity(activityId);

//     res.status(200).json({
//       success: true,
//       message:`Activity with id ${activityId} was flagged successfully`,
//       activity: flaggedActivity,
//     });
//   } catch (error) {
//     // Handle known ApiErrors and pass them to the next middleware
//     if (error instanceof ApiError) {
//       return next(error);
//     }

//     // Handle unexpected errors
//     return next(
//       new ApiError(
//         "An unexpected error occurred",
//         StatusCodes.INTERNAL_SERVER_ERROR
//       )
//     );
//   }
// };

export const createPromoCode = async (req, res, next) => {
  const { name, discountPercentage, expirationDate } = req.body;

  try {
    const promoCodeService = req.container.resolve("adminService");
    const response = await promoCodeService.createPromoCode(
      name,
      discountPercentage,
      expirationDate
    );

    res.status(StatusCodes.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateExpirationDate = async (req, res, next) => {
  const { promoCodeId } = req.params;
  const { newExpirationDate } = req.body;

  try {
    const promoCodeService = req.container.resolve("adminService");
    const response = await promoCodeService.updateExpirationDate(
      promoCodeId,
      newExpirationDate
    );

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const deactivatePromoCode = async (req, res, next) => {
  const { promoCodeId } = req.params; // Promo code ID from URL parameters

  try {
    const promoCodeService = req.container.resolve("adminService");
    const response = await promoCodeService.deactivatePromoCode(promoCodeId);

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const listPromoCodes = async (req, res, next) => {
  try {
    const promoCodeService = req.container.resolve("adminService");
    const promoCodes = await promoCodeService.listPromoCodes();

    res.status(StatusCodes.OK).json(promoCodes);
  } catch (error) {
    next(error);
  }
};

export const getPromoCodeById = async (req, res, next) => {
  const { promoCodeId } = req.params;

  try {
    const promoCodeService = req.container.resolve("adminService");
    const promoCode = await promoCodeService.getPromoCodeById(promoCodeId);

    res.status(StatusCodes.OK).json(promoCode);
  } catch (error) {
    next(error);
  }
};

export const getTotalRevenue = asyncHandler(async (req, res, next) => {
  try {
    const { productName, startDate, endDate, month } = req.query;
    const adminService = await req.container.resolve("adminService");
    const revenueReport = await adminService.getTotalRevenue({
      productName,
      startDate,
      endDate,
      month,
    });
    res.status(StatusCodes.OK).json({ data: revenueReport });
  } catch (error) {
    next(error);
  }
});
