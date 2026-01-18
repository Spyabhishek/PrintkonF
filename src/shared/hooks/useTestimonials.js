import { useQuery } from "@tanstack/react-query";
import { landingService } from "../services/landingService";

export const useTestimonials = (options = {}) => {
    return useQuery({
        queryKey: ['testimonials'],
        queryFn: () => landingService.getTestimonials(),
        staleTime: 1000 * 60 * 15,
        ...options,
    });
};