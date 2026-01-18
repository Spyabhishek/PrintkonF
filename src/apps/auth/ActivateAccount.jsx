import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authService } from "../../shared/services/authService";
import AuthLayout from "./layouts/AuthLayout"

const ActivateAccount = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [message, setMessage] = useState("");

    const token = searchParams.get("token");

    useEffect(() => {
        const activateAccount = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Invalid activation link. No token provided.");
                return;
            }

            try {
                const response = await authService.activate(token);
                setStatus("success");
                setMessage("Your account has been successfully activated!");
            } catch (error) {
                setStatus("error");
                setMessage(
                    error.response?.data?.message ||
                    "Failed to activate account. The link may be expired or invalid."
                );
            }
        };

        activateAccount();
    }, [token]);

    return (
        <AuthLayout>
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 text-center">
                {status === "loading" && (
                    <>
                        <div className="mb-4">
                            <div className="mx-auto w-12 h-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Activating Account...
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Please wait while we activate your account.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mb-4">
                            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Account Activated!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {message}
                        </p>
                        <Link
                            to="/login"
                            className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            Sign In Now
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mb-4">
                            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Activation Failed
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {message}
                        </p>
                        <div className="space-x-4">
                            <Link
                                to="/login"
                                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Go to Login
                            </Link>
                            <Link
                                to="/signup"
                                className="inline-block px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Sign Up Again
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </AuthLayout>
    );
};

export default ActivateAccount;