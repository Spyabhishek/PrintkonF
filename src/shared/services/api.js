import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL;

const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/logout",
  "/auth/refresh",
  "/auth/signup",
  "/auth/activate",
  "/auth/request-reset",
];

const PUBLIC_ENDPOINTS = [
  "/products",
  "/categories",
  "/cms",
  "/testimonials",
  "/stats",
  "/images", // allow images to be fetched publicly if your backend allows it
];

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      timeout: 10000,
    });

    this.isRefreshing = false;
    this.failedQueue = [];
    this.isLoggedOut = false;

    this.setupInterceptors();
  }

  // helper to check path regardless of absolute/relative url
  _urlPathMatches(url, list) {
    if (!url) return false;
    // strip base url if present
    try {
      const parsed = new URL(url, API_BASE_URL);
      const path = parsed.pathname || url;
      return list.some((prefix) => path.startsWith(prefix));
    } catch (e) {
      // fallback: treat url as path
      return list.some((prefix) => url.startsWith(prefix));
    }
  }

  setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        // normalize url path check
        const url = config.url || "";
        const isAuthUrl = this._urlPathMatches(url, AUTH_ENDPOINTS);
        const isPublicUrl = this._urlPathMatches(url, PUBLIC_ENDPOINTS);

        // If we've explicitly set logged out, block only protected endpoints
        if (this.isLoggedOut && !isAuthUrl && !isPublicUrl) {
          console.log("API REQUEST: Skipping protected request due to logged out state:", url);
          // returning a rejected Promise so caller gets an error that can be handled
          return Promise.reject({
            message: "User is logged out",
            config,
            response: { status: 401 },
          });
        }

        // Add Authorization header if present in defaults (set by auth flow)
        if (this.api.defaults.headers.common["Authorization"]) {
          config.headers["Authorization"] = this.api.defaults.headers.common["Authorization"];
        }

        console.log(`API REQUEST: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log(`API SUCCESS: ${response.config.method?.toUpperCase()} ${response.config.url}`);
        return response;
      },
      async (error) => {
        const originalRequest = error.config || {};
        console.log(`API ERROR: ${originalRequest.method?.toUpperCase()} ${originalRequest.url} - Status: ${error.response?.status}`);

        if (this.isLoggedOut) {
          return Promise.reject(error);
        }

        // Do not attempt to refresh for auth endpoints
        if (this._urlPathMatches(originalRequest.url, AUTH_ENDPOINTS)) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => this.api(originalRequest)).catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            console.log("API INTERCEPTOR: Attempting token refresh");
            const refreshResponse = await this.api.post("/auth/refresh");
            const { accessToken } = refreshResponse.data?.data || {};

            if (accessToken) {
              this.api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
              originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            }

            this.processQueue(null);
            return this.api(originalRequest);
          } catch (refreshError) {
            console.log("API INTERCEPTOR: Refresh failed, handling auth failure");
            this.processQueue(refreshError);
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  processQueue(error) {
    this.failedQueue.forEach(({ resolve, reject }) =>
      error ? reject(error) : resolve()
    );
    this.failedQueue = [];
  }

  handleAuthFailure() {
    console.log("API INTERCEPTOR: Handling auth failure");
    this.isLoggedOut = true;
    delete this.api.defaults.headers.common["Authorization"];
    window.dispatchEvent(new CustomEvent("auth:logout"));
  }

  resetLoggedOutState() {
    this.isLoggedOut = false;
  }

  getInstance() {
    return this.api;
  }
}

const apiService = new ApiService();
export const api = apiService.getInstance();
export { apiService };
export default api;
