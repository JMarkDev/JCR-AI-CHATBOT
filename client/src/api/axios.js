import axios from "axios";
import Cookie from "js-cookie";

// Create an instance of axios
const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

// Request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = Cookie.get("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/refresh", {});
        const newAccessToken = response.data.accessToken;
        console.log(response.data);

        // Store the new access token
        // localStorage.setItem("accessToken", newAccessToken);

        // Set the new access token in the axios instance
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        console.log(err);
        // Handle token refresh errors (e.g., redirect to login)
      }
    }
    return Promise.reject(error);
  }
);

export default api;
