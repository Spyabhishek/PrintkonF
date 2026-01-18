import { api } from './api';

export const categoryService = {
    // ------------------ CATEGORIES ------------------
   getCategories: async (includeInactive = false) => {
    const response = await api.get('/categories', { 
      params: { includeInactive }  
    });
    return response.data?.data || [];
  },

    getCategoriesPaginated: async (params = {}) => {
        const response = await api.get('/categories/paginated', { params });
        return response.data?.data || { content: [], totalElements: 0, totalPages: 0 };
    },

    getCategory: async (categoryId) => {
        const response = await api.get(`/categories/${categoryId}`);
        return response.data?.data || null;
    },

    getCategoryBySlug: async (slug) => {
        const response = await api.get(`/categories/slug/${slug}`);
        return response.data?.data || null;
    },

    getRootCategories: async () => {
        const response = await api.get('/categories/root');
        return response.data?.data || [];
    },

    getSubCategories: async (parentCategoryId) => {
        const response = await api.get(`/categories/${parentCategoryId}/subcategories`);
        return response.data?.data || [];
    },

    searchCategories: async (query) => {
        const response = await api.get('/categories/search', {
            params: { query }
        });
        return response.data?.data || [];
    },

    createCategory: async (categoryData, thumbnailImage = null, bannerImage = null) => {
        if (thumbnailImage || bannerImage) {
            const formData = new FormData();
            formData.append('category', new Blob([JSON.stringify(categoryData)], {
                type: 'application/json'
            }));
            if (thumbnailImage) formData.append('thumbnailImage', thumbnailImage);
            if (bannerImage) formData.append('bannerImage', bannerImage);

            const response = await api.post('/categories', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data?.data || null;
        } else {
            const response = await api.post('/categories/json', categoryData);
            return response.data?.data || null;
        }
    },

    updateCategory: async (categoryId, categoryData, thumbnailImage = null, bannerImage = null) => {
        if (thumbnailImage || bannerImage) {
            const formData = new FormData();
            formData.append('category', new Blob([JSON.stringify(categoryData)], {
                type: 'application/json'
            }));
            if (thumbnailImage) formData.append('thumbnailImage', thumbnailImage);
            if (bannerImage) formData.append('bannerImage', bannerImage);

            const response = await api.put(`/categories/${categoryId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data?.data || null;
        } else {
            const response = await api.put(`/categories/json/${categoryId}`, categoryData);
            return response.data?.data || null;
        }
    },

    deleteCategory: async (categoryId) => {
        const response = await api.delete(`/categories/${categoryId}`);
        return response.data?.data || null;
    },

    hardDeleteCategory: async (categoryId) => {
        const response = await api.delete(`/categories/${categoryId}/permanent`);
        return response.data?.data || null;
    },

    // ------------------ CATEGORY IMAGES ------------------
    updateCategoryThumbnail: async (categoryId, thumbnailImage) => {
        const formData = new FormData();
        formData.append('thumbnailImage', thumbnailImage);

        const response = await api.put(`/categories/${categoryId}/thumbnail`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data?.data || null;
    },

    updateCategoryBanner: async (categoryId, bannerImage) => {
        const formData = new FormData();
        formData.append('bannerImage', bannerImage);

        const response = await api.put(`/categories/${categoryId}/banner`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data?.data || null;
    }
};