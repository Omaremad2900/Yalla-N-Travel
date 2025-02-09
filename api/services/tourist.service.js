import Tourist from "../models/tourist.model.js";
import User from "../models/user.model.js";
import Ticket from "../models/ticket.model.js";
import apiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import Complaint from "../models/complaint.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import mongoose from "mongoose";

class TouristService {
  constructor({
    userService,
    itineraryService,
    activityService,
    tourGuideService,
  }) {
    this.userService = userService; // Injected userService
    this.itineraryService = itineraryService; // Injected itineraryService
    this.activityService = activityService; // Injected activityService
    this.tourGuideService = tourGuideService; // Injected TourGuideService
  }

  // Create a new tourist
  async createTourist(touristData) {
    try {
      const { userId, nationality, occupationStatus, mobileNumber } =
        touristData;

      // Find the associated user using the injected UserService
      const user = await this.userService.findUserById(userId);

      if (!user) {
        throw new apiError("User not found", StatusCodes.NOT_FOUND);
      }

      const tourist = new Tourist({
        user: user._id,
        nationality,
        occupationStatus,
        mobileNumber,
      });

      await tourist.save();
      return tourist;
    } catch (error) {
      throw new apiError(error.message, StatusCodes.BAD_REQUEST);
    }
  }

  // Find a tourist by user ID
  async findTouristByUserId(userId) {
    try {
      const tourist = await Tourist.findOne({ user: userId }).populate("user");
      if (!tourist) {
        throw new apiError("Tourist not found", StatusCodes.NOT_FOUND);
      }
      return tourist;
    } catch (error) {
      throw new apiError("Tourist not found", StatusCodes.NOT_FOUND);
    }
  }

  // Update tourist by user ID
  async updateTourist(userId, updateData) {
    try {
      if (updateData.user?.username) {
        delete updateData.user.username;
        return next(
          new apiError(
            "Cannot update tourist username",
            StatusCodes.BAD_REQUEST
          )
        );
      }
      if (updateData.user?.wallet) {
        delete updateData.user.wallet;
        return next(
          new apiError("Cannot update wallet", StatusCodes.BAD_REQUEST)
        );
      }
      const updatedTourist = await Tourist.findOneAndUpdate(
        { user: userId },
        updateData,
        { new: true, runValidators: true }
      ).populate("user");
      return updatedTourist;
    } catch (error) {
      throw new apiError("Unable to update tourist", StatusCodes.BAD_REQUEST);
    }
  }

  // Delete tourist by user ID
  async deleteTourist(userId) {
    try {
      await Tourist.findOneAndDelete({ user: userId });
      return { message: "Tourist deleted successfully" };
    } catch (error) {
      throw new apiError("Unable to delete tourist", StatusCodes.BAD_REQUEST);
    }
  }
  // Rate an itinerary made by a tour guide which I followed with that tour guide
  async rateItinerary(itineraryId, rating) {
    try {
      // Fetch the itinerary by ID
      const itinerary = await this.itineraryService.getItinerary(itineraryId);
      if (!itinerary) {
        throw new apiError("Itinerary not found", StatusCodes.NOT_FOUND);
      }

      // Ensure ratingsCount is initialized
      if (
        typeof itinerary.ratingsCount !== "number" ||
        isNaN(itinerary.ratingsCount)
      ) {
        itinerary.ratingsCount = 0;
      }

      // Ensure ratings is initialized
      if (typeof itinerary.ratings !== "number" || isNaN(itinerary.ratings)) {
        itinerary.ratings = 0;
      }

      // Increment the ratings count
      itinerary.ratingsCount++;

      // Calculate the new average rating
      const initialRatings = itinerary.ratings;
      const currentRating = (initialRatings + rating) / itinerary.ratingsCount;

      // Log the values to check if there's any issue
      console.log("Initial Ratings:", initialRatings);
      console.log("Submitted Rating:", rating);
      console.log("Ratings Count:", itinerary.ratingsCount);
      console.log("Calculated Current Rating:", currentRating);

      // Update the itinerary with the new rating
      itinerary.ratings = currentRating;

      // Save the updated itinerary
      const updatedItinerary = await this.itineraryService.updateItinerary(
        itineraryId,
        itinerary
      );

      return updatedItinerary;
    } catch (error) {
      console.error("Error during rating:", error);
      throw new apiError("Unable to rate itinerary", StatusCodes.BAD_REQUEST);
    }
  }
  //Comment on an itinerary made by a tour guide which I followed with that tour guide
  async commentItinerary(itineraryId, username, comment) {
    try {
      // Fetch the itinerary by ID
      const itinerary = await this.itineraryService.getItinerary(itineraryId);
      if (!itinerary) {
        throw new apiError("Itinerary not found", StatusCodes.NOT_FOUND);
      }

      // Ensure comments is initialized
      if (!Array.isArray(itinerary.comments)) {
        itinerary.comments = [];
      }

      // Add the new comment
      itinerary.comments.push({ username, comment });

      // Save the updated itinerary
      const updatedItinerary = await this.itineraryService.updateItinerary(
        itineraryId,
        itinerary
      );

      return updatedItinerary;
    } catch (error) {
      console.error("Error during commenting:", error);
      throw new apiError(
        "Unable to comment on itinerary",
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async commentTourGuide(tourGuideId, username, comment) {
    try {
      const tourGuide = await this.tourGuideService.getById(tourGuideId);

      if (!tourGuide) {
        throw new apiError("tourGuide not found", StatusCodes.NOT_FOUND);
      }

      if (!Array.isArray(tourGuide.comments)) {
        tourGuide.comments = [];
      }

      tourGuide.comments.push({ username, comment });

      const updatedTourGuide = await this.tourGuideService.update(
        tourGuideId,
        tourGuide
      );

      return updatedTourGuide;
    } catch (error) {
      console.error("Error during commenting:", error);
      throw new apiError(
        "Unable to comment on TourGuide",
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async rateTourGuide(tourGuideId, rating) {
    try {
      const tourGuide = await this.tourGuideService.getById(tourGuideId);

      console.log("found tour!");

      if (!tourGuide) {
        throw new apiError("TourGuide not found", StatusCodes.NOT_FOUND);
      }

      if (
        typeof tourGuide.ratingsCount !== "number" ||
        isNaN(tourGuide.ratingsCount)
      ) {
        tourGuide.ratingsCount = 0;
      }

      if (typeof tourGuide.ratings !== "number" || isNaN(tourGuide.ratings)) {
        tourGuide.ratings = 0;
      }

      tourGuide.ratingsCount++;

      const initialRatings = tourGuide.ratings;
      const currentRating = (initialRatings + rating) / tourGuide.ratingsCount;

      console.log("Initial Ratings:", initialRatings);
      console.log("Submitted Rating:", rating);
      console.log("Ratings Count:", tourGuide.ratingsCount);
      console.log("Calculated Current Rating:", currentRating);

      tourGuide.ratings = currentRating;

      const updatedTourGuide = await this.tourGuideService.update(
        tourGuideId,
        tourGuide
      );

      return updatedTourGuide;
    } catch (error) {
      console.error("Error during rating:", error);
      throw new apiError("Unable to rate TourGuide", StatusCodes.BAD_REQUEST);
    }
  }

  //As a Tourist I should be Rate an activity that I attended
  async rateActivity(activityId, rating) {
    try {
      // Fetch the activity by ID
      const activity = await this.activityService.getById(activityId);
      if (!activity) {
        throw new apiError("Activity not found", StatusCodes.NOT_FOUND);
      }

      // Ensure ratingsCount is initialized
      if (
        typeof activity.ratingsCount !== "number" ||
        isNaN(activity.ratingsCount)
      ) {
        activity.ratingsCount = 0;
      }

      // Ensure ratings is initialized
      if (typeof activity.ratings !== "number" || isNaN(activity.ratings)) {
        activity.ratings = 0;
      }

      // Increment the ratings count
      activity.ratingsCount++;

      // Calculate the new average rating
      const initialRatings = activity.ratings;
      const currentRating = (initialRatings + rating) / activity.ratingsCount;

      // Log the values to check if there's any issue
      console.log("Initial Ratings:", initialRatings);
      console.log("Submitted Rating:", rating);
      console.log("Ratings Count:", activity.ratingsCount);
      console.log("Calculated Current Rating:", currentRating);

      // Update the activity with the new rating
      activity.ratings = currentRating;

      // Save the updated activity
      const updatedActivity = await this.activityService.update(
        activityId,
        activity
      );

      return updatedActivity;
    } catch (error) {
      console.error("Error during rating:", error);
      throw new apiError("Unable to rate activity", StatusCodes.BAD_REQUEST);
    }
  }

  // As a Tourist I should be Comment on an activity that I attended
  async commentActivity(activityId, username, comment) {
    try {
      // Fetch the activity by ID
      const activity = await this.activityService.getById(activityId);
      if (!activity) {
        throw new apiError("Activity not found", StatusCodes.NOT_FOUND);
      }

      // Ensure comments is initialized
      if (!Array.isArray(activity.comments)) {
        activity.comments = [];
      }

      // Add the new comment
      activity.comments.push({ username, comment });

      // Save the updated activity
      const updatedActivity = await this.activityService.update(
        activityId,
        activity
      );

      return updatedActivity;
    } catch (error) {
      console.error("Error during commenting:", error);
      throw new apiError(
        "Unable to comment on activity",
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async setPreference(userId, touristId, preferences) {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      throw new apiError(`Tourist was not found`, StatusCodes.NOT_FOUND);
    }
    tourist.preferences = preferences;
    await tourist.save();
  }

  async getTouristPreferences(userId, touristId) {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      throw new apiError(`Tourist was not found`, StatusCodes.NOT_FOUND);
    }
    return tourist.preferences;
  }

  async getTicketsForTourist(userId) {
    const tickets = await Ticket.find({ assignee: userId, status: "Paid" });

    return tickets;
  }

  async requestAccountDeletion(touristId, userId, ticketId) {
    const tourist = await Tourist.findById(touristId);
    const user = await User.findById(userId);

    if (!tourist) {
      throw new apiError(`Tourist was not found`, StatusCodes.NOT_FOUND);
    }
    const ticket = await Ticket.findById(ticketId);
    if (ticket) {
      throw new apiError(
        "Cannot request account deletion. Tourist has a ticket assigned",
        StatusCodes.CONFLICT
      );
    }

    const userDeleted = await User.findByIdAndDelete(userId);
  }

  // Service method to assign badge level
  async getBadgeLevel(touristId) {
    const tourist = await Tourist.findOne({ user: touristId });
    if (!tourist) {
      throw new apiError("Tourist not found", StatusCodes.NOT_FOUND);
    }

    let level;
    if (tourist.loyaltyPoints <= 100000) {
      level = 1;
    } else if (tourist.loyaltyPoints <= 500000) {
      level = 2;
    } else {
      level = 3;
    }

    if (tourist.level !== level) {
      tourist.level = level;
      await tourist.save();
    }

    return level;
  }

  // Service method to redeem points
  async redeemPoints(touristId, pointsToRedeem) {
    const tourist = await Tourist.findOne({ user: touristId });

    if (!tourist) {
      throw new apiError("Tourist not found", StatusCodes.NOT_FOUND);
    }

    if (typeof pointsToRedeem !== "number" || isNaN(pointsToRedeem)) {
      throw new apiError("Invalid points to redeem", StatusCodes.BAD_REQUEST);
    }

    tourist.wallet = tourist.wallet || 0;
    tourist.loyaltyPoints = tourist.loyaltyPoints || 0;

    if (tourist.loyaltyPoints < pointsToRedeem || pointsToRedeem < 10000) {
      throw new apiError(
        "Insufficient points: You must redeem at least 10,000 points for 100 EGP",
        StatusCodes.BAD_REQUEST
      );
    }

    // const redeemAmount = Math.floor(pointsToRedeem / 10000) * 100; EGP
    const redeemAmount = pointsToRedeem * 0.0002; // Dollar Equivalent to EGP: $1 = 50 EGP
    tourist.wallet = Math.max(tourist.wallet + redeemAmount, 0);
    tourist.loyaltyPoints = Math.max(tourist.loyaltyPoints - pointsToRedeem, 0);

    console.log("Final wallet:", tourist.wallet);
    console.log("Final loyalty points:", tourist.loyaltyPoints);

    await tourist.save();
    return {
      wallet: tourist.wallet,
      loyaltyPoints: tourist.loyaltyPoints,
      redeemedAmount: redeemAmount,
    };
  }

  // Service method to file a complaint
  async fileComplaint(touristId, title, body) {
    const tourist = await Tourist.findOne({ user: touristId });
    if (!tourist) {
      throw new apiError("Tourist not found", StatusCodes.NOT_FOUND);
    }

    const newComplaint = await Complaint.create({
      title,
      body,
      tourist: touristId,
      date: new Date(),
    });

    return newComplaint;
  }
  async getMyComplaints(tourist, page = 1, limit = 2) {
    const skip = (page - 1) * limit;
    const complaints = await Complaint.find({ tourist })
      .select("title status")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    const totalComplaints = await Complaint.find({ tourist }).countDocuments();

    return {
      complaints,
      pagination: {
        total: totalComplaints,
        page,
        limit,
        totalPages: Math.ceil(totalComplaints / limit),
      },
    };
  }

  async getPurchasedProducts(touristId, page = 1, limit = 10) {
    try {
      // Fetch orders that match the touristId (same as before)
      const orders = await Order.find({}).populate({
        path: "cart",
        match: { user: touristId }, // Only populate carts where user matches touristId
        populate: {
          path: "products.productId",
          model: "Product", // Populate the product details
          populate: {
            path: "seller", // Populate the seller field inside the Product model
            model: "User", // Adjust the model name if different
          },
        },
      });

      const productMap = new Map(); // Map to store unique products
      const purchasedProducts = [];

      // Extract products from orders where cart is populated (i.e., cart.user matched)
      orders.forEach((order) => {
        if (order.cart) {
          order.cart.products.forEach((cartItem) => {
            const productId = cartItem.productId._id.toString(); // Get product ID as a string
            if (!productMap.has(productId)) {
              productMap.set(productId, cartItem.productId); // Add unique product to map
            }
          });
        }
      });

      // Convert map values to an array of purchased products
      const allPurchasedProducts = [...productMap.values()];

      // Pagination logic: apply limit and skip to the final list of purchased products
      const skip = (page - 1) * limit;
      const paginatedProducts = allPurchasedProducts.slice(skip, skip + limit);

      // Pagination details
      const totalItems = allPurchasedProducts.length; // Total number of unique products
      const totalPages = Math.ceil(totalItems / limit);

      return {
        data: paginatedProducts,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          limit,
        },
      };
    } catch (error) {
      throw new apiError(
        `Failed to retrieve purchased products: ${error.message}`,
        StatusCodes.BAD_REQUEST
      );
    }
  }
  async getMyCurrentCart(touristId) {
    const cart = await Cart.findOne({ user: touristId }).sort({
      createdAt: -1,
    });
    if (!cart) {
      throw new apiError("No Cart For user.", StatusCodes.NOT_FOUND);
    }
    console.log("cart");
    console.log(cart);
   
    return cart;
  }

  async getOrderDetails(orderId, userId) {
    try {
      const tourist = await Tourist.findOne({ user: userId });
      if (!tourist) {
        throw new apiError(
          "Tourist not found for this user",
          StatusCodes.NOT_FOUND
        );
      }

      const touristId = tourist._id.toString();

      const order = await Order.findById(orderId)
        .populate({
          path: "cart",
          select: "_id totalPrice user products",
          populate: {
            path: "user",
            select: "_id",
          },
        })
        .select(
          "_id cart paymentMethod paymentStatus orderStatus deliveryAddress orderDate createdAt updatedAt"
        );

      if (!order) {
        throw new apiError("Order not found", StatusCodes.NOT_FOUND);
      }

      if (!order.cart) {
        throw new apiError("Cart not found in order", StatusCodes.NOT_FOUND);
      }

      if (!order.cart.user) {
        throw new apiError("Tourist not found in cart", StatusCodes.NOT_FOUND);
      }

      if (order.cart.user._id.toString() !== touristId) {
        throw new apiError(
          "Unauthorized access to order",
          StatusCodes.UNAUTHORIZED
        );
      }

      return {
        message: "Order details retrieved successfully",
        orderDetails: order,
      };
    } catch (error) {
      throw new apiError(
        `Failed to retrieve order details: ${error.message}`,
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async cancelOrder(orderId, touristId, paymentService) {
    const order = await Order.findById(orderId).populate("cart");
    if (!order) throw new apiError("Order not found", StatusCodes.NOT_FOUND);

    if (order.orderStatus === "Cancelled") {
      throw new apiError("Order is already cancelled", StatusCodes.BAD_REQUEST);
    }

    if ([ "Shipped"].includes(order.orderStatus)) {
      throw new apiError(
        "Cannot cancel an order that is already being processed",
        StatusCodes.BAD_REQUEST
      );
    }

    let walletBefore = null;
    let refundedAmount = null;
    let walletAfter = null;

    if (order.paymentMethod === "Wallet" && order.paymentStatus === "Paid") {
      const refundResult = await paymentService.refundToWallet(
        touristId,
        order.orderPrice
      );

      ({ walletBefore, refundedAmount, walletAfter } = refundResult);
    }

    const cart = order.cart;
    if (cart && cart.products.length > 0) {
      for (const item of cart.products) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.availableQuantity += item.quantity;
          product.salesCount = Math.max(0, product.salesCount - item.quantity);
          await product.save();
        }
      }
    }

    order.orderStatus = "Cancelled";
    order.paymentStatus = "Not Paid";

    await order.save();

    return {
      walletBefore,
      refundedAmount,
      walletAfter,
      message: `Order ${orderId} has been successfully canceled.`,
    };
  }
}

export default TouristService;
