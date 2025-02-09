//tourist.route
import express from "express";
import {
  verifyToken,
  authorizeRoles,
  CheckProfile,
} from "../utils/verifyUser.js";

import {
  readTourist,
  updateTourist,
  rateItinerary,
  commentOnItinerary,
  rateActivity,
  commentOnActivity,
  bookItinerary,
  bookActivity,
  getAttendedItineraries,
  getAttendedActivities,
  cancelitineraryBooking,
  cancelActivityBooking,
  getBadgeLevel,
  redeemPoints,
  fileComplaint,
  updatePreferences,
  requestTouristDelete,
  getTicketsForUser,
  getTicketsForUserItineraries,
  getTicketsForUserActivities,
  commentOnTourguide,
  rateTourGuide,
  bookTransportation,
  cancelTransportationBooking,
  getBookedTransportations,
  getTouristComplaints,
  getPreferences,
  viewPurchasedProducts,
  getUpcomingPaidActivities,
  getUpcomingPaidItineraries,
  sendNotification,
  addItemToCart,
  changeItemQuantity,
  removeItemFromCart,
  placeOrder,
  addAddress,
  updateAddress,
  deleteAddress,
  getMyAddresses,
  setDefaultAddress,
  getProductsInMyCart,
  getOrderDetails, 
  cancelOrder,
  addBookmark,
  getMyBookmarks, 
  removeBookmark,
  addInterest,
  removeInterest,
  addProductToMyWishList,
  getProductsInMyWishList,
  removeProductFromMyWishList,
  getAllMyOrders
} from "../controllers/tourist.controller.js";

//import validators
import { activityratingsValidators } from "../utils/validators/activity.validators.js";
import { itineraryratingsValidators } from "../utils/validators/itinerary.validators.js";

const router = express.Router();

router.route("/readTourist").get(verifyToken, readTourist);
router.route("/updateTourist").put(verifyToken, updateTourist);
router.put(
  "/rateItinerary/:id",
  verifyToken,
  authorizeRoles(["Tourist"]),
  itineraryratingsValidators,
  rateItinerary
);
router.put(
  "/commentItinerary/:id",
  verifyToken,
  authorizeRoles(["Tourist"]),
  commentOnItinerary
);
router.put(
  "/rateActivity/:id",
  verifyToken,
  authorizeRoles(["Tourist"]),
  activityratingsValidators,
  rateActivity
);
router.put(
  "/commentActivity/:id",
  verifyToken,
  authorizeRoles(["Tourist"]),
  commentOnActivity
);
router.post(
  "/bookItinerary/:id",
  verifyToken,
  authorizeRoles(["Tourist"]),
  bookItinerary
);
router.post(
  "/bookActivity/:id",
  verifyToken,
  authorizeRoles(["Tourist"]),
  bookActivity
);
router.get(
  "/getAttendedItineraries",
  verifyToken,
  authorizeRoles(["Tourist"]),
  getAttendedItineraries
);
router.get(
  "/getAttendedActivities",
  verifyToken,
  authorizeRoles(["Tourist"]),
  getAttendedActivities
);
router.delete(
  "/cancelitineraryBooking/:id",
  verifyToken,
  authorizeRoles(["Tourist"]),
  cancelitineraryBooking
);
router.delete(
  "/cancelActivityBooking/:id",
  verifyToken,
  authorizeRoles(["Tourist"]),
  cancelActivityBooking
);

router
  .route("/getTickets")
  .get(verifyToken, authorizeRoles(["Tourist"]), getTicketsForUser);

router
  .route("/setPreferences")
  .put(verifyToken, authorizeRoles(["Tourist"]), updatePreferences);

router
  .route("/getPreferences")
  .get(verifyToken, authorizeRoles(["Tourist"]), getPreferences);

router
  .route("/requestDeleteTourist")
  .put(verifyToken, authorizeRoles(["Tourist"]), requestTouristDelete);

router.get(
  "/getBadgeLevel",
  verifyToken,
  authorizeRoles(["Tourist"]),
  getBadgeLevel
);
router.post(
  "/redeemPoints",
  verifyToken,
  authorizeRoles(["Tourist"]),
  redeemPoints
);
router.post(
  "/fileComplaint",
  verifyToken,
  authorizeRoles(["Tourist"]),
  fileComplaint
);

router
  .route("/getTicketsForItineraries")
  .get(verifyToken, authorizeRoles(["Tourist"]), getTicketsForUserItineraries);

router
  .route("/getTicketsForActivities")
  .get(verifyToken, authorizeRoles(["Tourist"]), getTicketsForUserActivities);

router
  .route("/addcomment")
  .post(verifyToken, authorizeRoles(["Tourist"]), commentOnTourguide);

router
  .route("/addrating")
  .post(verifyToken, authorizeRoles(["Tourist"]), rateTourGuide);

router.post("/bookTransportation/:id",verifyToken,authorizeRoles(["Tourist"]),bookTransportation)
router.delete("/cancelTransportationBooking/:id",verifyToken,authorizeRoles(["Tourist"]),cancelTransportationBooking)
router.get("/getBookedTransportations",verifyToken,authorizeRoles(["Tourist"]),getBookedTransportations)




router
  .route("/complaints")
  .get(verifyToken, authorizeRoles(["Tourist"]), getTouristComplaints);

router
.route("/products")
.get(verifyToken,authorizeRoles(["Tourist"]),viewPurchasedProducts);

router
.route("/cart")
.post(verifyToken,authorizeRoles(["Tourist"]),addItemToCart);

router
.route("/cart")
.get(verifyToken ,authorizeRoles(["Tourist"]),getProductsInMyCart )

router
.route("/cart/:id")
.put(verifyToken,authorizeRoles(["Tourist"]),changeItemQuantity);

router
.route("/cart/:id")
.delete(verifyToken,authorizeRoles(["Tourist"]),removeItemFromCart);

router.get('/wishlist',verifyToken, authorizeRoles(['Tourist']),getProductsInMyWishList);
router.post('/wishlist',verifyToken, authorizeRoles(['Tourist']),addProductToMyWishList);
router.delete('/wishlist/:id',verifyToken, authorizeRoles(['Tourist']),removeProductFromMyWishList);

router
.route("/order")
.post(verifyToken,authorizeRoles(['Tourist']) ,placeOrder )

router
.route("/orders")
.get(verifyToken,authorizeRoles(['Tourist']) ,getAllMyOrders )

router
.route("/upcomingPaidActivities")
.get(verifyToken,authorizeRoles(["Tourist"]),getUpcomingPaidActivities)

router
.route("/upcomingPaidItineraries")
.get(verifyToken,authorizeRoles(["Tourist"]),getUpcomingPaidItineraries)

router
.route("/sendNotification")
.post(sendNotification);


router.post('/addresses', verifyToken, authorizeRoles(['Tourist']), addAddress);
router.put('/addresses/:id', verifyToken, authorizeRoles(['Tourist']), updateAddress);
router.delete('/addresses/:id', verifyToken, authorizeRoles(['Tourist']), deleteAddress);
router.get('/addresses', verifyToken, authorizeRoles(['Tourist']), getMyAddresses);
router.put('/setDefaultAddress/:addressId', verifyToken, authorizeRoles(['Tourist']), setDefaultAddress);

// Tourist-Order Interaction routes
router.get('/orders/:orderId', verifyToken, authorizeRoles(['Tourist']), getOrderDetails);
router.put('/orders/cancel/:orderId', verifyToken, authorizeRoles(['Tourist']), cancelOrder);
router.post('/bookmarks', verifyToken, authorizeRoles(['Tourist']),addBookmark);
router.get('/bookmarks', verifyToken, authorizeRoles(['Tourist']), getMyBookmarks);
router.delete('/bookmarks', verifyToken, authorizeRoles(['Tourist']), removeBookmark);



router.put('/addInterest', verifyToken, authorizeRoles(['Tourist']), addInterest);
router.put('/removeInterest', verifyToken, authorizeRoles(['Tourist']),removeInterest);




export default router;
