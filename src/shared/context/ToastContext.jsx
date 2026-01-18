import React, { createContext, useContext, useCallback } from 'react';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/common/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const toast = useToast();

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer
                toasts={toast.toasts}
                onCloseToast={toast.closeToast}
            />
        </ToastContext.Provider>
    );
};

export const useToastContext = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within a ToastProvider');
    }
    return context;
};