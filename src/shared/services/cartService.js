import api from './api';

export const cartService = {
    // Get user's cart
    getCart: async () => {
        const response = await api.get('/v1/cart');
        return response.data;
    },

    // Add item to cart
    addToCart: async (cartItemData) => {
        const response = await api.post('/v1/cart', cartItemData);
        return response.data;
    },

    // Update item quantity
    updateQuantity: async (cartItemId, quantity) => {
        const response = await api.put(`/v1/cart/item/${cartItemId}`, null, {
            params: { quantity }
        });
        return response.data;
    },

    // Remove item from cart
    removeItem: async (cartItemId) => {
        const response = await api.delete(`/v1/cart/item/${cartItemId}`);
        return response.data;
    },

    // Clear entire cart
    clearCart: async () => {
        const response = await api.delete('/v1/cart/clear');
        return response.data;
    }
};