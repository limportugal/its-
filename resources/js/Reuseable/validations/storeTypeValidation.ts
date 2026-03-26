import { z } from "zod";

export const formSchema = z.object({
    store_type_name: z
        .string()
        .nonempty("Store type name is required")
        .min(2, "Store type name must be at least 2 characters")
        .max(100, "Store type name must not exceed 100 characters"),
});

export type FormValues = z.infer<typeof formSchema>;

