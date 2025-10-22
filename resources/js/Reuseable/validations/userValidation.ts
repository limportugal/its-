import { z } from "zod";

export const createFormSchema = z
    .object({
        name: z
            .string()
            .nonempty("The full name is required.")
            .min(6, "The full name must be at least 6 characters long.")
            .max(100, "The full name must not exceed 100 characters."),
        roles: z.string().nonempty("Please select a role."),
        mobile_number: z
            .string()
            .min(11, "The contact number must be at least 11 characters long.")
            .max(100, "The contact number must not exceed 100 characters.")
            .optional(),
        company_id: z.string().nonempty("Please select a company."),
        email: z
            .string()
            .nonempty("Please enter a valid email address.")
            .min(8, "Email address must be at least 8 characters.")
            .max(50, "Email address must not exceed 50 characters.")
            .regex(/^[a-z0-9@.]+$/, "Email must be in lowercase only.")
            .regex(/^\S*$/, "Email must not contain spaces.")
            .email("Please input a valid email address."),
        avatar: z.string().optional(),
        status: z.string().optional(),
        team_leader_id: z.string().optional(),
    });

export type CreateFormValues = z.infer<typeof createFormSchema>;

// UPDATE SCHEMA
export const updateFormSchema = z.object({
    name: z
        .string()
        .nonempty("The full name is required.")
        .min(6, "The full name must be at least 6 characters long.")
        .max(100, "The full name must not exceed 100 characters."),
    email: z
        .string()
        .nonempty("Please enter a valid email address.")
        .min(8, "Email address must be at least 8 characters.")
        .max(50, "Email address must not exceed 50 characters.")
        .regex(/^[a-z0-9@.]+$/, "Email must be in lowercase only.")
        .regex(/^\S*$/, "Email must not contain spaces.")
        .email("Please input a valid email address."),
    company_id: z.string().nonempty("Please select a company."),
    roles: z.string().nonempty("Please select a role."),
    team_leader_id: z.string().optional(),
});

export type UpdateFormValues = z.infer<typeof updateFormSchema>;

// LOGIN SCHEMA
export const loginSchema = z.object({
    email: z
        .string()
        .nonempty("Please enter a valid email address.")
        .min(8, "Email address must be at least 8 characters.")
        .max(50, "Email address must not exceed 50 characters.")
        .regex(/^\S*$/, "Email must not contain spaces.")
        .email("Please input a valid email address."),
    password: z
        .string()
        .nonempty("Please enter your password.")
        .min(8, "Password must be at least 8 characters.")
        .max(20, "Password must not exceed 20 characters.")
        .regex(/^\S*$/, "Password must not contain spaces."),
    remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// CREATE PASSWORD SCHEMA
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

