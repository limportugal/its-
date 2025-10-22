import { z } from "zod";

export const formSchema = z.object({
    service_center_name: z
        .string()
        .nonempty("Service Center Name is required")
        .min(3, "Service Center Name must be at least 3 characters")
        .max(255, "Service Center Name must not exceed 255 characters"),
});
export type FormValues = z.infer<typeof formSchema>;

