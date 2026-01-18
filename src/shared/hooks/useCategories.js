import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';

export const useCategories = (includeInactive = false) => {
    return useQuery({
        queryKey: ['categories', { includeInactive }],
        queryFn: () => categoryService.getCategories(includeInactive),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

export const useCategoriesPaginated = (params = {}) => {
    return useQuery({
        queryKey: ['categories', 'paginated', params],
        queryFn: () => categoryService.getCategoriesPaginated(params),
        staleTime: 1000 * 60 * 10,
        keepPreviousData: true,
    });
};

export const useCategory = (categoryId) => {
    return useQuery({
        queryKey: ['categories', categoryId],
        queryFn: () => categoryService.getCategory(categoryId),
        enabled: !!categoryId,
        staleTime: 1000 * 60 * 10,
    });
};

export const useCategoryBySlug = (slug) => {
    return useQuery({
        queryKey: ['categories', 'slug', slug],
        queryFn: () => categoryService.getCategoryBySlug(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 10,
    });
};

export const useRootCategories = () => {
    return useQuery({
        queryKey: ['categories', 'root'],
        queryFn: () => categoryService.getRootCategories(),
        staleTime: 1000 * 60 * 10,
    });
};

export const useSubCategories = (parentCategoryId) => {
    return useQuery({
        queryKey: ['categories', 'subcategories', parentCategoryId],
        queryFn: () => categoryService.getSubCategories(parentCategoryId),
        enabled: !!parentCategoryId,
        staleTime: 1000 * 60 * 10,
    });
};

export const useSearchCategories = (query) => {
    return useQuery({
        queryKey: ['categories', 'search', query],
        queryFn: () => categoryService.searchCategories(query),
        enabled: !!query && query.length > 0,
        staleTime: 1000 * 60 * 5,
    });
};

// ------------------ CATEGORY MUTATIONS ------------------

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ data, thumbnailImage, bannerImage }) =>
            categoryService.createCategory(data, thumbnailImage, bannerImage),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ categoryId, data, thumbnailImage, bannerImage }) =>
            categoryService.updateCategory(categoryId, data, thumbnailImage, bannerImage),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['categories']);
            queryClient.invalidateQueries(['categories', variables.categoryId]);
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: categoryService.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
        },
    });
};