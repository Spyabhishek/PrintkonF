import { api } from "./api";

export const operatorService = {
    getAssignedOrders: () => api.get("/operator/orders"),
    updateOrderStatus: (orderId, status) => api.post(`/operator/orders/${orderId}/status`, { status }),
    getProfile: () => api.get("/operator/me"),
};
