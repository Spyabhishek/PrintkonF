import { useQuery } from "@tanstack/react-query";
import { landingService } from "../services/landingService";

export const useStats = (options = {}) => {
    return useQuery({
        queryKey: ['stats'],
        queryFn: () => landingService.getStats(),
        staleTime: 1000 * 60 * 5, // 5 minutes for stats (can be dynamic)
        ...options,
    });
};