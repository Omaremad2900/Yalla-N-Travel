import axios from 'axios';
import { store } from '../src/redux/store.js';
import { redirectToLogin } from './utils/redirect.jsx';
import { updateToken,signOutUserSuccess} from '../src/redux/user/userSlice.js'; // Action to update the token in Redux

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://192.168.49.2:30080',
  timeout: 10000,
});

const clearSessionAndRedirect = () => {
  store.dispatch(updateToken(null)); // Clear the token in the Redux store
  store.dispatch(signOutUserSuccess()); // Sign the user out
  redirectToLogin(); // Redirect to login page
}

// Function to refresh the token
const newAccessToken = async () => {
  const { user: { currentUser } } = store.getState();

  try {
    const response = await axios.post('http://192.168.49.2:30080/api/auth/refresh', {
      refreshToken: currentUser.refreshToken,
    });

  

    const { token } = response.data;
    store.dispatch(updateToken(token)); // Update token in Redux store
    return token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    clearSessionAndRedirect(); // Clear session and redirect on error
    return null;
  }
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.currentUser?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      const refreshToken = store.getState().user.currentUser?.refreshToken;
      if (refreshToken) {
        const newToken = await newAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest); // Retry the original request with new token
        }
      }

      // If refresh token is invalid, clear session and redirect to login
      clearSessionAndRedirect();
    } else {
      if(error.response.status === 401)
      redirectToLogin(); // Redirect if no refresh token
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
