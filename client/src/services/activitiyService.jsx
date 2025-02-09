import axiosInstance from '../axios'; // Import your Axios instance

const ActivityService = {
  // Get all upcoming activities with sorting
  getAllUpcomingActivitiesWithSorting: async () => {
    try {
      const response = await axiosInstance.get('api/activity/sort-upcoming-activities');
      return response.data; // Adjust this according to your response structure
    } catch (error) {
      console.error('Error fetching sorted upcoming activities:', error);
      throw error; // Rethrow the error to handle it in your components
    }
  },

  // Search activities
  searchActivities: async (query) => {
    try {
      const response = await axiosInstance.get('api/activity/search', {
        params: { query }, // Sending the query as a URL parameter
      });
      return response.data; // Adjust this according to your response structure
    } catch (error) {
      console.error('Error searching activities:', error);
      throw error; // Rethrow the error to handle it in your components
    }
  },

  // Get all upcoming activities
  getAllUpcomingActivities: async (page) => {
    try {
      const response = await axiosInstance.get('api/activity/upcoming-activities',{
        params: { page }, // Sending the page as a URL parameter
      });
      return response.data; // Adjust this according to your response structure
    } catch (error) {
      console.error('Error fetching all upcoming activities:', error);
      throw error; // Rethrow the error to handle it in your components
    }
  },

  // Get all upcoming activities with filters
  getAllUpcomingActivitiesWithFilter: async (filterOptions) => {
    try {
      const response = await axiosInstance.get('api/activity/filter-upcoming-activities', {
        params: filterOptions, // Sending filter options as URL parameters
      });
      return response.data; // Adjust this according to your response structure
    } catch (error) {
      console.error('Error fetching filtered upcoming activities:', error);
      throw error; // Rethrow the error to handle it in your components
    }
  },
  // get activity by id
  getActivityById: async (id) => {
    try {
      const response = await axiosInstance.get(`api/activity/${id}`);
      return response.data; // Adjust this according to your response structure
    } catch (error) {
      console.error('Error fetching activity by id:', error);
      throw error; // Rethrow the error to handle it in your components
    }
  },
};

export default ActivityService;
