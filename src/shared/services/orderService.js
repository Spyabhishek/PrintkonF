// shared/services/orderService.js
import api from "./api";

export const ORDER_STATUS = {
    PENDING_PAYMENT: "PENDING_PAYMENT",
    PAYMENT_CONFIRMED: "PAYMENT_CONFIRMED",
    UNDER_REVIEW: "UNDER_REVIEW",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    IN_PRODUCTION: "IN_PRODUCTION",
    READY_FOR_DELIVERY: "READY_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    RETURNED: "RETURNED"
};

export const PAYMENT_STATUS = {
    PENDING: "PENDING",
    PAID: "PAID",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED"
};

export const PAYMENT_METHOD = {
    COD: "COD",
    RAZORPAY: "RAZORPAY",
    CARD: "CARD",
    UPI: "UPI"
};

export const orderService = {
    // ========== CUSTOMER ENDPOINTS ==========
    placeOrder: (payload) => api.post("/orders", payload),

    getMyOrders: async () => {
        const response = await api.get("/orders/my");
        return response?.data?.data || [];
    },

    // UPDATED: Use the new endpoint that expects orderId (String)
    getOrderById: async (orderId) => {
        const response = await api.get(`/orders/my/${orderId}`);
        return response?.data?.data || response?.data;
    },

    // UPDATED: Use orderId (String) instead of numeric ID
    cancelOrder: async (orderId, reason) =>
        api.post(`/orders/${orderId}/cancel`, { reason }),

    // ========== PAYMENT ENDPOINTS ==========
    confirmPayment: (payload) => api.post("/orders/payment/confirm", payload),

    // ========== ADMIN ENDPOINTS ==========
    getAllOrders: (status) => api.get("/orders", {
        params: status ? { status } : {}
    }),

    // UPDATED: Use orderId (String) instead of numeric ID
    approveOrder: (orderId, approveData) =>
        api.post(`/orders/${orderId}/approve`, approveData),

    // UPDATED: Use orderId (String) instead of numeric ID
    rejectOrder: (orderId, reason) =>
        api.post(`/orders/${orderId}/reject?reason=${encodeURIComponent(reason)}`),

    getOrdersUnderReview: () => api.get("/orders/under-review"),

    // ========== OPERATOR ENDPOINTS ==========
    getOrdersAssignedToOperator: () => api.get("/orders/assigned"),

    // UPDATED: Use orderId (String) instead of numeric ID
    updateOrderStatus: (orderId, status, notes) =>
        api.put(`/orders/${orderId}/status?status=${status}${notes ? `&notes=${encodeURIComponent(notes)}` : ''}`),

    // UPDATED: Use orderId (String) instead of numeric ID
    markOrderReadyForDelivery: (orderId, preparationNotes) =>
        api.post(`/orders/${orderId}/ready-for-delivery${preparationNotes ? `?preparationNotes=${encodeURIComponent(preparationNotes)}` : ''}`),

    // UPDATED: Use orderId (String) instead of numeric ID
    markOrderOutForDelivery: (orderId, trackingNumber) =>
        api.post(`/orders/${orderId}/out-for-delivery${trackingNumber ? `?trackingNumber=${encodeURIComponent(trackingNumber)}` : ''}`),

    // UPDATED: Use orderId (String) instead of numeric ID
    markOrderDelivered: (orderId) =>
        api.post(`/orders/${orderId}/delivered`),

    getOrdersInProduction: () => api.get("/orders/in-production"),

    getOrdersReadyForDelivery: () => api.get("/orders/ready-for-delivery")
};