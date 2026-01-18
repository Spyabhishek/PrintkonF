import { useQuery } from "@tanstack/react-query";
import { landingService } from "../services/landingService";

export const usePrintingServices = (options = {}) => {
    return useQuery({
        queryKey: ['printing-services'],
        queryFn: () => landingService.getPrintingServices(),
        staleTime: 1000 * 60 * 30, // 30 minutes
        ...options,
    });
};