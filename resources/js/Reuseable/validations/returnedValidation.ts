import { z } from "zod";

export const returnTicketSchema = z.object({
    return_reason: z
        .string()
        .nonempty("Return Reason is required")
        .min(20, "Return Reason must be at least 20 characters")
        .max(1024, "Return Reason must not exceed 1024 characters"),
    attachment: z.any().optional(),
});

export type ReturnTicketValues = z.infer<typeof returnTicketSchema>;