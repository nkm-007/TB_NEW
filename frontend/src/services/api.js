// import axios from "axios";

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/api",
// });

// export default API;
// frontend/src/services/api.js
// Updated with automatic JWT error handling

import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/api",
});

// Flag to prevent multiple logout alerts
let isLoggingOut = false;

// Response interceptor to handle JWT errors
API.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // Check if error is JWT related
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 (Unauthorized) - Invalid or expired token
      if (status === 401 && data.requiresLogin) {
        if (!isLoggingOut) {
          isLoggingOut = true;

          console.log("Token invalid or expired. Logging out...");

          // Clear all auth data
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Trigger auth change event
          window.dispatchEvent(new Event("auth-change"));

          // Show alert only once
          alert(data.msg || "Your session has expired. Please login again.");

          // Redirect to login
          window.location.href = "/login";

          // Reset flag after a delay
          setTimeout(() => {
            isLoggingOut = false;
          }, 1000);
        }

        // Reject the promise
        return Promise.reject(error);
      }
    }

    // For all other errors, just reject
    return Promise.reject(error);
  }
);

export default API;
