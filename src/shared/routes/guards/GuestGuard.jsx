import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const GuestGuard = () => {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading while authentication status is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    const getRedirectPath = (role) => {
      console.log("GUEST GUARD: Input role:", role, "Type:", typeof role);

      switch (role?.toLowerCase()) {
        case 'admin':
          console.log("GUEST GUARD: Matched admin");
          return '/admin';
        case 'operator':
          console.log("GUEST GUARD: Matched operator");
          return '/operator';
        case 'superadmin':
          console.log("GUEST GUARD: Matched superadmin");
          return '/superadmin';
        default:
          console.log("GUEST GUARD: Using default, returning /");
          return '/'; 
      }
    };

    // Access role correctly from user.user.roles[0]
    let userRole;
    if (user.user?.roles && user.user.roles.length > 0) {
      const firstRole = user.user.roles[0];
      userRole = typeof firstRole === 'object' ? (firstRole.name || firstRole.value || firstRole) : firstRole;
    } else {
      userRole = 'user';
    }

    console.log("GUEST GUARD: Final userRole:", userRole);
    const redirectPath = getRedirectPath(userRole);
    console.log("GUEST GUARD: Redirect path:", redirectPath);

    return <Navigate to={redirectPath} replace />;
  }

  // User is not authenticated, allow access to guest routes
  return <Outlet />;
};

export default GuestGuard;