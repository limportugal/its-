import { z } from "zod";

// ASYNCHRONOUS REFINEMENT USING ZOD'S REFINE METHOD
export const formSchema = z.object({
    company_name: z
        .string()
        .nonempty("Company name is required")
        .min(3, "Company name must be at least 3 characters")
        .max(50, "Company name must not exceed 50 characters")
});

export type FormValues = z.infer<typeof formSchema>;
