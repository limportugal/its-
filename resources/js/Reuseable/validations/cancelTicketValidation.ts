import { z } from "zod";

export const cancelTicketSchema = z.object({
    cancellation_reason: z
        .string()
        .nonempty("Cancellation Reason is required")
        .min(20, "Cancellation Reason must be at least 20 characters")
        .max(255, "Cancellation Reason must not exceed 255 characters"),
});

export type CancelTicketValues = z.infer<typeof cancelTicketSchema>;