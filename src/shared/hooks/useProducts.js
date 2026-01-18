// shared/hooks/useProducts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../services/productService';
import { useToast } from './useToast';

// Query keys for cache management
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), filters],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id ?? 'null'],
  popular: () => [...productKeys.all, 'popular'],
  trending: () => [...productKeys.all, 'trending'],
  forceTrending: () => [...productKeys.all, 'force-trending'],
  search: (query) => [...productKeys.all, 'search', query],
  outOfStock: () => [...productKeys.all, 'out-of-stock'],
  lowStock: () => [...productKeys.all, 'low-stock'],
  analytics: (id) => [...productKeys.all, 'analytics', id],
  summary: () => [...productKeys.all, 'summary'],
};

/**
 * Hook for fetching all products with pagination and filters
 */
export const useProducts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getAllProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook for fetching a single product by ID
 */
export const useProduct = (productId, options = {}) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook for searching products
 */
export const useProductSearch = (searchParams, options = {}) => {
  return useQuery({
    queryKey: productKeys.search(searchParams),
    queryFn: () => productService.searchProducts(searchParams),
    enabled: !!searchParams.query || !!searchParams.categoryId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Hook for simple product search
 */
export const useProductSearchSimple = (query, options = {}) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productService.searchProductsSimple(query),
    enabled: !!query && query.length >= 2,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook for fetching popular products
 */
export const usePopularProducts = (limit, options = {}) => {
  return useQuery({
    queryKey: [...productKeys.popular(), limit],
    queryFn: () => productService.getPopularProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

/**
 * Hook for fetching trending products
 */
export const useTrendingProducts = (limit, options = {}) => {
  return useQuery({
    queryKey: [...productKeys.trending(), limit],
    queryFn: () => productService.getTrendingProducts(limit),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook for fetching force trending products
 */
export const useForceTrendingProducts = (options = {}) => {
  return useQuery({
    queryKey: productKeys.forceTrending(),
    queryFn: () => productService.getForceTrendingProducts(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook for out of stock products (Admin)
 */
export const useOutOfStockProducts = (options = {}) => {
  return useQuery({
    queryKey: productKeys.outOfStock(),
    queryFn: () => productService.getOutOfStockProducts(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook for low stock products (Admin)
 */
export const useLowStockProducts = (threshold, options = {}) => {
  return useQuery({
    queryKey: [...productKeys.lowStock(), threshold],
    queryFn: () => productService.getLowStockProducts(threshold),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook for product analytics (Admin)
 */
export const useProductAnalytics = (productId, options = {}) => {
  return useQuery({
    queryKey: productKeys.analytics(productId),
    queryFn: () => productService.getProductAnalytics(productId),
    enabled: !!productId,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook for products summary (Admin)
 */
export const useProductsSummary = (options = {}) => {
  return useQuery({
    queryKey: productKeys.summary(),
    queryFn: () => productService.getProductsSummary(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ==================== MUTATIONS ====================

/**
 * Hook for creating a product (Admin)
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (productData) => productService.createProduct(productData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.summary() });
      showToast('success', data.message || 'Product created successfully');
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Failed to create product');
    },
  });
};

/**
 * Hook for updating a product (Admin)
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ productId, productData }) => 
      productService.updateProduct(productId, productData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast('success', data.message || 'Product updated successfully');
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Failed to update product');
    },
  });
};

/**
 * Hook for partial product update (Admin)
 */
export const usePartialUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ productId, updates }) => 
      productService.partialUpdateProduct(productId, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast('success', data.message || 'Product updated successfully');
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Failed to update product');
    },
  });
};

/**
 * Hook for deleting a product (Admin)
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (productId) => productService.deleteProduct(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.summary() });
      showToast('success', data.message || 'Product deleted successfully');
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Failed to delete product');
    },
  });
};

/**
 * Hook for stock management (Admin)
 */
export const useStockManagement = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const updateStock = useMutation({
    mutationFn: ({ productId, quantity }) => 
      productService.updateStock(productId, quantity),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.lowStock() });
      showToast('success', 'Stock updated successfully');
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Failed to update stock');
    },
  });

  const addStock = useMutation({
    mutationFn: ({ productId, quantity }) => 
      productService.addStock(productId, quantity),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast('success', 'Stock added successfully');
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Failed to add stock');
    },
  });

  const reduceStock = useMutation({
    mutationFn: ({ productId, quantity }) => 
      productService.reduceStock(productId, quantity),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast('success', 'Stock reduced successfully');
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Failed to reduce stock');
    },
  });

  return { updateStock, addStock, reduceStock };
};

/**
 * Hook for image management (Admin)
 */
export const useProductImages = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const uploadImages = useMutation({
    mutationFn: ({ productId, files, setMainImage }) => 
      productService.uploadProductImages(productId, files, setMainImage),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      showToast('success', 'Images uploaded successfully');
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Failed to upload images');
    },
  });

  const removeImage = useMutation({
    mutationFn: ({ productId, imageUrl }) => 
      productService.removeProductImage(productId, imageUrl),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      showToast('success', 'Image removed successfully');
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Failed to remove image');
    },
  });

  const setMainImage = useMutation({
    mutationFn: ({ productId, imageUrl }) => 
      productService.setMainImage(productId, imageUrl),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      showToast('success', 'Main image updated successfully');
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Failed to set main image');
    },
  });

  const reorderImages = useMutation({
    mutationFn: ({ productId, imageUrls }) => 
      productService.reorderImages(productId, imageUrls),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      showToast('success', 'Images reordered successfully');
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Failed to reorder images');
    },
  });

  return { uploadImages, removeImage, setMainImage, reorderImages };
};

/**
 * Hook for bulk operations (Admin)
 */
export const useBulkProductOperations = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const bulkUpdateAvailability = useMutation({
    mutationFn: ({ productIds, available }) => 
      productService.bulkUpdateAvailability(productIds, available),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast('success', `Updated ${data.data?.successCount || 0} products`);
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Bulk update failed');
    },
  });

  const bulkUpdatePrices = useMutation({
    mutationFn: (productPriceUpdates) => 
      productService.bulkUpdatePrices(productPriceUpdates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast('success', `Updated ${data.data?.successCount || 0} product prices`);
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Bulk price update failed');
    },
  });

  const bulkDelete = useMutation({
    mutationFn: (productIds) => productService.deleteProductsBulk(productIds),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.summary() });
      showToast('success', 'Products deleted successfully');
    },
    onError: (error) => {
      showToast('error', error.response?.data?.message || 'Bulk delete failed');
    },
  });

  return { bulkUpdateAvailability, bulkUpdatePrices, bulkDelete };
};

export default useProducts;