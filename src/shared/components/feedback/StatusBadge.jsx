// shared/components/feedback/StatusBadge.jsx
import React from 'react';

const STATUS_CONFIG = {
    // Order Statuses
    PENDING_PAYMENT: {
        label: 'Pending Payment',
        color: 'yellow',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        textColor: 'text-yellow-800 dark:text-yellow-300',
        borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    UNDER_REVIEW: {
        label: 'Under Review',
        color: 'purple',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20',
        textColor: 'text-purple-800 dark:text-purple-300',
        borderColor: 'border-purple-200 dark:border-purple-800'
    },
    APPROVED: {
        label: 'Approved',
        color: 'blue',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        textColor: 'text-blue-800 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-800'
    },
    REJECTED: {
        label: 'Rejected',
        color: 'red',
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-800 dark:text-red-300',
        borderColor: 'border-red-200 dark:border-red-800'
    },
    IN_PRODUCTION: {
        label: 'In Production',
        color: 'indigo',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
        textColor: 'text-indigo-800 dark:text-indigo-300',
        borderColor: 'border-indigo-200 dark:border-indigo-800'
    },
    READY_FOR_DELIVERY: {
        label: 'Ready for Delivery',
        color: 'green',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-800 dark:text-green-300',
        borderColor: 'border-green-200 dark:border-green-800'
    },
    OUT_FOR_DELIVERY: {
        label: 'Out for Delivery',
        color: 'teal',
        bgColor: 'bg-teal-100 dark:bg-teal-900/20',
        textColor: 'text-teal-800 dark:text-teal-300',
        borderColor: 'border-teal-200 dark:border-teal-800'
    },
    DELIVERED: {
        label: 'Delivered',
        color: 'green',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-800 dark:text-green-300',
        borderColor: 'border-green-200 dark:border-green-800'
    },
    CANCELLED: {
        label: 'Cancelled',
        color: 'red',
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-800 dark:text-red-300',
        borderColor: 'border-red-200 dark:border-red-800'
    },

    // Payment Statuses
    PENDING: {
        label: 'Payment Pending',
        color: 'yellow',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        textColor: 'text-yellow-800 dark:text-yellow-300',
        borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    PAID: {
        label: 'Paid',
        color: 'green',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-800 dark:text-green-300',
        borderColor: 'border-green-200 dark:border-green-800'
    },
    FAILED: {
        label: 'Payment Failed',
        color: 'red',
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-800 dark:text-red-300',
        borderColor: 'border-red-200 dark:border-red-800'
    },
    REFUNDED: {
        label: 'Refunded',
        color: 'blue',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        textColor: 'text-blue-800 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-800'
    }
};

const StatusBadge = ({
    status,
    size = "md",
    className = "",
    showIcon = false
}) => {
    const config = STATUS_CONFIG[status] || {
        label: status,
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        textColor: 'text-gray-800 dark:text-gray-300',
        borderColor: 'border-gray-200 dark:border-gray-700'
    };

    const sizeClasses = {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base"
    };

    return (
        <span
            className={`
        inline-flex items-center justify-center gap-1.5
        font-medium rounded-full border
        ${config.bgColor}
        ${config.textColor}
        ${config.borderColor}
        ${sizeClasses[size]}
        ${className}
      `}
            title={config.label}
        >
            {config.label}
        </span>
    );
};

export default StatusBadge;