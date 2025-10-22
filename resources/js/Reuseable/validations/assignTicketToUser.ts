import { z } from "zod";

// ASSIGN TICKET
export const assignTicketSchema = z.object({
    priority: z
        .string()
        .nullable()
        .optional(),
    user_uuid: z
        .string()
        .nonempty("Please select a user."),
});

export type AssignTicketFormValues = z.infer<typeof assignTicketSchema>;