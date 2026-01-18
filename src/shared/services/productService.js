// shared/services/productService.js
import api from './api';

const productService = {
  // ------------------ PUBLIC ENDPOINTS ------------------
  
  /**
   * Get all products with pagination and filters
   * @param {Object} params - Query parameters
   * @param {string} params.categoryId - Filter by category ID
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 20)
   * @param {string} params.sortBy - Sort field (default: createdAt)
   * @param {string} params.sortDirection - Sort direction (ASC/DESC, default: DESC)
   */
  getAllProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    queryParams.append('page', params.page ?? 0);
    queryParams.append('size', params.size ?? 20);
    queryParams.append('sortBy', params.sortBy ?? 'createdAt');
    queryParams.append('sortDirection', params.sortDirection ?? 'DESC');
    
    const response = await api.get(`/products?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   */
  getProductById: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  /**
   * Search products with advanced filters
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.query - Search query
   * @param {string} searchParams.categoryId - Category filter
   * @param {number} searchParams.minPrice - Minimum price
   * @param {number} searchParams.maxPrice - Maximum price
   * @param {boolean} searchParams.available - Availability filter
   * @param {number} searchParams.page - Page number
   * @param {number} searchParams.size - Page size
   */
  searchProducts: async (searchParams) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const response = await api.get(`/products/search?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Simple search products (returns list without pagination)
   * @param {string} query - Search query
   */
  searchProductsSimple: async (query) => {
    const response = await api.get(`/products/search/simple?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  /**
   * Get popular products
   * @param {number} limit - Number of products to return
   */
  getPopularProducts: async (limit) => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/products/popular${params}`);
    return response.data;
  },

  /**
   * Get trending products
   * @param {number} limit - Number of products to return
   */
  getTrendingProducts: async (limit) => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/products/trending${params}`);
    return response.data;
  },

  /**
   * Get force trending products (admin marked)
   */
  getForceTrendingProducts: async () => {
    const response = await api.get('/products/force-trending');
    return response.data;
  },

  // ------------------ ADMIN ENDPOINTS ------------------

  /**
   * Create new product (Admin only)
   * @param {Object} productData - Product data
   */
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  /**
   * Update product (Admin only)
   * @param {string} productId - Product ID
   * @param {Object} productData - Updated product data
   */
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },

  /**
   * Partial update product (Admin only)
   * @param {string} productId - Product ID
   * @param {Object} updates - Partial updates
   */
  partialUpdateProduct: async (productId, updates) => {
    const response = await api.patch(`/products/${productId}`, updates);
    return response.data;
  },

  /**
   * Delete product (soft delete - Admin only)
   * @param {string} productId - Product ID
   */
  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  /**
   * Hard delete product (Admin only)
   * @param {string} productId - Product ID
   */
  hardDeleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}/permanent`);
    return response.data;
  },

  // ------------------ STOCK MANAGEMENT ------------------

  /**
   * Update stock quantity (Admin only)
   * @param {string} productId - Product ID
   * @param {number} quantity - New stock quantity
   */
  updateStock: async (productId, quantity) => {
    const response = await api.put(`/products/${productId}/stock?quantity=${quantity}`);
    return response.data;
  },

  /**
   * Reduce stock (Admin only)
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to reduce
   */
  reduceStock: async (productId, quantity) => {
    const response = await api.post(`/products/${productId}/stock/reduce?quantity=${quantity}`);
    return response.data;
  },

  /**
   * Add stock (Admin only)
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to add
   */
  addStock: async (productId, quantity) => {
    const response = await api.post(`/products/${productId}/stock/add?quantity=${quantity}`);
    return response.data;
  },

  /**
   * Get out of stock products (Admin only)
   */
  getOutOfStockProducts: async () => {
    const response = await api.get('/products/out-of-stock');
    return response.data;
  },

  /**
   * Get low stock products (Admin only)
   * @param {number} threshold - Stock threshold
   */
  getLowStockProducts: async (threshold) => {
    const params = threshold ? `?threshold=${threshold}` : '';
    const response = await api.get(`/products/low-stock${params}`);
    return response.data;
  },

  // ------------------ IMAGE MANAGEMENT ------------------

  /**
   * Upload product images (Admin only)
   * @param {string} productId - Product ID
   * @param {FileList} files - Image files
   * @param {boolean} setMainImage - Set first image as main
   */
  uploadProductImages: async (productId, files, setMainImage = false) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    
    const response = await api.post(
      `/products/${productId}/images?setMainImage=${setMainImage}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Remove product image (Admin only)
   * @param {string} productId - Product ID
   * @param {string} imageUrl - Image URL to remove
   */
  removeProductImage: async (productId, imageUrl) => {
    const response = await api.delete(
      `/products/${productId}/images?imageUrl=${encodeURIComponent(imageUrl)}`
    );
    return response.data;
  },

  /**
   * Set main product image (Admin only)
   * @param {string} productId - Product ID
   * @param {string} imageUrl - Image URL to set as main
   */
  setMainImage: async (productId, imageUrl) => {
    const response = await api.put(
      `/products/${productId}/images/main?imageUrl=${encodeURIComponent(imageUrl)}`
    );
    return response.data;
  },

  /**
   * Reorder product images (Admin only)
   * @param {string} productId - Product ID
   * @param {string[]} imageUrls - Ordered array of image URLs
   */
  reorderImages: async (productId, imageUrls) => {
    const response = await api.put(`/products/${productId}/images/reorder`, imageUrls);
    return response.data;
  },

  // ------------------ ADMIN FEATURES ------------------

  /**
   * Set product as popular (Admin only)
   * @param {string} productId - Product ID
   * @param {boolean} value - Popular status
   */
  setProductPopular: async (productId, value) => {
    const response = await api.put(`/products/admin/${productId}/popular?value=${value}`);
    return response.data;
  },

  /**
   * Set product as force trending (Admin only)
   * @param {string} productId - Product ID
   * @param {boolean} value - Force trending status
   */
  setProductForceTrending: async (productId, value) => {
    const response = await api.put(`/products/admin/${productId}/force-trending?value=${value}`);
    return response.data;
  },

  // ------------------ BULK OPERATIONS ------------------

  /**
   * Bulk update product availability (Admin only)
   * @param {string[]} productIds - Array of product IDs
   * @param {boolean} available - Availability status
   */
  bulkUpdateAvailability: async (productIds, available) => {
    const response = await api.post(
      `/products/bulk/availability?available=${available}`,
      productIds
    );
    return response.data;
  },

  /**
   * Bulk update product prices (Admin only)
   * @param {Object} productPriceUpdates - Map of productId: price
   */
  bulkUpdatePrices: async (productPriceUpdates) => {
    const response = await api.post('/products/bulk/prices', productPriceUpdates);
    return response.data;
  },

  /**
   * Bulk delete products (Admin only)
   * @param {string[]} productIds - Array of product IDs
   */
  deleteProductsBulk: async (productIds) => {
    const response = await api.post('/products/bulk/delete', productIds);
    return response.data;
  },

  // ------------------ ANALYTICS ------------------

  /**
   * Get product analytics (Admin only)
   * @param {string} productId - Product ID
   */
  getProductAnalytics: async (productId) => {
    const response = await api.get(`/products/${productId}/analytics`);
    return response.data;
  },

  /**
   * Get products summary (Admin only)
   */
  getProductsSummary: async () => {
    const response = await api.get('/products/summary');
    return response.data;
  },
};

export default productService;