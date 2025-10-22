import { z } from "zod";

export const roleFormSchema = z.object({
    name: z
        .string()
        .nonempty("Role name is required")
        .min(3, "Role name must be at least 3 characters")
        .max(255, "Role name must not exceed 255 characters"),
    description: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 3, "Description must be at least 3 characters if provided")
        .refine((val) => !val || val.length <= 1000, "Description must not exceed 1000 characters")
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

// SWITCH ROLE
export const roleSwitchSchema = z.object({
    name: z.string().nonempty("Please Select a Role."),
});

export type SwitchRoleFormValues = z.infer<typeof roleSwitchSchema>;
