import { z } from "zod";

export const reOpenTicketSchema = z.object({
    re_open_reason: z
        .string()
        .nonempty("Re-open Reason is required")
        .min(20, "Re-open Reason must be at least 20 characters")
        .max(255, "Re-open Reason must not exceed 255 characters"),
});

export type ReOpenTicketValues = z.infer<typeof reOpenTicketSchema>;