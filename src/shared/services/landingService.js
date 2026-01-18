import { api } from './api';

export const landingService = {

    getFeatures: async () => {
        const response = await api.get('/landing/features');
        return response.data?.data || [];
    },

    getTestimonials: async () => {
        const response = await api.get('/landing/testimonials');
        return response.data?.data || [];
    },

    getStats: async () => {
        const response = await api.get('/landing/stats');
        return response.data?.data || [];
    },

    getPrintingServices: async () => {
        const response = await api.get('/landing/printing-services');
        return response.data?.data || [];
    },
};