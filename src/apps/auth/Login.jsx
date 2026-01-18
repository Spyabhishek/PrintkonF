import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import AuthLayout from "./layouts/AuthLayout";
import ThemeToggle from "../../shared/components/common/ThemeToggle";
import Loading from "../../shared/components/ui/Loading";

const Login = () => {
  const { login, loading: authLoading, isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the intended destination before login
  const from = location.state?.from;

  // Handle already authenticated users
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      console.log("LOGIN: User already authenticated, should redirect");

      // Get user role for redirection
      let userRole;
      if (user.user?.roles && user.user.roles.length > 0) {
        const firstRole = user.user.roles[0];
        userRole = typeof firstRole === 'object' ? (firstRole.name || firstRole.value || firstRole) : firstRole;
      } else {
        userRole = 'user';
      }

      // Determine redirect path
      let redirectPath;
      switch (userRole?.toLowerCase()) {
        case 'admin':
          redirectPath = '/admin';
          break;
        case 'operator':
          redirectPath = '/operator';
          break;
        case 'superadmin':
          redirectPath = '/superadmin';
          break;
        default:
          redirectPath = '/user/dashboard';
      }

      console.log("LOGIN: Redirecting authenticated user to:", redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      console.log("LOGIN: Attempting login...");
      await login(formData);
      console.log("LOGIN: Login function completed successfully");
      // Navigation is handled by the login function in AuthContext
    } catch (error) {
      console.error("LOGIN: Login error:", error);

      // Handle different types of errors
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many login attempts. Please try again later.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message === "No user data received after login") {
        errorMessage = "Login successful but user data is missing. Please try again.";
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <AuthLayout>
        <Loading text="Checking authentication..." />
      </AuthLayout>
    );
  }

  // Don't render login form if already authenticated - show loading instead
  if (isAuthenticated && user) {
    return (
      <AuthLayout>
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            You are already logged in. Redirecting to dashboard...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          {from && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please log in to access <span className="font-medium">{from.pathname}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>

          <div className="space-y-2 text-center text-sm">
            <div>
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                tabIndex={isSubmitting ? -1 : 0}
              >
                Don't have an account? Sign up
              </Link>
            </div>
            <div>
              <Link
                to="/request-reset"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                tabIndex={isSubmitting ? -1 : 0}
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;