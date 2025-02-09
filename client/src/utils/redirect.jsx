// src/utils/redirect.js
import { useNavigate } from 'react-router-dom';

// Create a redirect utility to use programmatically
export const redirectToLogin = () => {
  window.location.href = '/sign-in'; // This approach forces the page to redirect
};
