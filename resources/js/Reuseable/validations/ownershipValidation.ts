import { z } from "zod";

export const formSchema = z.object({
    ownership_name: z
        .string()
        .nonempty("Ownership name is required")
        .min(2, "Ownership name must be at least 2 characters")
        .max(100, "Ownership name must not exceed 100 characters"),
});

export type FormValues = z.infer<typeof formSchema>;

