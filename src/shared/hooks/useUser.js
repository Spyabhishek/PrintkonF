import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";

const fetchUser = async () => {
    try {
        const { data } = await userService.getProfile();
        console.log("USER QUERY: Fetched user data:", data.data);
        return data.data;
    } catch (error) {
        console.log("USER QUERY: Failed to fetch user:", error.response?.status);

        // If unauthorized, throw the error to let React Query handle it
        if (error.response?.status === 401) {
            throw error;
        }

        // For other errors, also throw
        throw error;
    }
};

export function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        staleTime: 5 * 60 * 1000, // cache 5 min
        retry: false, // ✅ CRITICAL: Don't retry at all - let interceptor handle it
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: false, // ✅ CRITICAL: Don't refetch on mount if we have cached data
        refetchOnReconnect: false, // Don't refetch on reconnect
        refetchInterval: false, // Don't refetch on interval
        enabled: true, // Always enabled, but won't retry due to retry: false
    });
}