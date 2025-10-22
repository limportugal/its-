import { useCallback, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";

// MUI COMPONENTS
import { useTheme, useMediaQuery } from "@mui/material";

// REACT HOOK FORM & ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// CREATE TICKET QUERIES & DROPDOWNS
import { useCategoriesQuery, usePrioritiesQuery, useServiceCentersQuery, useSystemsQuery } from '@/Pages/Tickets/TicketQueries';
import { useCategoryOptions, usePriorityOptions, useServiceCenterOptions, useSystemOptions } from '@/Pages/Tickets/TicketDropdowns';

// TYPES, API, HELPERS, UTILS & VALIDATION 
import { createTicketData } from "@/Reuseable/api/ticket/create-ticket.api";
import { showSuccessAlert } from "@/Reuseable/helpers/createAndUpdateTicketAlerts";
import { toCapitalizeName } from "@/Reuseable/utils/capitalize";
import { formSchema, FormValues } from "@/Reuseable/validations/ticketValidation";
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { Ticket } from "@/Reuseable/types/ticketTypes";

// CREATE TICKET DIALOG & RECAPTCHA
import CreateTicketDialog from "@/Pages/Tickets/TicketComponents/CreateTicketDialog";
import { ReCaptchaRef } from "@/Pages/Tickets/TicketComponents/ReCaptcha";

// CREATE TICKET COMPONENT
const CreateTicket = forwardRef<
    {
        clearForm: () => void;
        ticketIsPending: boolean;
        isLoading: boolean;
        hasData: boolean;
        refetchData: () => Promise<void>;
    },
    {
        open: boolean;
        handleClose: () => void;
        ticket?: Ticket;
    }
>(({ open, handleClose, ticket }, _ref) => {
    const handleDialogClose = (
        event: { stopPropagation: () => void },
        reason: string,
    ) => {
        if (reason === "backdropClick") {
            event.stopPropagation();
        } else {
            handleClose();
            resetForm();
        }
    };

    // DETECT SMALL SCREENS TO MAKE FULL DISPLAY
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // INVISIBLE RECAPTCHA
    const recaptchaRef = useRef<ReCaptchaRef>(null);
    const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    // STATE FOR FORM CONTROLS
    const [serviceCenter, setServiceCenter] = useState<any>(null);
    const [system, setSystem] = useState<any>(null);
    const [category, setCategory] = useState<any>([]);

    // DEFAULT VALUES FOR THE FORM
    const defaultValues: FormValues = {
        full_name: ticket?.full_name ?? "",
        email: ticket?.email ?? "",
        service_center_id: "",
        system_id: "",
        categories: Array.isArray(ticket?.category) ? ticket?.category || [] : [],
        description: ticket?.description ?? "",
        attachment: null, // ALWAYS START WITH NULL FOR NEW TICKETS
        priority_id: ticket?.priority_id ? String(ticket.priority_id) : "",
        store_code: "",
        store_name: "",
        store_address: "",
        fsr_no: "",
        system_name: "",
        category_labels: [],
    };

    // ZOD RESOLVER FOR VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        getValues,
        setValue,
        resetField,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues,
        mode: "all",
        shouldFocusError: true,
        resolver: zodResolver(formSchema),
    });


    // FETCH CATEGORIES DATA FOR DROPDOWN - ONLY WHEN DIALOG IS OPEN AND SYSTEM IS SELECTED
    const {
        data: categoriesData,
        isPending: isPendingCategories,
    } = useCategoriesQuery(open && !!system?.value, system?.value);

    // FETCH PRIORITY DATA FOR DROPDOWN - ONLY WHEN DIALOG IS OPEN
    const {
        data: priorityData,
        isPending: isPendingPriorities,
    } = usePrioritiesQuery(open);

    // FETCH SERVICE CENTER DATA FOR DROPDOWN - ONLY WHEN DIALOG IS OPEN
    const {
        data: serviceCenterData,
        isPending: isPendingServiceCenters,
    } = useServiceCentersQuery(open);

    // FETCH SYSTEM DATA FOR DROPDOWN - ONLY WHEN DIALOG IS OPEN
    const {
        data: systemData,
        isPending: isPendingSystems,
    } = useSystemsQuery(open);

    // DROPDOWN OPTIONS
    const priorityOptions = usePriorityOptions(priorityData);
    const serviceCenterOptions = useServiceCenterOptions(serviceCenterData);
    const systemOptions = useSystemOptions(systemData);
    const categoryOptions = useCategoryOptions(categoriesData, system?.value);

    // FORCE RE-MOUNT OF INPUTS AFTER CLEAR TO RESET INTERNAL AUTOCOMPLETE INPUT STATE
    const [formResetKey, setFormResetKey] = useState<number>(0);

    // CLEAR FORM
    const resetForm = useCallback(() => {
        // CLEAR LOCAL STATE VARIABLES FIRST
        setServiceCenter(null);
        setSystem(null);
        setCategory([]);

        // RESET FORM WITH DEFAULT VALUES
        reset({
            full_name: "",
            email: "",
            service_center_id: "",
            system_id: "",
            categories: [],
            description: "",
            attachment: null,
            priority_id: "",
            store_code: "",
            store_name: "",
            store_address: "",
            fsr_no: "",
            system_name: "",
            category_labels: [],
        });

        // ENSURE RHF-CONTROLLED FIELDS ARE EXPLICITLY CLEARED
        setValue('service_center_id', "");
        setValue('system_id', "");
        setValue('categories', []);
        setValue('priority_id', "");
        setValue('store_code', "");
        setValue('store_name', "");
        setValue('store_address', "");
        setValue('fsr_no', "");
        setValue('system_name', "");
        setValue('category_labels', []);
        resetField('attachment');

        // BUMP KEY TO FORCEFULLY RE-MOUNT AUTOCOMPLETE COMPONENTS AND CLEAR ANY INTERNAL INPUT TEXT
        setFormResetKey((k) => k + 1);
    }, [reset, setValue, resetField]);

    // RESET FORM WHEN DIALOG OPENS
    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open]);

    // TANSTACK - USEMUTATION HOOK WITH USEQUERYCLIENT
    const queryClient = useQueryClient();
    const { mutate: createTicketMutation, isPending: ticketIsPending } =
        useDynamicMutation({
            mutationFn: (variables: FormData) => createTicketData(variables),
            mutationKey: "getTicketsData",
            onSuccess: async (response: any) => {
                const ticketNumber = response.data?.ticket_number || 'Unknown';
                const successMessage = `Your ticket has been successfully created.<br>
                    Please check your email for confirmation and further updates. <br>
                    <strong style="color: #333;">Ticket #:</strong> <strong style="color: #1976D2;">${ticketNumber}</strong>`;

                // CLOSE DIALOG AND CLEAR FORM FIRST
                resetForm();
                handleClose();

                // SHOW SUCCESS ALERT FIRST
                await showSuccessAlert(undefined, successMessage);

                // INVALIDATE QUERIES IN BACKGROUND
                await queryClient.invalidateQueries({
                    queryKey: ['getPendingTickets'],
                    exact: true
                });
            },
            onError: (error: any) => {
                let errorMessage = "Something went wrong. Please try again.";
                // SERVER ERROR
                if (error.response?.data) {
                    if (typeof error.response.data === "string") {
                        errorMessage = error.response.data;
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response.data.errors) {
                        const firstErrorKey = Object.keys(error.response.data.errors)[0];
                        errorMessage = error.response.data.errors[firstErrorKey][0];
                    }
                }
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: errorMessage,
                    confirmButtonColor: "#1976D2",
                    allowOutsideClick: false,
                    width: '640px',
                }).then(() => {
                    // CLEAN UP AFTER THE ALERT IS CLOSED
                    Swal.getPopup()?.remove();
                    Swal.getContainer()?.remove();
                });
            },
        });

    // UNIFIED ERROR ALERT HELPER
    const showRecaptchaAlert = useCallback((icon: 'error' | 'warning', title: string, text: string) => {
        Swal.fire({
            icon,
            title,
            text,
            confirmButtonColor: "#1976D2",
            allowOutsideClick: false,
        });
    }, []);

    // UNIFIED SUBMIT FORM FUNCTION
    const submitForm = useCallback(
        async (data: FormValues, recaptchaToken?: string) => {
            // IF NO TOKEN PROVIDED, TRIGGER RECAPTCHA OR USE FALLBACK
            if (!recaptchaToken) {
                // STORE FORM DATA FOR RECAPTCHA CALLBACK
                (window as any).pendingFormData = data;

                // EXECUTE INVISIBLE RECAPTCHA FIRST
                if (recaptchaRef.current) {
                    recaptchaRef.current.execute();
                } else {
                    // FALLBACK: SUBMIT WITH TEST TOKEN IF RECAPTCHA FAILS TO LOAD
                    await submitForm(data, 'test_token');
                }
                return;
            }

            // CREATE FORMDATA AND SUBMIT WITH MUTATION
            const submitData = new FormData();

            // APPEND FORM FIELDS
            submitData.append('full_name', toCapitalizeName(data.full_name));
            submitData.append('email', data.email);
            submitData.append('service_center_id', String(data.service_center_id));
            submitData.append('system_id', String(data.system_id));
            submitData.append('description', data.description);
            submitData.append('priority_id', String(data.priority_id));
            submitData.append('recaptcha_token', recaptchaToken);

            // APPEND STORE FIELDS IF CUSTOMER NOT FOUND IS SELECTED
            if (data.system_name === "Customer Not Found") {
                submitData.append('store_code', data.store_code || "");
                submitData.append('store_name', data.store_name || "");
                submitData.append('store_address', data.store_address || "");
            }
            
            // APPEND FSR NO FIELD IF FSR ONLINE IS SELECTED
            if (data.system_name === "FSR Online") {
                submitData.append('fsr_no', data.fsr_no || "");
            }

            // HANDLE FILE ATTACHMENT
            if (data.attachment && data.attachment instanceof File) {
                submitData.append('attachment', data.attachment);
            }

            // HANDLE CATEGORIES
            if (data.categories && data.categories.length > 0) {
                data.categories.forEach((categoryId) => {
                    submitData.append('categories[]', String(categoryId));
                });
            }

            // SUBMIT WITH MUTATION
            createTicketMutation(submitData);
        },
        [createTicketMutation],
    );

    // HANDLE RECAPTCHA TOKEN RECEIVED
    const handleRecaptchaChange = useCallback(
        async (token: string | null) => {
            if (!token) {
                showRecaptchaAlert('error', 'Error!', 'reCAPTCHA verification failed. Please try again.');
                return;
            }

            // GET STORED FORM DATA
            const formData = (window as any).pendingFormData;
            if (!formData) {
                showRecaptchaAlert('error', 'Error!', 'Form data not available. Please try again.');
                return;
            }

            // SUBMIT WITH TOKEN
            await submitForm(formData, token);
        },
        [submitForm, showRecaptchaAlert],
    );

    // HANDLE RECAPTCHA ERRORS
    const handleRecaptchaError = useCallback(() => {
        showRecaptchaAlert('error', 'Error!', 'reCAPTCHA verification failed. Please try again.');
    }, [showRecaptchaAlert]);

    const handleRecaptchaExpired = useCallback(() => {
        showRecaptchaAlert('warning', 'Session Expired', 'reCAPTCHA session expired. Please try again.');
    }, [showRecaptchaAlert]);

    // HANDLE CHANGE FUNCTIONS
    const handleChange = (setter: (value: any) => void) => (event: any, newValue: any) => {
        setter(newValue);
    };

    const handleSystemChange = (_event: any, newValue: any) => {
        setSystem(newValue);
        setCategory(null); // RESET CATEGORY WHEN SYSTEM CHANGES
        
        // UPDATE system_name FOR VALIDATION
        setValue('system_name', newValue?.label || "");
        
        // CLEAR STORE FIELDS IF CHANGING FROM "Customer Not Found"
        if (newValue?.label !== "Customer Not Found") {
            setValue('store_code', "");
            setValue('store_name', "");
            setValue('store_address', "");
        }
        
        // CLEAR FSR NO FIELD IF CHANGING FROM "FSR Online"
        if (newValue?.label !== "FSR Online") {
            setValue('fsr_no', "");
        }
    };

    // RENDER TICKET COMPONENTS
    const isLoading = isPendingCategories || isPendingPriorities || isPendingServiceCenters || isPendingSystems;

    // EXPOSE FUNCTIONS TO PARENT COMPONENT
    useImperativeHandle(_ref, () => ({
        clearForm: resetForm,
        ticketIsPending,
        isLoading,
        hasData: !!(categoriesData),
        refetchData: async () => { }
    }));

    return (
        <CreateTicketDialog
            open={open}
            handleClose={handleClose}
            handleDialogClose={handleDialogClose}
            isMobile={isMobile}
            ticketIsPending={ticketIsPending}
            control={control}
            errors={errors}
            resetForm={resetForm}
            handleSubmit={handleSubmit}
            submitForm={submitForm}
            formResetKey={formResetKey}
            priorityOptions={priorityOptions}
            isPendingPriorities={isPendingPriorities}
            categoryOptions={categoryOptions}
            isPendingCategories={isPendingCategories}
            serviceCenterOptions={serviceCenterOptions}
            isPendingServiceCenters={isPendingServiceCenters}
            systemOptions={systemOptions}
            isPendingSystems={isPendingSystems}
            recaptchaRef={recaptchaRef}
            recaptchaSiteKey={recaptchaSiteKey}
            onRecaptchaChange={handleRecaptchaChange}
            onRecaptchaError={handleRecaptchaError}
            onRecaptchaExpired={handleRecaptchaExpired}
            serviceCenter={serviceCenter}
            system={system}
            category={category}
            setServiceCenter={setServiceCenter}
            setSystem={setSystem}
            setCategory={setCategory}
            handleChange={handleChange}
            handleSystemChange={handleSystemChange}
            getValues={getValues}
            setValue={setValue}
        />
    );
});

export default CreateTicket;