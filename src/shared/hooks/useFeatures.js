import { useQuery } from "@tanstack/react-query";
import { landingService } from "../services/landingService";

export const useFeatures = (options = {}) => {
    return useQuery({
        queryKey: ['features'],
        queryFn: () => landingService.getFeatures(),
        staleTime: 1000 * 60 * 15, // 15 minutes
        ...options,
    });
};