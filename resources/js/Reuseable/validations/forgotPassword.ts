import { z } from "zod";

// FORGOT PASSWORD SCHEMA
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .nonempty("Please enter a valid email address.")
        .min(8, "Email address must be at least 8 characters.")
        .max(50, "Email address must not exceed 50 characters.")
        .regex(/^\S*$/, "Email must not contain spaces.")
        .regex(/^[a-z0-9@.]+$/, "Email must be in lowercase only.")
        .email("Please input a valid email address."),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
