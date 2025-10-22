import { z } from "zod";

export const permissionFormSchema = z.object({
    name: z
        .string()
        .nonempty("Permission Name is required")
        .min(3, "Permission Name must be at least 3 characters")
        .max(255, "Permission Name must not exceed 255 characters"),
});

export type PermissionFormValues = z.infer<typeof permissionFormSchema>;
