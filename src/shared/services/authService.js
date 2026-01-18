import { api, apiService } from "./api";
import { getDeviceInfo, clearDeviceId } from "../utils/deviceUtils";

class AuthService {
  constructor() {
    this.currentUser = null;
  }

  async login(payload) {
    try {
      const deviceInfo = getDeviceInfo();
      const loginData = { ...payload, ...deviceInfo };

      // Reset logged out state before login attempt
      apiService.resetLoggedOutState();

      const response = await api.post("/auth/login", loginData);

      // Cache the user data from login response
      if (response.data?.data) {
        this.currentUser = response.data.data;
        console.log("AUTH SERVICE: Login successful, cached user:", this.currentUser);
      }

      return response;
    } catch (error) {
      console.error("AUTH SERVICE: Login failed:", error);
      this.clearCachedUser();
      throw error;
    }
  }

  async signup(payload) {
    const deviceInfo = getDeviceInfo();
    const signupData = { ...payload, ...deviceInfo };
    return api.post("/auth/signup", signupData);
  }

  async logout() {
    try {
      const response = await api.post("/auth/logout");
      this.clearCachedUser();
      return response;
    } catch (error) {
      // Always clear cached user on logout, even if API call fails
      this.clearCachedUser();
      throw error;
    }
  }

  async refresh() {
    return api.post("/auth/refresh");
  }

  async me() {
    try {
      const response = await api.get("/auth/me");

      // Update cached user data
      if (response.data?.data) {
        this.currentUser = response.data.data;
        console.log("AUTH SERVICE: Updated cached user from /me");
      }

      return response;
    } catch (error) {
      console.error("AUTH SERVICE: /me request failed:", error);
      if (error.response?.status === 401) {
        this.clearCachedUser();
      }
      throw error;
    }
  }

  async checkAuth() {
    try {
      console.log("AUTH SERVICE: Checking authentication...");

      // First try to get user data from /me endpoint
      const response = await this.me();

      if (response.data?.data) {
        return {
          isAuthenticated: true,
          user: response.data.data
        };
      } else {
        return {
          isAuthenticated: false,
          user: null
        };
      }
    } catch (error) {
      console.error("AUTH SERVICE: Auth check failed:", error);

      // Clear cached user on auth failure
      this.clearCachedUser();

      return {
        isAuthenticated: false,
        user: null
      };
    }
  }

  getCachedUser() {
    return this.currentUser;
  }

  clearCachedUser() {
    console.log("AUTH SERVICE: Clearing cached user");
    this.currentUser = null;
  }

  async activate(token) {
    return api.get("/auth/activate", { params: { token } });
  }

  async requestReset(email) {
    return api.post("/auth/request-reset", { email });
  }

  clearStoredDeviceId() {
    clearDeviceId();
  }
}

export const authService = new AuthService();