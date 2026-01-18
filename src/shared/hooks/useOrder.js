import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { useToast } from './useToast';

export const useOrders = (options = {}) => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: orderService.getMyOrders,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        ...options,
    });
};

export const useOrder = (orderId, options = {}) => {
    return useQuery({
        queryKey: ['order', orderId],
        queryFn: () => orderService.getOrderById(orderId),
        enabled: !!orderId,
        staleTime: 2 * 60 * 1000, // 2 minutes
        ...options,
    });
};

export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ orderId, reason }) =>
            orderService.cancelOrder(orderId, reason),
        onSuccess: (data, variables) => {
            // Invalidate and refetch orders
            queryClient.invalidateQueries(['orders']);
            queryClient.invalidateQueries(['order', variables.orderId]);

            showToast('Order cancelled successfully', 'success');
        },
        onError: (error) => {
            showToast(
                error.response?.data?.message || 'Failed to cancel order',
                'error'
            );
        },
    });
};