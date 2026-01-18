import { api } from "./api";

export const roleService = {
    requestUpgrade: (payload) => api.post("/role-upgrade/request", payload),
    getRequests: () => api.get("/roles/upgrade-requests"),
};
