import { z } from "zod";

export const reminderTicketSchema = z.object({
    reminder_reason: z
        .string()
        .nonempty("Reminder Reason is required")
        .min(20, "Reminder Reason must be at least 20 characters")
        .max(255, "Reminder Reason must not exceed 255 characters"),
});

export type ReminderTicketValues = z.infer<typeof reminderTicketSchema>;
