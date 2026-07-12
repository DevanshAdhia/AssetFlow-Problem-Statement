export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/login/token`,
  GOOGLE_LOGIN: `${API_BASE_URL}/login/google`,
  LOGOUT: `${API_BASE_URL}/login/logout`,
  
  // Signup
  SEND_OTP: `${API_BASE_URL}/signup/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/signup/verify-otp`,
  REGISTER: `${API_BASE_URL}/signup/register`,
  
  // Assets
  ASSETS: `${API_BASE_URL}/assest`,
};
