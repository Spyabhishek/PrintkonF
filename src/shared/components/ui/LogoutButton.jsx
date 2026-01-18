import React from "react";
import { useAuth } from "../../hooks/useAuth";

const LogoutButton = ({ className = "" }) => {
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
            // Even if logout fails on backend, we still clear frontend state
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={`px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors ${className}`}
        >
            Logout {user?.name && `(${user.name})`}
        </button>
    );
};

export default LogoutButton;