import { z } from "zod";

export const roleFormSchema = z.object({
    name: z
        .string()
        .nonempty("Role name is required")
        .min(3, "Role name must be at least 3 characters")
        .max(255, "Role name must not exceed 255 characters"),
    description: z
        .string()
        .nonempty("Description is required")
        .min(20, "Description must be at least 20 characters")
        .max(255, "Description must not exceed 255 characters")
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

// SWITCH ROLE
export const roleSwitchSchema = z.object({
    name: z.string().nonempty("Please Select a Role."),
});

export type SwitchRoleFormValues = z.infer<typeof roleSwitchSchema>;
