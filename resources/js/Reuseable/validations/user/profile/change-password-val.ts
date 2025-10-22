import { z } from "zod";

// CHANGE PASSWORD SCHEMA
export const changePasswordSchema = z.object({
    current_password: z
        .string()
        .nonempty("Current password is required")
        .min(1, "Current password is required")
        .max(255, "Current password is too long"),
    password: z
        .string()
        .nonempty("New password is required")
        .min(8, "New password must be at least 8 characters.")
        .max(20, "New password must not exceed 20 characters.")
        .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
        .regex(/[a-z]/, "New password must contain at least one lowercase letter")
        .regex(/[0-9]/, "New password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "New password must contain at least one special character")
        .regex(/^\S*$/, "New password must not contain spaces"),
    password_confirmation: z.string().nonempty("Confirm new password is required."),
})
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match.",
        path: ["password_confirmation"],
    });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;