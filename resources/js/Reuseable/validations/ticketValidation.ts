import { z } from "zod";

export const formSchema = z
    .object({
        full_name: z
            .string()
            .nonempty("The full name is required.")
            .min(6, "The full name must be at least 6 characters long.")
            .max(100, "The full name must not exceed 100 characters."),
        email: z
            .string()
            .nonempty("The email is required.")
            .min(8, "The email must be at least 8 characters long.")
            .max(100, "The email must not exceed 100 characters.")
            .regex(/^\S*$/, "Email must not contain spaces.")
            .email("The email must be a valid email address."),
        service_center_id: z.string().nonempty("Please select a branch."),
        system_id: z.string().nonempty("Please select a system."),
        categories: z
            .array(z.string())
            .min(1, "Please select at least 1 category."),
        priority_id: z.string().nonempty("Please select a priority."),
        description: z
            .string()
            .nonempty("The report description is required.")
            .min(
                10,
                "The report description must be at least 10 characters long."
            )
            .max(510, "The report description must not exceed 510 characters."),
        attachment: z.instanceof(File).nullable().optional(),
        store_code: z.string().optional(),
        store_name: z.string().optional(),
        store_address: z.string().optional(),
        fsr_no: z.string().optional(),
        system_name: z.string().optional(),
        category_labels: z.array(z.string()).optional(),
        powerform_full_name: z.string().optional(),
        powerform_employee_id: z.string().optional(),
        powerform_email: z.string().optional(),
        powerform_company_number: z.string().optional(),
        powerform_imei: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        const normalizeSystemName = (value?: string | null) =>
            value ? value.toLowerCase().replace(/\s+/g, " ").trim() : "";
        const normalize = (value?: string | null) =>
            value ? value.toLowerCase().trim() : "";

        // DETERMINE IF STORE FIELDS SHOULD BE REQUIRED
        const shouldRequireStoreFields = 
            data.system_name === "Customer Not Found" ||
            (data.system_name === "FSR Online" && 
             data.category_labels?.includes("Customer Not Found"));

        // IF STORE FIELDS ARE REQUIRED, VALIDATE THEM
        if (shouldRequireStoreFields) {
            if (!data.store_code || data.store_code.trim() === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Store code is required",
                    path: ["store_code"],
                });
            } else if (data.store_code.length < 3) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Store code must be at least 3 characters long.",
                    path: ["store_code"],
                });
            } else if (data.store_code.length > 50) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Store code must not exceed 50 characters.",
                    path: ["store_code"],
                });
            }

            if (!data.store_name || data.store_name.trim() === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Store name is required",
                    path: ["store_name"],
                });
            } else if (data.store_name.length < 3) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Store name must be at least 3 characters long.",
                    path: ["store_name"],
                });
            } else if (data.store_name.length > 100) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Store name must not exceed 100 characters.",
                    path: ["store_name"],
                });
            }

            if (!data.store_address || data.store_address.trim() === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Store address is required",
                    path: ["store_address"],
                });
            } else if (data.store_address.length < 10) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Store address must be at least 10 characters long.",
                    path: ["store_address"],
                });
            } else if (data.store_address.length > 510) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Store address must not exceed 510 characters.",
                    path: ["store_address"],
                });
            }
        }

        // ONLY VALIDATE FSR_NO FOR SPECIFIC CATEGORIES WHEN FSR ONLINE IS SELECTED
        if (data.system_name === "FSR Online" && data.category_labels) {
            const requiresFsrValidation = data.category_labels.some(
                (label) =>
                    label === "Wrong client input" ||
                    label === "Wrong service input" ||
                    label === "Wrong FSR Number Input" ||
                    label === "Wrong Ticket Number input" ||
                    label === "Delete FSR"
            );

            if (requiresFsrValidation) {
                if (!data.fsr_no || data.fsr_no.trim() === "") {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "FSR number is required",
                        path: ["fsr_no"],
                    });
                } else if (data.fsr_no.length < 10) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message:
                            "FSR number must be at least 10 characters long.",
                        path: ["fsr_no"],
                    });
                } else if (data.fsr_no.length > 255) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "FSR number must not exceed 255 characters.",
                        path: ["fsr_no"],
                    });
                }
            }
        }

        // VALIDATE POWERFORM FIELDS ONLY WHEN REQUIRED
        const requiresPowerFormFields =
            normalizeSystemName(data.system_name) === "power form" &&
            data.category_labels?.some((label) => {
                const normalizedLabel = normalize(label);
                return normalizedLabel === "forgot password" || normalizedLabel === "reset password" || normalizedLabel === "unable to login";
            });

        if (requiresPowerFormFields) {
            if (!data.powerform_full_name || data.powerform_full_name.trim() === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Full name is required for Power Form requests.",
                    path: ["powerform_full_name"],
                });
            } else if (data.powerform_full_name.length < 6) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Full name must be at least 6 characters long.",
                    path: ["powerform_full_name"],
                });
            } else if (data.powerform_full_name.length > 100) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Full name must not exceed 100 characters.",
                    path: ["powerform_full_name"],
                });
            }

            if (!data.powerform_employee_id || data.powerform_employee_id.trim() === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Employee ID is required for Power Form requests.",
                    path: ["powerform_employee_id"],
                });
            } else if (data.powerform_employee_id.length < 3) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Employee ID must be at least 3 characters long.",
                    path: ["powerform_employee_id"],
                });
            } else if (data.powerform_employee_id.length > 30) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Employee ID must not exceed 30 characters.",
                    path: ["powerform_employee_id"],
                });
            }

            if (!data.powerform_email || data.powerform_email.trim() === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Employee email is required for Power Form requests.",
                    path: ["powerform_email"],
                });
            } else if (!/^\S+@\S+\.\S+$/.test(data.powerform_email)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Employee email must be a valid email address.",
                    path: ["powerform_email"],
                });
            } else if (data.powerform_email.length > 100) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Employee email must not exceed 100 characters.",
                    path: ["powerform_email"],
                });
            }

            if (!data.powerform_company_number || data.powerform_company_number.trim() === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Company number is required for Power Form requests.",
                    path: ["powerform_company_number"],
                });
            } else if (data.powerform_company_number.length < 5) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Company number must be at least 11 characters long.",
                    path: ["powerform_company_number"],
                });
            } else if (data.powerform_company_number.length > 25) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Company number must not exceed 25 characters.",
                    path: ["powerform_company_number"],
                });
            }

            if (!data.powerform_imei || data.powerform_imei.trim() === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "IMEI is required for Power Form requests.",
                    path: ["powerform_imei"],
                });
            } else if (data.powerform_imei.length < 10) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "IMEI must be at least 15 characters long.",
                    path: ["powerform_imei"],
                });
            } else if (data.powerform_imei.length > 32) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "IMEI must not exceed 32 characters.",
                    path: ["powerform_imei"],
                });
            }
        }
    });

export type FormValues = z.infer<typeof formSchema>;

// UPDATE PENDING TICKET
export const updateForSchema = z.object({
    action_taken: z
        .string()
        .nonempty("The action taken is required.")
        .min(10, "The action taken must be at least 10 characters long.")
        .max(510, "The action taken must not exceed 510 characters."),
    resubmission_reason: z.string().nullable().optional(),
    attachment: z.instanceof(File).nullable().optional(),
});

export type UpdateFormValues = z.infer<typeof updateForSchema>;

// RESUBMIT TICKET
export const resubmitTicketSchema = z.object({
    resubmission_reason: z
        .string()
        .nonempty("Please enter a reason for resubmitting the ticket.")
        .min(20, "The reason must be at least 20 characters long.")
        .max(1024, "The reason must not exceed 1024 characters."),
    ticket_number: z.string().nullable().optional(),
    attachment: z.any().nullable().optional(),
});

export type ResubmitTicketFormValues = z.infer<typeof resubmitTicketSchema>;
