
import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = ++toastId;
        const toast = { 
            id, 
            message, 
            type, 
            duration,
            timestamp: Date.now()
        };

        setToasts(prev => {
            // Limit maximum toasts to prevent overflow
            const newToasts = [...prev, toast].slice(-5);
            return newToasts;
        });

        return id;
    }, []);

    const closeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const closeAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    const showSuccess = useCallback((message, duration = 3000) => {
        return showToast(message, 'success', duration);
    }, [showToast]);

    const showError = useCallback((message, duration = 4000) => {
        return showToast(message, 'error', duration);
    }, [showToast]);

    const showWarning = useCallback((message, duration = 4000) => {
        return showToast(message, 'warning', duration);
    }, [showToast]);

    const showInfo = useCallback((message, duration = 3000) => {
        return showToast(message, 'info', duration);
    }, [showToast]);

    return {
        toasts,
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeToast,
        closeAllToasts
    };
};