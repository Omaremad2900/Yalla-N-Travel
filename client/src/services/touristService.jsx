import axiosInstance from '../axios';

const touristService = {
  getAllItineraries: async (page, limit = 10) => {
    try {
      const response = await axiosInstance.get(`/api/itineraries/getAllUpcoming?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch itineraries');
    }
  },

  getItineraryById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/itineraries/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch itinerary');
    }
  },

  getAllMuseums: async (page = 1, limit = 6) => {
    try {
      const response = await axiosInstance.get('/api/museums/getAllUpcoming',
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch museums');
    }
  },

  getMuseumById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/museums/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch museum');
    }
  },

  getAllHistoricalPlaces: async (page = 1, limit = 6) => {
    try {
      const response = await axiosInstance.get('/api/historical-places/getAllUpcoming',
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch historical places');
    }
  },

  getHistoricalPlaceById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/historical-places/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch historical place');
    }
  },

  searchActivities: async (query) => {
    try {
      const response = await axiosInstance.get(`/api/activities/search`, { params: { query } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search activities');
    }
  },
  getAllActivities: async (page, limit) => {
    try {
      const response = await axiosInstance.get(`/api/activity/upcoming-activities`, { params: { page, limit } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get activities');
    }
  },

  requestAccountDeletion: async (userId) => {
    try {
      const response = await axiosInstance.put(`/api/tourist/requestDeleteTourist`, { userId });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Deletion request error details:", error.response.data);
      }
      throw new Error(
        `Account deletion failed: ${error.response?.data?.message || error.message}`
      );
    }
  },



  // Create a new tourist profile
  createTouristProfile: async (touristData) => {
    try {
      const response = await axiosInstance.post('/api/tourist', touristData);
      return response.data; // Return the response data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create tourist profile');
    }
  },

  // Update tourist profile by user ID
  updateTouristProfile: async (_userId, touristData) => {
    try {
      const response = await axiosInstance.put(`/api/tourist/updateTourist`, touristData);
      return response.data; // Return the response data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update tourist profile');
    }
  },

  // Get tourist profile by user ID
  getTouristProfileById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/tourist/readTourist`, {
        params: { userId },
      });
      return response.data; // Return the response data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tourist profile');
    }
  },
  // Delete tourist profile by user ID (if needed in the future)
  deleteTouristProfile: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/api/tourist/${userId}`);
      return response.data; // Return the response data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete tourist profile');
    }
  },
  bookItinerary: async (itineraryId) => {
    try {
      const response = await axiosInstance.post(`/api/tourist/bookItinerary/${itineraryId}`);
      return response.data; // Return success response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to book itinerary');
    }
  },

  // Function to book an activity
  bookActivity: async (activityId) => {
    try {
      const response = await axiosInstance.post(`/api/tourist/bookActivity/${activityId}`);
      return response.data; // Return success response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to book activity');
    }
  },
  getAttendedItineraries: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(`/api/tourist/getAttendedItineraries`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attended itineraries');
    }
  },
  commentItinerary: async (itineraryId, comment) => {
    try {
      const response = await axiosInstance.put(`/api/tourist/commentItinerary/${itineraryId}`, { comment });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to comment on itinerary');
    }
  },
  commentActivity: async (ActivityId, comment) => {
    try {
      const response = await axiosInstance.put(`/api/tourist/commentActivity/${ActivityId}`, { comment });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to comment on itinerary');
    }
  },

  // Fetch attended activities
  getAttendedActivities: async (page, limit = 10) => {
    try {
      //query params
      const response = await axiosInstance.get(`/api/tourist/getAttendedActivities?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attended activities');
    }
  },
  getBookedActivities: async (page, limit = 10) => {
    try {
      const response = await axiosInstance.get(`/api/tourist/getTicketsForActivities?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attended activities');
    }
  },
  getBookedItineraries: async (page, limit = 10) => {
    try {
      const response = await axiosInstance.get(`/api/tourist/getTicketsForItineraries?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attended activities');
    }
  },
  CancelbookingItinerary: async (TicketId) => {
    try {
      const response = await axiosInstance.delete(`/api/tourist/cancelitineraryBooking/${TicketId}`);
      return response.data; // Return success response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete itinerary');
    }
  },

  // Function to book an activity
  CancelbookingActivity: async (TicketId) => {
    try {
      const response = await axiosInstance.delete(`/api/tourist/cancelActivityBooking/${TicketId}`);
      return response.data; // Return success response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel activity');
    }
  },

  // Rate an activity
  rateActivity: async (activityId, rating) => {
    try {
      const response = await axiosInstance.put(`/api/tourist/rateActivity/${activityId}`, { rating });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to rate activity');
    }
  },

  // Rate an itinerary
  rateItinerary: async (itineraryId, rating) => {
    try {
      const response = await axiosInstance.put(`/api/tourist/rateItinerary/${itineraryId}`, { rating });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to rate itinerary');
    }
  },
  fileComplaint: async (complaintData) => {
    try {
      const response = await axiosInstance.post("/api/tourist/fileComplaint", complaintData);
      return response.data; // Return the data from the response
    } catch (error) {
      throw error.response?.data?.message || 'Failed to file complaint'; // Throw error message if it exists
    }
  },

  getPreferences: async () => {
    try {
      const response = await axiosInstance.get('/api/preference-tags'); // Fetch preference tags
      return response.data;
    } catch (error) {
      console.error("Error fetching preference tags:", error);
      throw error;
    }
  },
  // Get tourist profile by user ID

  getBookedTransportations: async () => {
    try {
      const response = await axiosInstance.get('/api/tourist/getBookedTransportations');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booked transportations');
    }
  },

  // Get all available transportations from advertiser
  getAllTransportation: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get('/api/advertiser/getAllTransportation', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch transportations');
    }
  },

  // Book a specific transportation by ID
  bookTransportation: async (transportationId) => {
    try {
      const response = await axiosInstance.post(`/api/tourist/bookTransportation/${transportationId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to book transportation');
    }
  },

  // Cancel a specific transportation booking by ID
  cancelTransportationBooking: async (transportationId) => {
    try {
      const response = await axiosInstance.delete(`/api/tourist/cancelTransportationBooking/${transportationId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel transportation booking');
    }
  },
  getCategories: async () => {
    try {
      const response = await axiosInstance.get('/api/activity-categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },
  getTourGuide: async (tourguideId) => {
    try {
      const response = await axiosInstance.get(`/api/tourGuide/getTourguideForRating/${tourguideId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tourguide');
    }
  },
  rateTourGuide: async (tourGuideId, rating) => {
    try {
      const response = await axiosInstance.post(`/api/tourist/addrating`, { tourGuideId, rating });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to rate activity');
    }
  },
  commentTourGuide: async (tourGuideId, comment) => {
    try {
      const response = await axiosInstance.post(`/api/tourist/addcomment`, { tourGuideId, comment });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to comment on itinerary');
    }
  },
  shareResource: async (resourceData) => {
    try {
      const response = await axiosInstance.post('/api/share', resourceData); // API call to /share endpoint
      return response.data; // Return the response data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to share resource');
    }
  },
  getPurchasedProducts: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get('/api/tourist/products', {
        params: { page, limit }
      });
      return response.data;

    }
    catch (error) {
      console.error("Error fetching purchased products:", error);
      throw error;
    }
  },

  getProductsInMyCart: async () =>{
    try{
       const response= await axiosInstance.get('/api/tourist/cart');
       return response.data;

    }
    catch(error){
      console.log("Error getting products in cart:", error);
      throw error;
    }
  },

  addItemToCart: async (productId, quantity ) =>{
    try{
      const response= await axiosInstance.post('/api/tourist/cart', {productId, quantity});
      return response.data;
     
    }
    catch (error){
      console.error("Error adding item to cart :", error);
      throw error;
    }
  },

  changeItemQuantity: async (productId, quantity )=>{
    try{
      const response= await axiosInstance.put(`/api/tourist/cart/${productId}`, {newQuantity:quantity});
      return response.data;
     
    }
    catch (error){
      console.log("error in service:",error);
      console.error("Error changing item quantity :", error);
      throw error;
    }
  },

  removeItemFromCart: async (id)=>{
    try{
      const response= await axiosInstance.delete(`api/tourist/cart/${id}`);
      return response.data;
     
    }
    catch (error){
      console.error("Error removing item from cart :", error);
      throw error;
    }
  },

  getProductsInMyWishList: async ( )=>{
    try{
      const response= await axiosInstance.get('/api/tourist/wishlist');
      return response.data;
     
    }
    catch (error){
      console.error("Error getting products in wishlist :", error);
      throw error;
    }
  },

  addProductToMyWishList: async (productId )=>{
    try{
      const response= await axiosInstance.post('/api/tourist/wishlist',{productId});
      return response.data;
     
    }
    catch (error){
      console.error("Error adding product to wishlist :", error);
      throw error;
    }
  },

  removeProductFromMyWishList: async (productId )=>{
    try{
      const response= await axiosInstance.delete(`/api/tourist/wishlist/${productId}`);
      return response.data;
     
    }
    catch (error){
      console.error("Error removing product from wishlist :", error);
      throw error;
    }
  },

  

  // Get tourist badge level
getBadgeLevel: async () => {
  try {
    const response = await axiosInstance.get('/api/tourist/getBadgeLevel');
    return response.data; // Return the badge level
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch badge level');
  }
},

  // Redeem tourist points
  redeemPoints: async (pointsToRedeem) => {
    try {
      const response = await axiosInstance.post('/api/tourist/redeemPoints', { pointsToRedeem });
      return response.data; // Return the details from the successful response
    } catch (error) {
      // Improved error handling
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to redeem points');
      } else {
        throw new Error('Failed to redeem points. Please try again.');
      }
    }
  },

  getTouristComplaints: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get('/api/tourist/complaints', {
        params: { page, limit }
      });
      return response.data;

    }
    catch (error) {
      console.error("Error fetching complaints:", error);
      throw error;
    }
  },
  setPreferences: async (preferences) => {
    try {
      const response = await axiosInstance.put('/api/tourist/setPreferences', { preferences });
      return response.data;
    } catch (error) {
      console.error("Error setting preference tags:", error);
      throw error;
    }
  },
  // Get all tags
  getAllTags: async () => {
    try {
      const response = await axiosInstance.get('/api/tags');
      return response.data;
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  },

  getUserPreference: async () => {
    try {
      const response = await axiosInstance.get('/api/tourist/getPreferences'); // Fetch preference tags
      return response.data;
    } catch (error) {
      console.error("Error fetching user preference tags:", error);
      throw error;
    }
},
getOrderDetails: async (orderId, userId) => {
  try {
    console.log(`Fetching order details for Order ID: ${orderId}, User ID: ${userId}`); // Debug log
    const response = await axiosInstance.get(`/api/tourist/orders/${orderId}`, {
      params: { userId }, // Pass userId as a query parameter
    });
    return response.data; // Return the response data directly
  } catch (error) {
    console.error('Error in getOrderDetails:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch order details');
  }
},

addAddress: async (addressData) => {
  try {
    const response = await axiosInstance.post('/api/tourist/addresses', addressData);
    return response.data; // Return the response data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add address');
  }
},

updateAddress: async (addressId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/api/tourist/addresses/${addressId}`, updatedData);
    return response.data; // Return the response data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update address');
  }
},

deleteAddress: async (addressId) => {
  try {
    const response = await axiosInstance.delete(`/api/tourist/addresses/${addressId}`);
    return response.data; // Return success response
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete address');
  }
},

getMyAddresses: async () => {
  try {
    const response = await axiosInstance.get('/api/tourist/addresses');
    return response.data; // Return the list of addresses
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch addresses');
  }
},

setDefaultAddress: async (addressId) => {
  try {
    const response = await axiosInstance.put(`/api/tourist/setDefaultAddress/${addressId}`);
    return response.data; // Return success response
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to set default address');
  }
},
addBookmark: async (bookmarkData) => {
  try {
    const response = await axiosInstance.post('/api/tourist/bookmarks', bookmarkData);
    return response.data; // Return the response data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add bookmark');
  }
},

// Get all bookmarks
getMyBookmarks: async () => {
  try {
    const response = await axiosInstance.get('/api/tourist/bookmarks');
    return response.data; // Return the list of bookmarks
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bookmarks');
  }
},

// Remove a bookmark
removeBookmark: async (bookmarkData) => {
  try {
    console.log("Removing bookmark with data:", bookmarkData); // Log the data being sent
    const response = await axiosInstance.delete('/api/tourist/bookmarks', {
      data: bookmarkData, // Ensure the payload is sent in the `data` field
    });
    return response.data; // Return success response
  } catch (error) {
    console.error("Error removing bookmark:", error.response?.data || error.message); // Log the error
    throw new Error(error.response?.data?.message || 'Failed to remove bookmark');
  }
},


// Add an interest tag
addInterest: async (itemId, type) => {
  try {
    console.log("Adding interest for:", { itemId, type }); // Debugging
    const response = await axiosInstance.put('/api/tourist/addInterest', { itemId, type });
    return response.data; // Return success response
  } catch (error) {
    console.error("Error adding interest:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to add interest');
  }
},

removeInterest: async (itemId, type) => {
  try {
    console.log("Removing interest for:", { itemId, type }); // Debugging
    const response = await axiosInstance.put('/api/tourist/removeInterest', { itemId, type });
    return response.data; // Return success response
  } catch (error) {
    console.error("Error removing interest:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to remove interest');
  }
},
  createOrder: async (orderDetails) =>{
    try {
      const response = await axiosInstance.post('/api/tourist/order', {orderDetails}); // Fetch preference tags
      return response.data;
    } catch (error) {
      console.error("Error creating order", error);
      throw error;
    }
  },

getAllMyOrders: async ( page = 1, limit = 10) => {
  try {
    // Construct the request URL with query parameters
    const response = await axiosInstance.get(`/api/tourist/orders`, {
      params: {page, limit },
    });

    // Return the structured response data
    return response.data; 
  } catch (error) {
    console.error('Error in getAllMyOrders:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
},
cancelOrder: async (orderId) => {
  try {
    const response = await axiosInstance.put(`/api/tourist/orders/cancel/${orderId}`);
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error in cancelOrder:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to cancel order');
  }
},






};
export default touristService;
