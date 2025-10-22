import { z } from "zod";

// ASYNCHRONOUS REFINEMENT USING ZOD'S REFINE METHOD
export const formSchema = z.object({
    priority_name: z
        .string()
        .nonempty("Priority name is required")
        .min(3, "Priority name must be at least 3 characters")
        .max(50, "Priority name must not exceed 50 characters"),
    description: z
        .string()
        .nonempty("Description is required")
        .min(3, "Description must be at least 3 characters")
        .max(255, "Description must not exceed 255 characters"),
});

export type FormValues = z.infer<typeof formSchema>;
