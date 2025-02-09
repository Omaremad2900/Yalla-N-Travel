import axiosInstance from '../axios'; // Import your axios instance (config with baseURL, etc.)

const SellerService = {
  createSeller: async (sellerData) => {
    try {
      const response = await axiosInstance.post('/api/seller/createseller', sellerData);
      return response;
    } catch (error) {
      console.error('Error creating seller:', error);
      throw error;
    }
  },

  updateSeller: async (sellerData) => {
    try {
      const response = await axiosInstance.put('/api/seller/updateseller', sellerData);
      return response.data;
    } catch (error) {
      console.error('Error updating seller:', error);
      throw error;
    }
  },

  getSeller: async () => {
    try {
      const response = await axiosInstance.get('/api/seller/getSeller');
      return response.data;
    } catch (error) {
      console.error('Error fetching seller data:', error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await axiosInstance.post('/api/products/create', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  editProduct: async (productId, productData) => {
    try {
      const response = await axiosInstance.put(`/api/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error editing product:', error);
      throw error;
    }
  },

  getProduct: async (productId) => {
    try {
      const response = await axiosInstance.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  },

  uploadProductImage: async (formData) => {
    try {
      const response = await axiosInstance.post('/upload/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type to form-data
        },
      });
      return response.data.imageUrl; // Return the image URL from the backend
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw error;
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

  getProductForSeller: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get('/api/seller/getProducts', {
        params: { page, limit }
      }
      );
      return response;
    } catch (error) {
      console.error('Error fetching product by SellerID:', error);
      throw error;
    }
  },

  requestAccountDeletion: async (userId) => {
    try {
      const response = await axiosInstance.put(`/api/seller/requestDeleteseller`, { userId });
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

  getSellerRevenue: async (filters) => {
    try {
      // Use Axios's `params` option to handle query parameters dynamically
      const response = await axiosInstance.get(`/api/seller/getSellerRevenue`, {
        params: filters, // Pass the filters object directly
      });
      console.log("API Response:", response.data); // Debugging log
      return response.data;
    } catch (error) {
      console.error("Error fetching seller revenue:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  },







};

export default SellerService;