import { z } from "zod";

export const formSchema = z.object({
    category_name: z
        .string()
        .nonempty("Category Name is required")
        .min(3, "Category Name must be at least 3 characters")
        .max(255, "Category Name must not exceed 255 characters"),
});

export type FormValues = z.infer<typeof formSchema>;


export const returnTicketSchema = z.object({
    return_reason: z
        .string()
        .nonempty("Return Reason is required")
        .min(20, "Return Reason must be at least 20 characters")
        .max(1024, "Return Reason must not exceed 1024 characters"),
});

export type ReturnTicketValues = z.infer<typeof returnTicketSchema>;