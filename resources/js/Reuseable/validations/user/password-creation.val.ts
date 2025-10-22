import { z } from "zod";

export const createPasswordSchema = z.object({
    password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters.")
        .max(20, "Password must not exceed 20 characters.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
        .regex(/^\S*$/, "Password must not contain spaces"),
    password_confirmation: z.string().nonempty("Confirm password is required."),
})
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match.",
        path: ["password_confirmation"],
    });

export type CreatePasswordFormValues = z.infer<typeof createPasswordSchema>;
