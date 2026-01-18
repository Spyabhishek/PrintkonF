import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AuthGuard = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading while authentication status is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the current location as return URL
  if (!isAuthenticated) {
    console.log("AUTH GUARD: User not authenticated, redirecting to login");
    console.log("AUTH GUARD: Saving return URL:", location.pathname + location.search);

    return (
      <Navigate
        to="/login"
        state={{
          from: {
            pathname: location.pathname,
            search: location.search,
            // Preserve any existing state as well
            state: location.state
          }
        }}
        replace
      />
    );
  }

  // If authenticated but user data is missing, show error state
  if (isAuthenticated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md max-w-md">
          <div className="mb-4">
            <svg className="w-12 h-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Authentication Error
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            There was an issue loading your user data. Please try logging in again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AuthGuard;