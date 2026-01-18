import { useQuery } from '@tanstack/react-query';
import  productService from '../services/productService';

export const useTrendingProducts = (limit = 8, options = {}) => {
    return useQuery({
        queryKey: ['trending-products', limit],
        queryFn: () => productService.getTrendingProducts(limit),
        staleTime: 1000 * 60 * 10, // 10 minutes
        cacheTime: 1000 * 60 * 30, // 30 minutes
        retry: 2,
        ...options,
    });
};