import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDynamicMutation = <
    TData,
    TVariables,
    TError = unknown
>({
    mutationFn,
    // queryKey,
    mutationKey,
    onSuccess: customOnSuccess,
    onError: customOnError,
    successMessage,
    invalidateQueries = true,
}: {
    mutationFn: (variables: TVariables) => Promise<TData>;
    // queryKey: string | string[] | [string];
    mutationKey: string | string[] | [string];
    onSuccess?: (data: TData) => void;
    onError?: (error: TError) => void;
    successMessage?: string;
    invalidateQueries?: boolean;
}) => {
    const queryClient = useQueryClient();
    return useMutation<TData, TError, TVariables>({
        mutationFn,
        onSuccess: async (data) => {
            if (invalidateQueries) {
                const queryKeys = Array.isArray(mutationKey) ? mutationKey : [mutationKey];
                await Promise.all(
                    queryKeys.map(key => 
                        queryClient.invalidateQueries({
                            queryKey: Array.isArray(key) ? key : [key],
                        })
                    )
                );
            }

            if (customOnSuccess) {
                customOnSuccess(data);
            }

            if (successMessage) {
            }
        },
        onError: customOnError,
    });
};
