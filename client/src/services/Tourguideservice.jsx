import axiosInstance from '../axios'; // Assuming axiosInstance is already configured

const TourguideService = {
  // Add an itinerary
  addItinerary: async (itineraryDetails) => {
    try {
      const response = await axiosInstance.post('/api/itineraries', {
        ...itineraryDetails,
      });
      return response.data;
    } catch (error) {
      throw new Error('Error adding itinerary: ' + error.message);
    }
  },

  // Delete an itinerary
  deleteItinerary: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/itineraries/${id}`);
      return response.status === 200;
    } catch (error) {
      throw new Error('Error deleting itinerary: ' + error.message);
    }
  },

  // Get all itineraries
  getItineraries: async (page) => {
    try {
      const response = await axiosInstance.get('/api/itineraries', {
        params: { page }, // Sending the page as a URL parameter
      });
      return response.data;
    } catch (error) {
      throw new Error('Error fetching itineraries: ' + error.message);
    }
  },

  // Edit an itinerary
  editItinerary: async (id, itineraryDetails) => {
    try {
      const response = await axiosInstance.patch(`/api/itineraries/${id}`, {
        ...itineraryDetails,
      });
      return response.data;
    } catch (error) {
      throw new Error('Error editing itinerary: ' + error.message);
    }
  },

  // Get a single itinerary by id
  getItineraryById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/itineraries/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching itinerary: ' + error.message);
    }
  },

  toggleItineraryStatus: async (id, status) => {
    try {
      console.log("Sending to backend:", { id, status });
      const response = await axiosInstance.put(
        '/api/tourGuide/toggleStatus',
        {
          id: id,
          status: status
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Response from backend:", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else {
        console.error("Error updating itinerary status:", error);
      }
      throw error;
    }
  },

  // Create a tour guide
  createTourGuide: async (tourGuideData) => {
    try {
      const response = await axiosInstance.post('/api/tourguide/create', tourGuideData);
      return response.data;
    } catch (error) {
      throw new Error('Error creating tour guide: ' + error.message);
    }
  },

  // Get all tour guides
  getAllTourGuides: async (page, limit) => {
    try {
      const response = await axiosInstance.get(`/api/tourGuides?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching tour guides: ' + error.message);
    }
  },

  // Get a specific tour guide by id
  getTourGuideById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/tourguide/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching tour guide: ' + error.message);
    }
  },

  // Update a tour guide
  updateTourGuide: async (tourGuideData) => {
    try {
      const response = await axiosInstance.put('/api/tourGuide/updateTourGuide', tourGuideData);

      return response.data;
    } catch (error) {
      throw new Error('Error updating tour guide: ' + error.message);
    }
  },

  // Delete a tour guide
  deleteTourGuide: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/tourguide/${id}`);
      return response.status === 200;
    } catch (error) {
      throw new Error('Error deleting tour guide: ' + error.message);
    }
  },

  // Get itineraries created by a tour guide
  getMyItineraries: async (page, limit) => {
    try {
      const response = await axiosInstance.get(`/api/tourguide/itineraries?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching your itineraries: ' + error.message);
    }
  },
  uploadProfilePicture: async (formData) => {
    try {
      const response = await axiosInstance.post('/upload/profile-Picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type to form-data
        },
      });
      return response.data.imageUrl; // Return the image URL from the backend
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  },
  createTourGuide: async (tourGuideData) => {
    try {

      const response = await axiosInstance.post('/api/tourGuide/createTourGuide', tourGuideData);
      return response;
    } catch (error) {
      console.error('Error creating Tour Guide:', error);
      throw error;
    }
  },
  requestAccountDeletion: async (userId) => {
    try {
      const response = await axiosInstance.put(`/api/tourGuide/requestDeleteTourGuide`, { userId });
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

  viewTouristStatistics: async (month, year) => {
    try {
      console.log('Requesting tourist statistics for month:', month, 'year:', year); // Log request details
      const response = await axiosInstance.get('/api/tourGuide/getTouristReport', {
        params: { month, year }, // Send both parameters
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token
        },
      });
      console.log('Received tourist statistics data:', response.data); // Log the response
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error fetching tourist statistics:', error.response.data); // Log detailed error
      }
      throw new Error(
        `Error fetching tourist statistics: ${error.response?.data?.message || error.message}`
      );
    }
  },
  
  getTourGuideRevenue: async (filters) => {
    try {
      // Use Axios's `params` option to pass filters dynamically
      const response = await axiosInstance.get(`/api/tourGuide/getRevenue`, {
        params: filters,
      });
      console.log("Tour Guide Revenue API Response:", response.data); // Debugging log
      return response.data;
    } catch (error) {
      console.error("Error fetching tour guide revenue:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  },

};

export default TourguideService;
