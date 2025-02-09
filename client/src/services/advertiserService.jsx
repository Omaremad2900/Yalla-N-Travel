import axiosInstance from '../axios';

const advertiserService = {
    createAdvertiserProfile: async (profileData) => {
        try {
            const response = await axiosInstance.post('/api/advertiser', profileData);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create profile');
        } 
    },

    updateAdvertiserProfile: async (id, profileData) => {
        try {
            const response = await axiosInstance.put(`/api/advertiser/${id}`, profileData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    },

    getAllAdvertiserProfiles: async () => {
        try {
            const response = await axiosInstance.get('/api/advertiser');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profiles');
        }
    },

    getAdvertiserProfileById: async (id) => {
        try {
            const response = await axiosInstance.get(`/api/advertiser/read/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
        }
    },

    getMyActivities: async (page = 1, limit = 10) => {
        try {
            const response = await axiosInstance.get('/api/advertiser/my-activities', {
                params: { page, limit },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch activities');
        }

    },

    createActivity: async (activityData) => {
        try {
            const response = await axiosInstance.post('/api/advertiser/create-activity', activityData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create activity');
        }
    },

    updateActivity: async (activityId, activityData) => {
        try {
            const response = await axiosInstance.patch(`/api/advertiser/${activityId}`, activityData); // Corrected the URL to match the route
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update activity');
        }
    },

    deleteActivity: async (activityId) => {
        try {
            const response = await axiosInstance.delete(`/api/advertiser/${activityId}`);
            return response.data; // Return the response data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete activity');
        }
    },

    getAllPreferenceTags: async () => {
        try {
            const response = await axiosInstance.get('/api/preference-tags');
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch tags');
        }
    },

    getAllCategories: async () => {
        try {
            const response = await axiosInstance.get('/api/activity-categories');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
        }
    },

    // New createTransportation method
    createTransportation: async (transportationData) => {
        try {
            const response = await axiosInstance.post('/api/advertiser/createTransportation', transportationData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create transportation');
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
    uploadPictures: async (formData) => {
        try {
            const response = await axiosInstance.post('/upload/activity-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type to form-data
                },
            });
            return response.data.imageUrls; // Return the image URL from the backend
        } catch (error) {
            console.error('Error uploading product image:', error);
            throw error;
        }
    },

    requestAccountDeletion: async (userId) => {
        try {
            const response = await axiosInstance.put(`/api/advertiser/requestDeleteAdvertiser`, { userId });
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
    getAdvReport: async (filters) => {
        try {
            const response = await axiosInstance.get('/api/advertiser/getAdvReport', {
                params: filters,
            });
            console.log("Advertiser Revenue API Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching advertiser report:", error);
            throw new Error(error.response?.data?.message || "Failed to fetch advertiser report");
        }
    },
    viewTouristStatistics: async (month, year) => {
        try {
          console.log('Requesting tourist statistics for month:', month, 'year:', year); // Log request details
          const response = await axiosInstance.get('/api/advertiser/getReport', {
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
}

export default advertiserService;
