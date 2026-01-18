import { api } from "./api";

export const userService = {
    getProfile: () => api.get("/auth/me"),
    updateProfile: (payload) => api.put("/auth/me", payload),
    placeOrder: (payload) => api.post("/orders", payload),
    getOrders: () => api.get("/orders/my"),
};
