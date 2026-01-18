import React from "react";

export default function Loading({
    text = "Loading...",
    size = "default",
    variant = "spinner",
    fullScreen = false
}) {
    const sizeClasses = {
        small: "w-4 h-4",
        default: "w-5 h-5",
        large: "w-8 h-8"
    };

    const containerClasses = fullScreen
        ? "min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950"
        : "min-h-[200px] flex items-center justify-center";

    const renderSpinner = () => (
        <svg
            className={`${sizeClasses[size]} animate-spin`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                strokeWidth="4"
                className="opacity-25"
            />
            <path
                d="M4 12a8 8 0 018-8"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    );

    const renderDots = () => (
        <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                />
            ))}
        </div>
    );

    const renderPulse = () => (
        <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse`} />
    );

    const renderVariant = () => {
        switch (variant) {
            case "dots":
                return renderDots();
            case "pulse":
                return renderPulse();
            case "spinner":
            default:
                return renderSpinner();
        }
    };

    return (
        <div className={containerClasses}>
            <div className="flex items-center gap-3">
                <div className="text-blue-500">
                    {renderVariant()}
                </div>
                {text && (
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {text}
                    </div>
                )}
            </div>
        </div>
    );
}