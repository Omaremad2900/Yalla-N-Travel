// src/services/userService.js
import axiosInstance from '../axios';

const userService = {
  changePassword: async (newPassword, confirmPassword) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve JWT token from local storage
      const response = await axiosInstance.put(
        '/api/user/changePassword',
        { password: newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to change password';
    }
  },

   forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.put('/api/user/forgotPassword', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to send reset code';
    }
  },

  verifyResetCode: async (email, resetCode) => {
    try {
      const response = await axiosInstance.put('/api/user/resetPassword', { email, newPassword });

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Invalid or expired reset code';
    }
  },

  resetPassword: async (email, newPassword) => {
    try {
      const response = await axiosInstance.put('/api/user/resetPassword', { email, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to reset password';
    }
  },
};

export default userService;
