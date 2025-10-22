import { z } from "zod";

export const formSchema = z.object({
    system_name: z
        .string()
        .nonempty("System Name is required")
        .min(3, "System Name must be at least 3 characters")
        .max(255, "Company name must not exceed 255 characters"),
});
export type FormValues = z.infer<typeof formSchema>;

