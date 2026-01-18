import { api } from "./api";

export const adminService = {
    getAllOrders: () => api.get("/admin/orders"),
    getUnassignedOrders: () => api.get("/admin/orders/unassigned"),
    getOperators: () => api.get("/admin/operators"),
    assignOrder: (orderId, operatorId) => api.post(`/admin/orders/${orderId}/assign`, { operatorId }),
    getRoleRequests: () => api.get("/admin/role-requests"),
    handleRoleRequest: (id, action) => api.post(`/admin/role-requests/${id}/${action}`), // action: approve|reject|verify|downgrade
    getAllUsers: () => api.get("/admin/users"),
};
