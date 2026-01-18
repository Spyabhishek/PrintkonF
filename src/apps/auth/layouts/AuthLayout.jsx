import React from "react";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}