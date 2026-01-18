import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

const RoleGuard = ({
    allowedRoles,
    children,
    fallbackPath = "/",
    showUnauthorized = false
}) => {
    const { user, loading, isAuthenticated } = useAuth();

    // Show loading while authentication status is being determined
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Verifying permissions...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Extract user role - handle both possible data structures
    let userRole;
    if (user?.user?.roles && user.user.roles.length > 0) {
        // Handle nested structure: user.user.roles[0]
        const firstRole = user.user.roles[0];
        userRole = typeof firstRole === 'object' ? (firstRole.name || firstRole.value || firstRole) : firstRole;
    } else if (user?.role) {
        // Handle flat structure: user.role
        userRole = user.role;
    } else if (user?.roles && user.roles.length > 0) {
        // Handle direct roles array: user.roles[0]
        const firstRole = user.roles[0];
        userRole = typeof firstRole === 'object' ? (firstRole.name || firstRole.value || firstRole) : firstRole;
    } else {
        userRole = 'user'; // Default role
    }

    // Check if user has required role
    const normalizedUserRole = userRole?.toLowerCase();
    const hasRequiredRole = allowedRoles.some(role =>
        role.toLowerCase() === normalizedUserRole
    );

    console.log("ROLE GUARD: User role:", normalizedUserRole, "Required roles:", allowedRoles, "Has access:", hasRequiredRole);

    if (!hasRequiredRole) {
        if (showUnauthorized) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
                    <div className="text-center bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md max-w-md">
                        <div className="mb-4">
                            <svg className="w-12 h-12 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Access Denied
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            You don't have permission to access this area. Required roles: {allowedRoles.join(', ')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Your current role: {userRole || 'Unknown'}
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-2"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => window.location.href = fallbackPath}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            );
        }

        return <Navigate to={fallbackPath} replace />;
    }

    // User has required role, render children
    return children ? children : <Outlet />;
};

export default RoleGuard;