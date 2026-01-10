import { z } from "zod";

// ASSIGN TICKET
export const assignTicketSchema = z.object({
    priority: z
        .string()
        .nullable()
        .optional(),
    user_uuid: z
        .array(z.string())
        .min(1, "Please select at least one user."),
});

export type AssignTicketFormValues = z.infer<typeof assignTicketSchema>;