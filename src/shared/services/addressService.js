// shared/services/addressService.js
import api from "./api";

export const addressService = {
    // === CREATE ===
    createAddress: (addressData) => api.post("/addresses", addressData),

    // === READ ===
    getMyAddresses: () => api.get("/addresses"),
    getAddressById: (addressId) => api.get(`/addresses/${addressId}`),
    getDefaultAddress: () => api.get("/addresses/default"),
    getAddressCount: () => api.get("/addresses/count"),

    // === UPDATE ===
    updateAddress: (addressId, addressData) => api.put(`/addresses/${addressId}`, addressData),
    setDefaultAddress: (addressId) => api.patch(`/addresses/${addressId}/set-default`),

    // === DELETE ===
    deleteAddress: (addressId) => api.delete(`/addresses/${addressId}`),
    deleteAllAddresses: () => api.delete("/addresses"),

    // === SEARCH ===
    searchByCity: (city) => api.get("/addresses/search/city", { params: { city } }),
    searchByState: (state) => api.get("/addresses/search/state", { params: { state } }),
    searchByCountry: (country) => api.get("/addresses/search/country", { params: { country } }),
    searchByZip: (zip) => api.get("/addresses/search/zip", { params: { zip } })
};