import { z } from "zod";

export const followUpTicketSchema = z.object({
    follow_up_reason: z
        .string()
        .nonempty("Follow Up Reason is required")
        .min(20, "Follow Up Reason must be at least 20 characters")
        .max(255, "Follow Up Reason must not exceed 255 characters"),
});

export type FollowUpTicketValues = z.infer<typeof followUpTicketSchema>;