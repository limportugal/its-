import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";

/**
 * ✅ Generic Reusable `useDynamicQuery` Hook
 *
 * @template TData - Type of response data
 * @template TError - Type of error
 * @param queryKey - Unique identifier for caching
 * @param queryFn - Function that fetches the data
 * @param options - Optional query configurations
 * @returns Query result (data, loading state, error, refetch, etc.)
 */

const useDynamicQuery = <TData, TError = unknown>(
    queryKey: QueryKey,
    queryFn: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) => {
    return useQuery<TData, TError>({
        queryKey,
        queryFn,
        staleTime: options?.staleTime ?? 1000 * 60 * 5, 
        refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
        refetchInterval: options?.refetchInterval ?? 1000 * 60 * 5, // Auto-refetch every 5 minutes
        enabled: options?.enabled ?? true,
        ...options,
    });
};

export default useDynamicQuery;
