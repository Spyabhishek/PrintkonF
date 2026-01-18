import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import  productService  from '../services/productService';

// ------------------ PRODUCT HOOKS ------------------

export const useProducts = (filters = {}) => {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => productService.getProducts(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        keepPreviousData: true,
    });
};

export const useProductsPaginated = (filters = {}) => {
    return useQuery({
        queryKey: ['products', 'paginated', filters],
        queryFn: () => productService.getProductsPaginated(filters),
        staleTime: 1000 * 60 * 5,
        keepPreviousData: true,
    });
};

export const useProduct = (productId) => {
    return useQuery({
        queryKey: ['products', productId],
        queryFn: () => productService.getProduct(productId),
        enabled: !!productId,
        staleTime: 1000 * 60 * 10, // 10 minutes for single product
    });
};

export const useSearchProducts = (searchRequest) => {
    return useQuery({
        queryKey: ['products', 'search', searchRequest],
        queryFn: () => productService.searchProducts(searchRequest),
        enabled: !!searchRequest?.query && searchRequest.query?.length > 0,
        staleTime: 1000 * 60 * 5,
        keepPreviousData: true,
    });
};

export const useSearchProductsSimple = (query) => {
    return useQuery({
        queryKey: ['products', 'search-simple', query],
        queryFn: () => productService.searchProductsSimple(query),
        enabled: !!query && query?.length > 0,
        staleTime: 1000 * 60 * 5,
    });
};

export const useTrendingProducts = (limit = 8) => {
    return useQuery({
        queryKey: ['products', 'trending', limit],
        queryFn: () => productService.getTrendingProducts(limit),
        staleTime: 1000 * 60 * 10, // 10 minutes for trending products
    });
};

export const usePopularProducts = (limit = 8) => {
    return useQuery({
        queryKey: ['products', 'popular', limit],
        queryFn: () => productService.getPopularProducts(limit),
        staleTime: 1000 * 60 * 10, // 10 minutes for popular products
    });
};

export const useForceTrendingProducts = () => {
    return useQuery({
        queryKey: ['products', 'force-trending'],
        queryFn: () => productService.getForceTrendingProducts(),
        staleTime: 1000 * 60 * 10,
    });
};

export const useOutOfStockProducts = () => {
    return useQuery({
        queryKey: ['products', 'out-of-stock'],
        queryFn: () => productService.getOutOfStockProducts(),
        staleTime: 1000 * 60 * 5,
    });
};

export const useLowStockProducts = (threshold = 10) => {
    return useQuery({
        queryKey: ['products', 'low-stock', threshold],
        queryFn: () => productService.getLowStockProducts(threshold),
        staleTime: 1000 * 60 * 5,
    });
};

export const useProductAnalytics = (productId) => {
    return useQuery({
        queryKey: ['products', 'analytics', productId],
        queryFn: () => productService.getProductAnalytics(productId),
        enabled: !!productId,
        staleTime: 1000 * 60 * 5,
    });
};

export const useProductsSummary = () => {
    return useQuery({
        queryKey: ['products', 'summary'],
        queryFn: () => productService.getProductsSummary(),
        staleTime: 1000 * 60 * 5,
    });
};

// ------------------ PRODUCT MUTATIONS ------------------

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productService.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, data }) => productService.updateProduct(productId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['products']);
            queryClient.invalidateQueries(['products', variables.productId]);
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
    });
};

export const useUploadProductImages = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, files, setMainImage }) =>
            productService.uploadProductImages(productId, files, setMainImage),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['products', variables.productId]);
        },
    });
};

export const useRemoveProductImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, imageUrl }) =>
            productService.removeProductImage(productId, imageUrl),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['products', variables.productId]);
        },
    });
};

export const useSetMainProductImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, imageUrl }) =>
            productService.setMainProductImage(productId, imageUrl),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['products', variables.productId]);
        },
    });
};

export const useReorderProductImages = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, imageUrls }) =>
            productService.reorderProductImages(productId, imageUrls),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['products', variables.productId]);
        },
    });
};

export const useUpdateStock = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, quantity }) =>
            productService.updateStock(productId, quantity),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['products', variables.productId]);
            queryClient.invalidateQueries(['products']);
        },
    });
};

export const useBulkUpdateAvailability = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productIds, available }) =>
            productService.bulkUpdateAvailability(productIds, available),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
    });
};
