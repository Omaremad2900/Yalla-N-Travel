// controllers/tourist.controller.js
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import { scheduleSendAppNotifications } from "../utils/Jobs/agenda.js";
// @desc Get Tourist
// @route /api/tourists/read
// @access Private
export const readTourist = asyncHandler(async (req, res, next) => {
  try {
    // Use the logged-in user's ID from req.user
    const userId = req.user.id;

    // Retrieve the touristService instance from the DI container
    const touristService = req.container.resolve("touristService");

    const tourist = await touristService.findTouristByUserId(userId);

    if (!tourist) {
      return next(
        new ApiError(
          `No Tourist found with id: ${userId}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({ data: tourist });
  } catch (error) {
    console.error("Error getting Tourist profile:", error);
    next(
      new ApiError(
        "Error getting Tourist profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// @desc Update Tourist
// @route /api/tourists/update
// @access Private
export const updateTourist = asyncHandler(async (req, res, next) => {
  try {
    // Use the logged-in user's ID from req.user
    const userId = req.user.id;

    // Retrieve the touristService instance from the DI container
    const touristService = req.container.resolve("touristService");

    const updatedTourist = await touristService.updateTourist(userId, req.body);

    // Prevent updating the username
    if (req.body.user?.username) {
      delete req.body.user.username;
      return next(
        new ApiError("Cannot update tourist username", StatusCodes.BAD_REQUEST)
      );
    }

    // Prevent updating the wallet
    if (req.body.wallet !== undefined) {
      delete req.body.wallet;
      return next(
        new ApiError("Cannot update tourist wallet", StatusCodes.BAD_REQUEST)
      );
    }

    if (!updatedTourist) {
      return next(
        new ApiError(
          `No Tourist with id ${userId} was found`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({ data: updatedTourist });
  } catch (error) {
    console.error("Error updating Tourist profile:", error);
    next(
      new ApiError(
        "Error updating Tourist profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});
// Controller for rating an itinerary
export const rateItinerary = async (req, res, next) => {
  try {
    const itineraryId = req.params.id; // Extract itinerary ID from the route
    const rating = Number(req.body.rating); // Get the rating from the request body

    // Call the service method
    const updatedItinerary = await req.container
      .resolve("touristService")
      .rateItinerary(itineraryId, rating);

    return res.status(StatusCodes.OK).json({
      message: "Itinerary rated successfully",
      data: updatedItinerary,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
// controller for comment on itinerary
export const commentOnItinerary = async (req, res, next) => {
  try {
    const itineraryId = req.params.id; // Extract itinerary ID from the route
    const comment = req.body.comment; // Get the comment from the request body
    const username = req.user.username;

    // Call the service method
    const updatedItinerary = await req.container
      .resolve("touristService")
      .commentItinerary(itineraryId, username, comment);

    return res.status(StatusCodes.OK).json({
      message: "Comment added successfully",
      data: updatedItinerary,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
//Controller for rating an activity
export const rateActivity = async (req, res, next) => {
  try {
    const activityId = req.params.id; // Extract activity ID from the route
    const rating = Number(req.body.rating); // Get the rating from the request body

    // Call the service method
    const updatedActivity = await req.container
      .resolve("touristService")
      .rateActivity(activityId, rating);

    return res.status(StatusCodes.OK).json({
      message: "Activity rated successfully",
      data: updatedActivity,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
//Controller for commenting on an activity
export const commentOnActivity = async (req, res, next) => {
  try {
    const activityId = req.params.id; // Extract activity ID from the route
    const comment = req.body.comment; // Get the comment from the request body
    console.log(req.user);
    // get username
    const username = req.user.username;

    // Call the service method
    const updatedActivity = await req.container
      .resolve("touristService")
      .commentActivity(activityId, username, comment);

    return res.status(StatusCodes.OK).json({
      message: "Comment added successfully",
      data: updatedActivity,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
// controller for booking itirnary ticket
export const bookItinerary = async (req, res, next) => {
  try {
    const itineraryId = req.params.id; // Extract itinerary ID from the route

    // Call the service method
    const ticket = await req.container
      .resolve("ticketService")
      .createTicketforItinerary(req.user.id, itineraryId);

    return res.status(StatusCodes.OK).json({
      message: "Itinerary booked successfully",
      data: ticket,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
// controller for booking activity ticket
export const bookActivity = async (req, res, next) => {
  try {
    const activityId = req.params.id; // Extract activity ID from the route

    // Call the service method
    const ticket = await req.container
      .resolve("ticketService")
      .createTicketForActivity(req.user.id, activityId);

    return res.status(StatusCodes.OK).json({
      message: "Activity booked successfully",
      data: ticket,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
//still not tested
//controller for getting attended itineraries
export const getAttendedItineraries = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extract user ID from the request
    const { page, limit } = req.query;

    // Call the service method
    const itineraries = await req.container
      .resolve("ticketService")
      .getCompletedItinerariesByTourist(userId, page, limit);

    return res.status(StatusCodes.OK).json({
      message: "Attended itineraries retrieved successfully",
      data: itineraries,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
//controller for getting attended activities
export const getAttendedActivities = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extract user ID from the request
    //take query params
    const { page, limit } = req.query;

    // Call the service method
    const activities = await req.container
      .resolve("ticketService")
      .getCompletedActivitiesByTourist(userId, page, limit);

    return res.status(StatusCodes.OK).json({
      message: "Attended activities retrieved successfully",
      data: activities,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
//controller cancel booking
export const cancelitineraryBooking = async (req, res, next) => {
  try {
    const ticketId = req.params.id; // Extract ticket ID from the route

    // Call the service method
    await req.container
      .resolve("ticketService")
      .deleteTicketForItinerary(ticketId);

    return res.status(StatusCodes.OK).json({
      message: "Ticket cancelled successfully",
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
// controller cancel activity booking
export const cancelActivityBooking = async (req, res, next) => {
  try {
    const ticketId = req.params.id; // Extract ticket ID from the route

    // Call the service method
    await req.container
      .resolve("ticketService")
      .deleteTicketforActivity(ticketId);

    return res.status(StatusCodes.OK).json({
      message: "Ticket cancelled successfully",
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};

export const getTicketsForUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const tickets = await req.container
      .resolve("touristService")
      .getTicketsForTourist(userId);

    res.status(200).json(tickets);
  } catch (err) {
    next(err);
  }
};

export const requestTouristDelete = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const touristService = req.container.resolve("touristService");

    const tourist = await touristService.findTouristByUserId(userId);
    const touristId = tourist._id;

    const ticketId = await touristService.getTicketsForTourist(userId);

    const requestDelete = await touristService.requestAccountDeletion(
      touristId,
      ticketId
    );

    res
      .status(StatusCodes.OK)
      .json({ data: requestDelete, message: "Account Deleted" });
  } catch (err) {
    next(err);
  }
};

export const updatePreferences = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const touristService = await req.container.resolve("touristService");

    const tourist = await touristService.findTouristByUserId(userId);
    const touristId = tourist._id;

    const preferences = await touristService.setPreference(
      userId,
      touristId,
      req.body.preferences
    );

    res
      .status(StatusCodes.OK)
      .json({ message: "Preferences Successfully Set!" });
  } catch (err) {
    next(err);
  }
});

export const getPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const touristService = await req.container.resolve("touristService");
    const tourist = await touristService.findTouristByUserId(userId);
    const touristId = tourist._id;

    const touristPreferences = await touristService.getTouristPreferences(
      userId,
      touristId
    );

    res.status(StatusCodes.OK).json({ preferences: touristPreferences });
  } catch (err) {
    next(err);
  }
};

export const getBadgeLevel = async (req, res, next) => {
  const touristId = req.user.id;


  try {
    const touristService = await req.container.resolve("touristService");
    const response = await touristService.getBadgeLevel(touristId);

    res.status(StatusCodes.OK).json({ level: response });

    res.status(StatusCodes.OK).json({ level: response });
  } catch (error) {
    next(error);
  }
};

export const redeemPoints = async (req, res, next) => {
  const touristId = req.user.id;
  let { pointsToRedeem } = req.body;

  try {
    pointsToRedeem = parseInt(pointsToRedeem, 10);

    if (isNaN(pointsToRedeem)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid points to redeem. It must be a valid number."
      });
    }

    const touristService = await req.container.resolve("touristService");
    const { wallet, loyaltyPoints, redeemedAmount } =
      await touristService.redeemPoints(touristId, pointsToRedeem);


    res.status(StatusCodes.OK).json({
      message: `Redeemed ${pointsToRedeem} points for ${redeemedAmount} EGP`,
      wallet: wallet,
      loyaltyPoints: loyaltyPoints,
      loyaltyPoints: loyaltyPoints,
    });
  } catch (error) {
    next(error);
  }
};

export const fileComplaint = async (req, res, next) => {
  const touristId = req.user.id;
  const { title, body } = req.body;

  try {
    const touristService = await req.container.resolve("touristService");
    const response = await touristService.fileComplaint(touristId, title, body);


    res.status(StatusCodes.CREATED).json({
      message: "Complaint filed successfully",
      data: response,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketsForUserItineraries = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extract user ID from the request
    const { page, limit } = req.query;

    // Call the service method
    const itineraries = await req.container
      .resolve("ticketService")
      .getTicketForUsersItinerary(userId, page, limit);

    res.status(200).json({ data: itineraries });
  } catch (error) {
    next(error);
  }
};

export const getTicketsForUserActivities = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extract user ID from the request
    //take query params
    const { page, limit } = req.query;

    // Call the service method
    const activities = await req.container
      .resolve("ticketService")
      .getTicketForUsersActivity(userId, page, limit);

    return res.status(StatusCodes.OK).json({
      message: "Booked activities retrieved successfully",
      data: activities,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
// controller for getting upcoming paid itineraries
export const getUpcomingPaidItineraries = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extract user ID from the request
    const { page, limit } = req.query;
    // Call the service method
    const itineraries = await req.container 
      .resolve("ticketService")
      .getPaidTicketsForUpcomingItineraries(userId, page, limit);

      return res.status(StatusCodes.OK).json({
        message: "Upcoming paid itineraries retrieved successfully",
        data: itineraries,
      });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
// controller for getting upcoming paid activities
export const getUpcomingPaidActivities = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extract user ID from the request
    const { page, limit } = req.query;
    // Call the service method
    const activities = await req.container
      .resolve("ticketService")
      .getPaidTicketsForUpcomingActivities(userId, page, limit);
      return res.status(StatusCodes.OK).json({
        message: "Upcoming paid activities retrieved successfully",
        data: activities,
      });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};



export const commentOnTourguide = async (req, res, next) => {
  try{

    const {tourGuideId, comment} = req.body;

    console.log(req.user);

    const username = req.user.username;
    
    const updatedTourGuide = await req.container
      .resolve("touristService")
      .commentTourGuide(tourGuideId, username, comment);

    return res.status(StatusCodes.OK).json({
      message: "Comment added successfully",
      data: updatedTourGuide,
    });
  } catch (error) {
    next(error);
  }
};

export const rateTourGuide = async (req, res, next) => {
  try {
    const { tourGuideId } = req.body;
    const rating = Number(req.body.rating);

    const updatedTourGuide = await req.container
      .resolve("touristService")
      .rateTourGuide(tourGuideId, rating);

    return res.status(StatusCodes.OK).json({
      message: "TourGuide rated successfully",
      data: updatedTourGuide,
    });
  } catch (error) {
    next(error);
  }
};
export const bookTransportation = async (req, res, next) => {
  try {
    const transportationId = req.params.id; // Extract transportation ID from the route

    // Call the service method
    const ticket = await req.container
      .resolve("ticketService")
      .bookTransportationTicket(req.user.id, transportationId);

    return res.status(StatusCodes.OK).json({
      message: "Transportation booked successfully",
      data: ticket,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
//cancel transportation booking
export const cancelTransportationBooking = async (req, res, next) => {
  try {
    const ticketId = req.params.id; // Extract ticket ID from the route

    // Call the service method
    await req.container
      .resolve("ticketService")
      .deleteTransportationTicket(ticketId);

    return res.status(StatusCodes.OK).json({
      message: "Ticket cancelled successfully",
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};
//get booked transportations
export const getBookedTransportations = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extract user ID from the request
    const { page, limit } = req.query;

    // Call the service method
    const transportations = await req.container
      .resolve("ticketService")
      .getTransportationTicketForUser(userId, page, limit);

    return res.status(StatusCodes.OK).json({
      message: "Booked transportations retrieved successfully",
      data: transportations,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};

export const getTouristComplaints = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const touristService = await req.container.resolve("touristService");
    console.log(req.user.id);
    const complaints = await touristService.getMyComplaints(req.user.id,page,limit);
    res.status(StatusCodes.OK).json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
};

export const viewPurchasedProducts= async (req, res, next)=> {
  try {
    const{page ,limit}=req.query

    const touristService = await req.container.resolve("touristService");
    const tourist = await touristService.findTouristByUserId(req.user.id);
      const products = await touristService.getPurchasedProducts(tourist._id,page,limit);
      res.status(200).json({
          success: true,
          data: products
      });
  } catch (error) {
      next(error);
  }
};
// send notification

export const sendNotification = async (req, res, next) => {
  try {
    scheduleSendAppNotifications();
    res.status(StatusCodes.OK).json({ message: "Notification sent successfully" });
  } catch (error) {
    next(error);
  }
}
export const getProductsInMyCart = async (req,res,next) => {
  try {
    const touristService = await req.container.resolve("touristService");
    const tourist = await touristService.findTouristByUserId(req.user.id);
    
    const productService = await req.container.resolve('productService');
    const cart = await productService.getProductsInMyCart(tourist._id);
    console.log(cart)
    res.status(StatusCodes.OK).json(cart);

  } catch (error) {
    next(error)
  }
}
export const addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const touristService = await req.container.resolve("touristService");
    const tourist = await touristService.findTouristByUserId(req.user.id);
    const productService = await req.container.resolve('productService');
    const cart = await productService.addItemToCart(tourist._id , productId, quantity);
    res.status(StatusCodes.OK).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
      next(error);
  }
};

export const removeItemFromCart  = async (req, res, next) => {
  try {
    const productId = req.params.id
    const touristService = await req.container.resolve("touristService");
    const tourist = await touristService.findTouristByUserId(req.user.id);
    const productService = await req.container.resolve('productService');
    const cart = await productService.removeItemFromCart(tourist._id , productId);
    res.status(StatusCodes.OK).json({ message: "Item removed successfully", cart });
  } catch (error) {
      next(error);
  }
};

export const changeItemQuantity = async (req, res, next) => {
  try {
    const  productId = req.params.id
    const { newQuantity } = req.body;
    const touristService = await req.container.resolve("touristService");
    const tourist = await touristService.findTouristByUserId(req.user.id);
    const productService = await req.container.resolve('productService');
    const cart = await productService.changeItemQuantity(tourist._id , productId, newQuantity);
    res.status(StatusCodes.OK).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
      next(error);
  }
};

export const placeOrder = async (req,res,next) =>{
  try {
    const {orderDetails} = req.body;
    const touristService = await req.container.resolve("touristService");
    const tourist = await touristService.findTouristByUserId(req.user.id);
    const cart = await touristService.getMyCurrentCart(tourist._id);
    const orderService = await req.container.resolve('orderService');
    const order  = await orderService.placeOrder(tourist._id,cart,orderDetails);
    res.status(StatusCodes.OK).json({ message: "Order Placed Successfully", order });
  } catch (error) {
    next(error)
  }
}


export const addAddress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const touristService = await req.container.resolve("touristService");
        const tourist = await touristService.findTouristByUserId(userId);
        const touristId = tourist._id;

        const addressData = req.body;

        const addresses = await req.container.resolve('addressService').addAddress(touristId, addressData);
        res.status(StatusCodes.CREATED).json({ success: true, data: addresses });
    } catch (error) {
        next(error);
    }
};


export const updateAddress = async (req, res, next) => {
  try {
      const addressId = req.params.id; 
      const addressData = req.body; 

      const addressService = await req.container.resolve('addressService');
      const updatedAddress = await addressService.updateAddress(addressId, addressData);

      res.status(StatusCodes.OK).json({ success: true, data: updatedAddress });
  } catch (error) {
      next(error);
  }
};


export const deleteAddress = async (req, res, next) => {
    try {
        const addressId = req.params.id; 
        const addresses = await req.container.resolve('addressService').deleteAddress(addressId);
        res.status(StatusCodes.OK).json({ success: true, data: addresses });
    } catch (error) {
        next(error);
    }
};


export const getMyAddresses = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const touristService = await req.container.resolve("touristService");
        const tourist = await touristService.findTouristByUserId(userId);
        const touristId = tourist._id;

        const addresses = await req.container.resolve('addressService').getMyAddresses(touristId);
        res.status(StatusCodes.OK).json({ success: true, data: addresses });
    } catch (error) {
        next(error);
    }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
      const userId = req.user.id;
      const { addressId } = req.params; 

      const touristService = await req.container.resolve("touristService");
      const tourist = await touristService.findTouristByUserId(userId);
      const touristId = tourist._id;

      const addressService = await req.container.resolve('addressService');
      const result = await addressService.setDefault(touristId, addressId);

      res.status(StatusCodes.OK).json({ success: true, message: result.message });
  } catch (error) {
      next(error);
  }
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const touristService = await req.container.resolve('touristService');
    const orderDetails = await touristService.getOrderDetails(orderId, req.user.id);
    res.status(StatusCodes.OK).json({ message: 'Order details retrieved successfully', orderDetails });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { id: touristId } = req.user;
    const touristService = await req.container.resolve('touristService');
    const paymentService = await req.container.resolve('paymentService');

    const { walletBefore, refundedAmount, walletAfter, message } = await touristService.cancelOrder(
      orderId,
      touristId,
      paymentService
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message,
      details: {
        walletBefore,
        refundedAmount,
        walletAfter,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addBookmark = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { itemId, type } = req.body;
        const touristService = await req.container.resolve("touristService");
        const tourist = await touristService.findTouristByUserId(userId);
        const touristId = tourist._id;

        const bookmarkService = await req.container.resolve('bookmarkService');
        const result = await bookmarkService.addBookmark(touristId, itemId, type);

        res.status(StatusCodes.CREATED).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const getMyBookmarks = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const touristService = await req.container.resolve("touristService");
        const tourist = await touristService.findTouristByUserId(userId);
        const touristId = tourist._id;

        const bookmarkService = await req.container.resolve('bookmarkService');
        const bookmarks = await bookmarkService.getMyBookmarks(touristId);

        res.status(StatusCodes.OK).json({ success: true, data: bookmarks });
    } catch (error) {
        next(error);
    }
};

export const removeBookmark = async (req, res, next) => {
    try {

        const userId = req.user.id;
        const touristService = await req.container.resolve("touristService");
        const tourist = await touristService.findTouristByUserId(userId);
        const touristId = tourist._id;
       
        const { itemId, type } = req.body;

        const bookmarkService = await req.container.resolve('bookmarkService');
        const result = await bookmarkService.removeBookmark(touristId, itemId, type);
        res.status(StatusCodes.OK).json({ success: true, message: result.message });
    } catch (error) {
        next(new ApiError(error.message, StatusCodes.BAD_REQUEST));
    }
};

export const addInterest = async (req, res, next) => {
    try {
        const userId  = req.user.id;
        const { itemId, type } = req.body; // type can be 'activity' or 'itinerary'
        console.log(req.user);

        const eventService = await req.container.resolve('eventService');
        const event = await eventService.addInterest(userId, itemId, type);

        res.status(StatusCodes.OK).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

export const removeInterest = async (req, res, next) => {
    try {
        const userId  = req.user.id;
        const { itemId, type } = req.body; // type can be 'activity' or 'itinerary'

        const eventService = await req.container.resolve('eventService');
        const event = await eventService.removeInterest(userId, itemId, type);

        res.status(StatusCodes.OK).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

export const getProductsInMyWishList = async (req,res,next) => {
  try {
    const touristService = await req.container.resolve("touristService");
    const tourist = await touristService.findTouristByUserId(req.user.id);
    const productService = await req.container.resolve('productService');
    const products = await productService.getProductsInMyWishList(tourist._id);
    res.status(StatusCodes.OK).json({ products });

  } catch (error) {
    next(error)
  }
}
export const addProductToMyWishList = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const touristService = await req.container.resolve("touristService");
    const tourist = await touristService.findTouristByUserId(req.user.id);
    const productService = await req.container.resolve('productService');
    const wishlist = await productService.addProductToMyWishList(tourist._id , productId);
    res.status(StatusCodes.OK).json({ message: "Item added to Wish List successfully", wishlist });
  } catch (error) {
      next(error);
  }
};

export const removeProductFromMyWishList  = async (req, res, next) => {
  try {
    const  productId = req.params.id
    const touristService = await req.container.resolve("touristService");
    const tourist = await touristService.findTouristByUserId(req.user.id);
    const productService = await req.container.resolve('productService');
    const wishlist = await productService.removeProductFromMyWishList(tourist._id , productId);
    res.status(StatusCodes.OK).json({ message: "Product removed from wish list successfully", wishlist });
  } catch (error) {
      next(error);
  }
};
export const getAllMyOrders = async (req,res,next) =>{
  try {
    const { page, limit } = req.query;
    // console.log()
    console.log("controller: "+page)
    const touristService = await req.container.resolve("touristService");
    const tourist = await touristService.findTouristByUserId(req.user.id);
    const orderService = await req.container.resolve('orderService');
    const orders  = await orderService.getAllMyOrders(tourist._id,page, limit);
    res.status(StatusCodes.OK).json({  orders });
  } catch (error) {
    next(error);
  }
}