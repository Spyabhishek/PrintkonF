import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authService } from "../services/authService";
import { setUser, clearUser } from "../../store/slices/authSlice";

export const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => { },
  logout: async () => { },
  refreshUser: async () => { },
});

export function AuthProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Use ref to track initialization to prevent multiple auth checks
  const isInitialized = useRef(false);

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/activate",
    "/request-reset",
    "/products",
    "/categories",
    "/test",
  ];

  // Check if current path is public
  const isPublicPath = useCallback((pathname) => {
    return publicPaths.some(path => {
      if (path === pathname) return true;
      if (path === "/products" && pathname.startsWith("/products/")) return true;
      if (path === "/activate" && pathname.startsWith("/activate")) return true;
      if (path === "/request-reset" && pathname.startsWith("/request-reset")) return true;
      return false;
    });
  }, []);

  // Get redirect path based on user role (fallback only)
  const getRoleBasedPath = useCallback((role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '/admin';
      case 'operator':
        return '/operator';
      case 'superadmin':
        return '/superadmin';
      default:
        return '/';
    }
  }, []);

  // Get redirect path considering previous location and user role
  const getRedirectPath = useCallback((role, fromLocation = null) => {
    // If there's a previous location (where user was before login)
    if (fromLocation?.pathname) {
      const previousPath = fromLocation.pathname;

      // Don't redirect back to auth pages
      if (['/login', '/signup', '/activate', '/request-reset'].includes(previousPath)) {
        return getRoleBasedPath(role);
      }

      // Check if user has permission to access the previous path
      const isRoleRestrictedPath = (path, userRole) => {
        const lowerRole = userRole?.toLowerCase();

        if (path.startsWith('/admin')) return !['admin', 'superadmin'].includes(lowerRole);
        if (path.startsWith('/operator')) return !['operator', 'admin', 'superadmin'].includes(lowerRole);
        if (path.startsWith('/superadmin')) return lowerRole !== 'superadmin';

        return false; // Other paths are accessible to authenticated users
      };

      // If user can access the previous path, redirect there
      if (!isRoleRestrictedPath(previousPath, role)) {
        console.log("AUTH CONTEXT: Redirecting back to previous location:", previousPath);
        return previousPath;
      }
    }

    // Fallback to role-based path
    return getRoleBasedPath(role);
  }, [getRoleBasedPath]);

  // Set authentication state - UPDATED TO SYNC WITH REDUX
  const setAuthState = useCallback((userData) => {
    console.log("AUTH CONTEXT: Setting auth state:", userData ? "authenticated" : "not authenticated");

    if (userData) {
      setUserState(userData);
      setIsAuthenticated(true);
      authService.currentUser = userData;

      // 🔥 SYNC WITH REDUX
      dispatch(setUser(userData));
      console.log("AUTH CONTEXT: User synced to Redux");
    } else {
      setUserState(null);
      setIsAuthenticated(false);
      authService.clearCachedUser();

      // 🔥 CLEAR REDUX
      dispatch(clearUser());
      console.log("AUTH CONTEXT: User cleared from Redux");
    }
  }, [dispatch]);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      console.log("AUTH CONTEXT: Starting login...");

      const response = await authService.login(credentials);
      const userData = authService.getCachedUser();

      if (!userData) {
        throw new Error("No user data received after login");
      }

      console.log("AUTH CONTEXT: Login successful, user data:", userData);
      setAuthState(userData);

      // Get the first role for navigation
      let userRole;
      if (userData.user?.roles && userData.user.roles.length > 0) {
        const firstRole = userData.user.roles[0];
        userRole = typeof firstRole === 'object' ? (firstRole.name || firstRole.value || firstRole) : firstRole;
      } else {
        userRole = 'user';
      }

      // Get redirect path considering previous location
      const fromLocation = location.state?.from;
      const redirectPath = getRedirectPath(userRole, fromLocation);

      console.log("AUTH CONTEXT: From location:", fromLocation?.pathname);
      console.log("AUTH CONTEXT: Redirecting to:", redirectPath);

      // Use setTimeout to ensure state is set before navigation
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);

      return { success: true, user: userData };
    } catch (error) {
      console.error("AUTH CONTEXT: Login failed:", error);
      setAuthState(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate, getRedirectPath, setAuthState, location.state]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("AUTH CONTEXT: Logout error:", error);
    } finally {
      setAuthState(null);
      navigate("/login", { replace: true });
    }
  }, [navigate, setAuthState]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.me();
      const userData = response.data.data;
      setAuthState(userData);
      return userData;
    } catch (error) {
      console.error("AUTH CONTEXT: Refresh user failed:", error);
      setAuthState(null);
      throw error;
    }
  }, [setAuthState]);

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    if (isInitialized.current) {
      console.log("AUTH CONTEXT: Already initialized, skipping...");
      return;
    }

    console.log("AUTH CONTEXT: Initializing auth for path:", location.pathname);
    console.log("AUTH CONTEXT: Is public path:", isPublicPath(location.pathname));

    try {
      setLoading(true);

      const { isAuthenticated: authStatus, user: userData } = await authService.checkAuth();
      console.log("AUTH CONTEXT: Auth check result:", { authStatus, hasUser: !!userData });

      if (authStatus && userData) {
        // User is authenticated
        setAuthState(userData);

        // If user is on auth pages, redirect them to appropriate dashboard
        if (["/login", "/signup"].includes(location.pathname)) {
          let userRole;
          if (userData.user?.roles && userData.user.roles.length > 0) {
            const firstRole = userData.user.roles[0];
            userRole = typeof firstRole === 'object' ? (firstRole.name || firstRole.value || firstRole) : firstRole;
          } else {
            userRole = 'user';
          }

          const redirectPath = getRoleBasedPath(userRole);
          console.log("AUTH CONTEXT: User on auth page, redirecting to:", redirectPath);
          navigate(redirectPath, { replace: true });
        }
      } else {
        // User is not authenticated
        setAuthState(null);

        // Redirect to login only if user is on a private path
        if (!isPublicPath(location.pathname)) {
          console.log("AUTH CONTEXT: User not authenticated, redirecting to login");
          navigate("/login", { replace: true, state: { from: location } });
        }
      }
    } catch (error) {
      console.error("AUTH CONTEXT: Auth initialization error:", error);
      setAuthState(null);

      if (!isPublicPath(location.pathname)) {
        navigate("/login", { replace: true, state: { from: location } });
      }
    } finally {
      setLoading(false);
      isInitialized.current = true;
    }
  }, [location, navigate, isPublicPath, setAuthState, getRoleBasedPath]);

  // Handle logout events (from interceptor)
  const handleLogoutEvent = useCallback(() => {
    console.log("AUTH CONTEXT: Handling logout event");
    setAuthState(null);
    isInitialized.current = false; // Reset initialization

    if (!isPublicPath(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate, isPublicPath, setAuthState]);

  // Initialize auth on mount and path changes
  useEffect(() => {
    console.log("AUTH CONTEXT: useEffect triggered for path:", location.pathname);

    // Reset initialization when path changes to auth-related paths
    if (["/login", "/signup", "/"].includes(location.pathname)) {
      isInitialized.current = false;
    }

    if (!isInitialized.current) {
      initializeAuth();
    }

    // Listen for logout events from interceptor
    const handleLogout = () => handleLogoutEvent();
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [location.pathname, initializeAuth, handleLogoutEvent]);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;