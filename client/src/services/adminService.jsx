import axiosInstance from '../axios'; // Import the Axios instance

const AdminService = {
  // Method to add a new admin
  addAdmin: async (adminData) => {
    try {
      const response = await axiosInstance.post('/api/admin/add-admin', adminData);
      return response.data;
    } catch (error) {
      console.error("Error adding admin:", error);
      throw error;
    }
  },

  // Method to add a Tourism Governor
  addTourismGovernor: async (governorData) => {
    try {
      const response = await axiosInstance.post('/api/admin/addTourismGovernor', governorData);
      return response.data;
    } catch (error) {
      console.error("Error adding Tourism Governor:", error);
      throw error;
    }
  },
  //Method to get Tourism Governors
  //not implemented api
  /*
    getGovernors: async () => {
      try {
        const response = await axiosInstance.get('/api/admin/governors');
        return response.data;
      } catch (error) {
        console.error("Error fetching governors:", error);
        throw error;
      }
      },*/

  // Method to delete a user account
  deleteAccount: async (accountId) => {
    try {
      const response = await axiosInstance.delete('/api/admin/delete-account', { data: { targetUserId: accountId } });
      return response.data;
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  },
  // Method to accept a user
  acceptUser: async (userId) => {
    try {
      const response = await axiosInstance.put(`/api/auth/accept/${userId}`); // Accept user by ID
      return response.data;
    } catch (error) {
      console.error("Error accepting user:", error);
      throw error;
    }
  },


  // Method to fetch all users
  getAllUsers: async (page, limit) => {
    try {
      const response = await axiosInstance.get('/api/user',
        {
          params: {
            page: page,
            limit: limit
          }
        }); // Fetch all users
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  // Method to fetch all preference tags
  getPreferenceTags: async () => {
    try {
      const response = await axiosInstance.get('/api/preference-tags'); // Fetch preference tags
      return response.data;
    } catch (error) {
      console.error("Error fetching preference tags:", error);
      throw error;
    }
  },

  // Method to add a new preference tag
  addPreferenceTag: async (tagData) => {
    try {
      const response = await axiosInstance.post('/api/preference-tags', tagData); // Add preference tag
      return response.data;
    } catch (error) {
      console.error("Error adding preference tag:", error);
      throw error;
    }
  },

  // Method to update an existing preference tag
  updatePreferenceTag: async (tagId, tagData) => {
    try {
      const response = await axiosInstance.put(`/api/preference-tags/${tagId}`, tagData); // Update preference tag
      return response.data;
    } catch (error) {
      console.error("Error updating preference tag:", error);
      throw error;
    }
  },

  // Method to delete a preference tag
  deletePreferenceTag: async (tagId) => {
    try {
      const response = await axiosInstance.delete(`/api/preference-tags/${tagId}`); // Delete preference tag
      return response.data;
    } catch (error) {
      console.error("Error deleting preference tag:", error);
      throw error;
    }
  },

  // Method to fetch all activity categories
  getActivityCategories: async () => {
    try {
      const response = await axiosInstance.get('/api/activity-categories'); // Fetch activity categories
      return response.data;
    } catch (error) {
      console.error("Error fetching activity categories:", error);
      throw error;
    }
  },

  // Method to add a new activity category
  addActivityCategory: async (categoryData) => {
    try {
      const response = await axiosInstance.post('/api/activity-categories', categoryData); // Add activity category
      return response.data;
    } catch (error) {
      console.error("Error adding activity category:", error);
      throw error;
    }
  },

  // Method to update an existing activity category
  updateActivityCategory: async (categoryId, categoryData) => {
    try {
      const response = await axiosInstance.put(`/api/activity-categories/${categoryId}`, categoryData); // Update activity category
      return response.data;
    } catch (error) {
      console.error("Error updating activity category:", error);
      throw error;
    }
  },

  // Method to delete an activity category
  deleteActivityCategory: async (categoryId) => {
    try {
      const response = await axiosInstance.delete(`/api/activity-categories/${categoryId}`); // Delete activity category
      return response.data;
    } catch (error) {
      console.error("Error deleting activity category:", error);
      throw error;
    }
  },
  //view documents
  viewDocuments: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/admin/viewUploadedUserDocuments/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  },
  listComplaints: async (page = 1, limit = 10, sort = "desc", status = "") => {
    try {
      const response = await axiosInstance.get('/api/admin/complaints', {
        params: { page, limit, sort, status },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching paginated complaints:", error);
      throw error;
    }
  },

  // Method to fetch details of a specific complaint
  getComplaintDetails: async (complaintId) => {
    try {
      const response = await axiosInstance.get(`/api/admin/complaints/${complaintId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      throw error;
    }
  },

  // Method to update a complaint status
  updateComplaintStatus: async (complaintId, status) => {
    try {
      const response = await axiosInstance.patch(`/api/admin/complaints/${complaintId}/status`, { status }); // Update complaint status
      return response.data;
    } catch (error) {
      console.error("Error updating complaint status:", error);
      throw error;
    }
  },

  // Method to reply to a complaint
  replyToComplaint: async (complaintId, replyText) => {
    try {
      const response = await axiosInstance.post(`/api/admin/complaints/${complaintId}/reply`, { replyText }); // Reply to complaint
      return response.data;
    } catch (error) {
      console.error("Error replying to complaint:", error);
      throw error;
    }
  },


  getAllItineraries: async (page, limit = 10) => {
    try {
      const response = await axiosInstance.get(`/api/itineraries/getAllUpcoming?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch itineraries');
    }
  },

  // Method to flag an itinerary as inappropriate
  flagItinerary: async (itineraryId) => {
    try {
      const response = await axiosInstance.patch(`/api/admin/flagItinerary`, { itineraryId });
      return response.data;
    } catch (error) {
      console.error("Error flagging itinerary:", error);
      throw error;
    }
  },

  // Method to fetch activities
  getActivities: async (page, limit = 10) => {
    try {
      const response = await axiosInstance.get(`/api/activity/upcoming-activities?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch activities');

    }
  },

  // Method to flag an activity as inappropriate
  flagActivity: async (activityId) => {
    try {
      const response = await axiosInstance.patch(`/api/admin/flagActivity`, { activityId });
      return response.data;
    } catch (error) {
      console.error("Error flagging activity:", error);
      throw error;
    }
  },
  //get admin by id
  getAdminProfileById: async () => {
    try {
      const response = await axiosInstance.get(`/api/admin/readProfile`);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      throw error;
    }
  },


  // Method to get admin revenue with filters
  getAdminRevenue: async (filters) => {
    try {
      // Use Axios's `params` option to handle query parameters dynamically
      const response = await axiosInstance.get(`/api/admin/revenue`, {
        params: filters, // Pass filters directly to the params object
      });
      console.log("Admin Revenue API Response:", response.data); // Debugging log
      return response.data;
    } catch (error) {
      console.error("Error fetching admin revenue:", error);
      throw error;
    }
  },
  getUserStatistics: async () => {
    try {
      const response = await axiosInstance.get('/api/admin/getUsersStats'); // Fetch user stats
      return response.data; // Return the API response data
    } catch (error) {
      console.error("Weeeee", error);
      throw error; // Rethrow error for handling in the component
    }
  },
  createPromoCode:async (promoCodeData) => {
    try {
      const response = await axiosInstance.post('/api/admin/promoCode/create', promoCodeData);
      return response.data;
    } catch (error) {
      console.error("Error creating promo code:", error);
      throw error;
    }
  },
  
};
export default AdminService;
