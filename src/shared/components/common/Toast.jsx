import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
    useEffect(() => {
        if (toast.duration === 0) return; // Persistent toast

        const timer = setTimeout(() => {
            onClose(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onClose]);

    const getIcon = () => {
        const iconProps = { className: "w-5 h-5" };

        switch (toast.type) {
            case 'success':
                return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-500`} />;
            case 'error':
                return <XCircle {...iconProps} className={`${iconProps.className} text-red-500`} />;
            case 'warning':
                return <AlertCircle {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
            case 'info':
                return <Info {...iconProps} className={`${iconProps.className} text-blue-500`} />;
            default:
                return <Info {...iconProps} className={`${iconProps.className} text-blue-500`} />;
        }
    };

    const getToastStyles = () => {
        const baseStyles = 'flex items-center p-4 mb-2 rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out animate-in slide-in-from-right-full backdrop-blur-sm';

        switch (toast.type) {
            case 'success':
                return `${baseStyles} bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700`;
            case 'error':
                return `${baseStyles} bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700`;
            case 'warning':
                return `${baseStyles} bg-yellow-50 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-700`;
            case 'info':
                return `${baseStyles} bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-700`;
            default:
                return `${baseStyles} bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700`;
        }
    };

    const getTextColor = () => {
        switch (toast.type) {
            case 'success':
                return 'text-green-800 dark:text-green-100';
            case 'error':
                return 'text-red-800 dark:text-red-100';
            case 'warning':
                return 'text-yellow-800 dark:text-yellow-100';
            case 'info':
                return 'text-blue-800 dark:text-blue-100';
            default:
                return 'text-gray-800 dark:text-gray-100';
        }
    };

    const getCloseButtonColor = () => {
        switch (toast.type) {
            case 'success':
                return 'hover:bg-green-200 dark:hover:bg-green-800';
            case 'error':
                return 'hover:bg-red-200 dark:hover:bg-red-800';
            case 'warning':
                return 'hover:bg-yellow-200 dark:hover:bg-yellow-800';
            case 'info':
                return 'hover:bg-blue-200 dark:hover:bg-blue-800';
            default:
                return 'hover:bg-gray-200 dark:hover:bg-gray-800';
        }
    };

    return (
        <div
            className={getToastStyles()}
            role="alert"
            aria-live="polite"
        >
            <div className="flex-shrink-0">
                {getIcon()}
            </div>
            <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${getTextColor()}`}>
                    {toast.message}
                </p>
                {toast.description && (
                    <p className={`text-sm mt-1 ${getTextColor()} opacity-90`}>
                        {toast.description}
                    </p>
                )}
            </div>
            <button
                onClick={() => onClose(toast.id)}
                className={`ml-auto flex-shrink-0 p-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current ${getCloseButtonColor()}`}
                aria-label="Close notification"
            >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
        </div>
    );
};

export const ToastContainer = ({ toasts, onCloseToast }) => {
    if (!toasts || !toasts.length) return null;

    return (
        <div
            className="fixed top-4 right-4 z-[9999] w-80 max-w-[calc(100vw-2rem)] space-y-2"
            aria-live="polite"
            aria-atomic="true"
        >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onClose={onCloseToast}
                />
            ))}
        </div>
    );
};