import adminModel from "../models/admin.model.js";
import User from "../models/user.model.js";
import TourGuide from "../models/tourGuide.model.js";
import Itinerary from "../models/itinerary.model.js";
import Complaint from "../models/complaint.model.js";
import Advertiser from "../models/advertiser.model.js";
import Tourist from "../models/tourist.model.js";
import Activity from "../models/activity.model.js";
import PromoCode from "../models/promoCode.model.js";
import ApiError from "../utils/apiError.js";
import { sendComplaintReplyEmail } from "../utils/Jobs/mailer.js";
import bcrypt from "bcryptjs";
import {
  sendAppNotification,
  sendAcceptanceEmail,
} from "../utils/Jobs/mailer.js";
import { scheduleFlaggedNotification } from "../utils/Jobs/agenda.js";
import { StatusCodes } from "http-status-codes";
import { Admin } from "mongodb";
import Ticket from "../models/ticket.model.js";
import Product from "../models/product.model.js";
// Service class to handle business logic
class AdminService {
  // Service method for creating an admin
  async createAdmin(adminId, username, password, email, adminPassword) {
    // Step 1: Find the admin who is trying to create a new admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "Admin") {
      throw new ApiError(
        "Admin not found or no permission",
        StatusCodes.NOT_FOUND
      );
    }

    // Step 2: Verify the admin's password
    const isMatch = await bcrypt.compare(adminPassword, admin.password);
    if (!isMatch) {
      throw new ApiError("Invalid admin password", StatusCodes.UNAUTHORIZED);
    }

    // Step 3: Check if username or email already exists
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError("Username already taken", StatusCodes.CONFLICT);
    }
    if (existingEmail) {
      throw new ApiError("Email already in use", StatusCodes.CONFLICT);
    }

    // Step 4: Hash the new admin's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Create a new admin user in the User model
    const newAdminUser = new User({
      username,
      password: hashedPassword,
      email,
      role: "Admin",
      isCompleted: true,
      isAccepted: true,
    });
    await newAdminUser.save();

    // Step 6: Create an entry in the Admin model and associate it with the new admin user
    const newAdmin = new adminModel({
      user: newAdminUser._id, // Associate with the user ID
    });
    await newAdmin.save();

    // Step 7: Return success message with the new admin's details
    return { message: "Admin created successfully", newAdminUser };
  }

  async readAdminProfile(adminId) {
    const admin = await User.findById(adminId);
    if (!admin) {
      throw new ApiError("Admin doesnt Exist", 404);
    }
    return admin;
  }
  // Service class method to add a Tourism Governor given an adminId, username, password, email, and adminPassword.
  async createTourismGovernor(
    adminId,
    username,
    password,
    email,
    adminPassword
  ) {
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "Admin") {
      throw new ApiError("Admin not found", StatusCodes.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(adminPassword, admin.password);
    if (!isMatch) {
      throw new ApiError("Invalid password", StatusCodes.UNAUTHORIZED);
    }

    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError("Username already taken", StatusCodes.CONFLICT);
    }
    if (existingEmail) {
      throw new ApiError("Email already in use", StatusCodes.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      role: "Tourism Governor",
      isCompleted: true,
      isAccepted: true,
      isAccepted: true,
    });

    await newUser.save();

    return { message: "Tourism Governor created successfully", newUser };
  }

  // Business logic to delete any user account given an ID
  async deleteAccount(adminId, targetUserId) {
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "Admin") {
      throw new ApiError(
        "Admin not found or no permission",
        StatusCodes.NOT_FOUND
      );
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      throw new ApiError("User not found", StatusCodes.NOT_FOUND);
    }

    await User.findByIdAndDelete(targetUserId);
    return { message: "User deleted successfully" };
  }

  async flagItinerary(itineraryId) {
    const itinerary = await Itinerary.findById(itineraryId).populate({
      path: "tourGuideId",
      select: "email username", // Fetch only the fields you need
    });

    if (!itinerary) {
      throw new ApiError("Itinerary not found", StatusCodes.NOT_FOUND);
    }

    if (itinerary.isFlagged) {
      throw new ApiError("Itinerary is already flagged", StatusCodes.CONFLICT);
    }

    const tourGuide = itinerary.tourGuideId;

    if (!tourGuide) {
      throw new ApiError("Tour Guide not found", StatusCodes.NOT_FOUND);
    }

    // Flag the itinerary
    const flaggedItinerary = await Itinerary.findByIdAndUpdate(
      itineraryId,
      { isFlagged: true },
      { new: true }
    );

    const subject = "Flagged Itinerary";
    const message = `Itinerary ${itinerary.title} has been flagged by an Admin`;

    // Send notification
    try {
      // Send notification to the tour guide using their userId
      scheduleFlaggedNotification(itineraryId);
    } catch (err) {
      console.log(err.message);
      throw new ApiError(
        "Failed to send notification to tour guide",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // Send email notification
    try {
      await sendAcceptanceEmail(tourGuide.email, subject, message);
    } catch (err) {
      throw new ApiError(
        "Failed to send flagged itinerary email",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return flaggedItinerary;
  }

  async flagActivity(activityId) {
    // Fetch the activity and populate the advertiser details
    const activity = await Activity.findById(activityId);

    // Check if the activity exists
    if (!activity) {
      throw new ApiError("Activity not found", StatusCodes.NOT_FOUND);
    }

    // Check if the activity is already flagged
    if (activity.isFlagged) {
      throw new ApiError("Activity is already flagged", StatusCodes.CONFLICT);
    }

    // Ensure advertiser and user exist
    const advertiser = await Advertiser.findOne({
      user_id: activity.advertiser_id,
    }).populate({
      path: "user_id",
      select: "email username", // Fetch only the fields you need
    });
    console.log(`ad: ${advertiser}`);
    if (!advertiser) {
      throw new ApiError(
        "Advertiser not found for activity",
        StatusCodes.NOT_FOUND
      );
    }

    const user = advertiser.user_id;
    console.log(`user: ${user}`);
    // Flag the activity
    activity.isFlagged = true;
    await activity.save();

    // Prepare email content
    const subject = "Activity Flagged Notification";
    const message = `Dear ${user.username},\n\nThe activity "${activity.name}" has been flagged by an administrator. Please review the activity for compliance.\n\nBest regards,\nAdmin Team`;
    try {
      // Assume scheduleFlaggedNotification exists
      scheduleFlaggedNotification(null, activityId);
    } catch (err) {
      console.error("Failed to schedule notification:", err);
    }
    // Send the email to the user
    try {
      await sendAcceptanceEmail(user.email, subject, message);
    } catch (err) {
      console.error("Failed to send email:", err);
      throw new ApiError(
        "Failed to send flagged activity email",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    return activity;
  }

  async getUserDocumentsById(userId) {
    const user = await User.findById(userId).select(
      "username email role nationalId credentials"
    );
    if (!user) {
      throw new ApiError("User not found", StatusCodes.NOT_FOUND);
    }
    if (user.nationalId == null || user.credentials == null) {
      throw new ApiError(
        `User with id ${userId} has yet to upload their documents`,
        StatusCodes.BAD_REQUEST
      );
    }

    return {
      username: user.username,
      email: user.email,
      role: user.role,
      nationalId: user.nationalId,
      credentials: user.credentials,
    };
  }

  async viewUsersRequestingDelete() {
    const users = await User.find({ requestDelete: true });
    return users;
  }

  // Service method to get all complaints with pagination metadata
  async listComplaints(page = 1, limit = 10, sort = "desc", status) {
    const skip = (page - 1) * limit;

    const query = status ? { status } : {};

    const complaints = await Complaint.find(query, "title status date")
      .sort({ date: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const totalComplaints = await Complaint.countDocuments(query);
    const totalPages = Math.ceil(totalComplaints / limit);

    return {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalComplaints,
      complaints: complaints,
    };
  }

  // Service method to get complaint details
  async getComplaintDetails(complaintId) {
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      throw new ApiError("Complaint not found", StatusCodes.NOT_FOUND);
    }

    const tourist = await Tourist.findOne({ user: complaint.tourist });
    if (!tourist) {
      throw new ApiError("Tourist not found", StatusCodes.NOT_FOUND);
    }
    complaint.tourist = tourist;

    return complaint;
  }

  // Service method to toggle complaint status
  async updateComplaintStatus(complaintId, status) {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      throw new ApiError("Complaint not found", StatusCodes.NOT_FOUND);
    }
    status = status.toLowerCase();
    if (!["pending", "resolved"].includes(status)) {
      throw new ApiError("Invalid status value", StatusCodes.BAD_REQUEST);
    }
    complaint.status = status;
    await complaint.save();
    return { message: `Complaint marked as ${status}` };
  }

  // Service method to send reply to complaint
  async replyToComplaint(complaintId, adminEmail, replyText) {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      throw new ApiError("Complaint not found", StatusCodes.NOT_FOUND);
    }

    const tourist = await Tourist.findOne({ user: complaint.tourist });
    if (!tourist) {
      throw new ApiError("Tourist not found", StatusCodes.NOT_FOUND);
    }
    complaint.tourist = tourist;

    const user = await User.findOne(tourist.user);
    if (!user) {
      throw new ApiError("User not found", StatusCodes.NOT_FOUND);
    }

    const subject = `Response to your complaint: ${complaint.title}`;
    await sendComplaintReplyEmail(user.email, subject, replyText, adminEmail);

    return { message: "Reply sent to tourist email" };
  }

  // async flagActivity(activityId) {
  //   const activity = await Activity.findById(activityId);
  //   if (!activity) {
  //     throw new ApiError("Activity not found", StatusCodes.NOT_FOUND);
  //   }
  //   if (activity.isFlagged) {
  //     throw new ApiError("Activity is already flagged", StatusCodes.CONFLICT);
  //   }
  //   const flaggedActivity = await Activity.findByIdAndUpdate(
  //     activityId,
  //     { isFlagged: true },
  //     { new: true }
  //   );

  //   await flaggedActivity.save();
  //   return flaggedActivity;
  // }

  async getUserStatistics() {
    const totalUsers = await User.countDocuments();
    const pipeline = [
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];
    const newUsersPerMonth = await User.aggregate(pipeline);

    const formattedResult = newUsersPerMonth.map((item) => ({
      month: item._id, // Month number
      count: item.count, // User count
    }));

    return {
      totalUsers,
      newUsersPerMonth: formattedResult,
    };
  }

  // Service method to create a promo code
  async createPromoCode(name, discountPercentage, expirationDate) {
    const discountMultiplier = 1 - discountPercentage / 100;

    if (discountMultiplier <= 0 || discountMultiplier > 1) {
      throw new ApiError(
        "Invalid discount percentage",
        StatusCodes.BAD_REQUEST
      );
    }

    const existingPromoCode = await PromoCode.findOne({ name });
    if (existingPromoCode) {
      throw new ApiError("Promo code already exists", StatusCodes.CONFLICT);
    }

    const promoCode = new PromoCode({
      name,
      discountMultiplier,
      expirationDate: expirationDate || null,
    });

    await promoCode.save();

    return { message: "Promo code created successfully", promoCode };
  }

  // Service method to get a promo code by its ID
  async getPromoCodeById(promoCodeId) {
    const promoCode = await PromoCode.findById(promoCodeId);
    if (!promoCode) {
      throw new ApiError("Promo code not found", StatusCodes.NOT_FOUND);
    }

    return promoCode;
  }

  // Service method to update the expiration date of a promo code
  async updateExpirationDate(promoCodeId, newExpirationDate) {
    const promoCode = await PromoCode.findById(promoCodeId);
    if (!promoCode) {
      throw new ApiError("Promo code not found", StatusCodes.NOT_FOUND);
    }

    promoCode.expirationDate = newExpirationDate || null;
    promoCode.isExpired = false;

    await promoCode.save();
    return { message: "Expiration date updated successfully", promoCode };
  }

  // Service method to deactivate a promo code
  async deactivatePromoCode(promoCodeId) {
    const promoCode = await PromoCode.findById(promoCodeId);
    if (!promoCode) {
      throw new ApiError("Promo code not found", StatusCodes.NOT_FOUND);
    }

    promoCode.isActive = false;
    await promoCode.save();
    return { message: "Promo code deactivated successfully", promoCode };
  }

  // Service method to list all promo codes
  async listPromoCodes() {
    return await PromoCode.find({});
  }

  async getTotalRevenue({ productName, startDate, endDate, month }) {
    const ticketQuery = { status: "Paid" };
    const productQuery = {};

    if (startDate || endDate) {
      ticketQuery.createdAt = {};
      productQuery.createdAt = {};
      if (startDate) {
        ticketQuery.createdAt.$gte = new Date(startDate);
        productQuery.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        ticketQuery.createdAt.$lte = new Date(endDate);
        productQuery.createdAt.$lte = new Date(endDate);
      }
    }

    if (month) {
      const currentYear = new Date().getFullYear();
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);
      ticketQuery.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
      productQuery.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    }

    if (productName) {
      productQuery.name = productName;
    }

    // Calculate revenue from tickets (activities and itineraries)
    const tickets = await Ticket.find(ticketQuery);
    const activityRevenue = tickets
      .filter((ticket) => ticket.activity)
      .reduce((total, ticket) => total + ticket.price * 0.1, 0);
    const itineraryRevenue = tickets
      .filter((ticket) => ticket.itinerary)
      .reduce((total, ticket) => total + ticket.price * 0.1, 0);

    // Calculate revenue from products
    const products = await Product.find(productQuery);
    const productRevenue = products.reduce(
      (total, product) => total + product.price * product.salesCount,
      0
    );

    const totalRevenue = activityRevenue + itineraryRevenue + productRevenue;

    return {
      activityRevenue,
      itineraryRevenue,
      productRevenue,
      totalRevenue,
    };
  }
}

export default AdminService;
