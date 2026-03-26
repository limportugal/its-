import { useCallback, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";

// MUI COMPONENTS
import { useTheme, useMediaQuery } from "@mui/material";

// REACT HOOK FORM & ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// CREATE TICKET QUERIES & DROPDOWNS
import { useCategoriesQuery, useOwnershipsQuery, usePrioritiesQuery, useServiceCentersQuery, useStoreTypesQuery, useSystemsQuery } from '@/Pages/Tickets/TicketQueries';
import { useCategoryOptions, useOwnershipOptions, usePriorityOptions, useServiceCenterOptions, useStoreTypeOptions, useSystemOptions } from '@/Pages/Tickets/TicketDropdowns';

// TYPES, API, HELPERS, UTILS & VALIDATION 
import { createTicketData } from "@/Reuseable/api/ticket/create-ticket.api";
import { showSuccessAlert } from "@/Reuseable/helpers/createAndUpdateTicketAlerts";
import { toCapitalizeName } from "@/Reuseable/utils/capitalize";
import { formSchema, FormValues } from "@/Reuseable/validations/ticketValidation";
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { Ticket } from "@/Reuseable/types/ticketTypes";
 
// CREATE TICKET DIALOG
import CreateTicketDialog from "@/Pages/Tickets/TicketComponents/CreateTicketDialog";

const normalizeSystemName = (value?: string | null) =>
    value ? value.toLowerCase().replace(/\s+/g, " ").trim() : "";

const powerFormCategoryTriggers = new Set(["forgot password", "reset password", "unable to login", "unable to access"]);

const requiresPowerFormFields = (systemName?: string | null, labels?: string[]) =>
    normalizeSystemName(systemName) === "power form" &&
    !!labels?.some((label) => powerFormCategoryTriggers.has(label.toLowerCase().trim()));

const requiresAccountLockedFields = (systemName?: string | null, labels?: string[]) =>
    normalizeSystemName(systemName) === "power form" &&
    !!labels?.some((label) => label.toLowerCase().trim() === "account locked");

const requiresServiceLogsFields = (systemName?: string | null, labels?: string[]) =>
    normalizeSystemName(systemName) === "service logs system" &&
    !!labels?.some((label) => label.toLowerCase().trim() === "location error");

const requiresStoreFields = (systemName?: string | null, labels?: string[]) =>
    systemName === "Customer Not Found" ||
    (systemName === "FSR Online" && !!labels?.includes("Customer Not Found"));

const requireClientNameField = (systemName?: string | null, labels?: string[]) =>
    normalizeSystemName(systemName) === "power form" &&
    !!labels?.some((label) => label.toLowerCase().trim() === "additional store");

const requiresKnoxChangeOwnershipFields = (systemName?: string | null, labels?: string[]) =>
    normalizeSystemName(systemName) === "knox" &&
    !!labels?.some((label) => label.toLowerCase().includes("change ownership"));

const requiresPowerFormAdditionalNewStoreFields = (systemName?: string | null, labels?: string[]) =>
    normalizeSystemName(systemName) === "power form" &&
    !!labels?.some((label) => label.toLowerCase().trim() === "additional store");

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
        client_name: "",
        store_address: "",
        fsr_no: "",
        system_name: "",
        category_labels: [],
        powerform_full_name: "",
        powerform_employee_id: "",
        powerform_email: "",
        powerform_company_number: "",
        powerform_imei: "",
        powerform_client_name: "",
        powerform_store_code: "",
        powerform_store_name: "",
        powerform_store_address: "",
        powerform_store_ownership: "",
        powerform_store_type: "",
        service_logs_mobile_no: "",
        service_logs_mobile_model: "",
        service_logs_mobile_serial_no: "",
        service_logs_imei: "",
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

    // FETCH OWNERSHIP DATA FOR DROPDOWN - ONLY WHEN DIALOG IS OPEN
    const {
        data: ownershipData,
        isPending: isPendingOwnerships,
    } = useOwnershipsQuery(open);

    // FETCH STORE TYPE DATA FOR DROPDOWN - ONLY WHEN DIALOG IS OPEN
    const {
        data: storeTypeData,
        isPending: isPendingStoreTypes,
    } = useStoreTypesQuery(open);

    // DROPDOWN OPTIONS
    const priorityOptions = usePriorityOptions(priorityData);
    const serviceCenterOptions = useServiceCenterOptions(serviceCenterData);
    const systemOptions = useSystemOptions(systemData);
    const categoryOptions = useCategoryOptions(categoriesData, system?.value);
    const ownershipOptions = useOwnershipOptions(ownershipData);
    const storeTypeOptions = useStoreTypeOptions(storeTypeData);

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
            client_name:"",
            store_address: "",
            fsr_no: "",
            system_name: "",
            category_labels: [],
            powerform_full_name: "",
            powerform_employee_id: "",
            powerform_email: "",
            powerform_company_number: "",
            powerform_imei: "",
            powerform_client_name: "",
            powerform_store_code: "",
            powerform_store_name: "",
            powerform_store_address: "",
            powerform_store_ownership: "",
            powerform_store_type: "",
            service_logs_mobile_no: "",
            service_logs_mobile_model: "",
            service_logs_mobile_serial_no: "",
            service_logs_imei: "",
        });

        // ENSURE RHF-CONTROLLED FIELDS ARE EXPLICITLY CLEARED
        setValue('service_center_id', "");
        setValue('system_id', "");
        setValue('categories', []);
        setValue('priority_id', "");
        setValue('store_code', "");
        setValue('store_name', "");
        setValue('client_name', "");
        setValue('store_address', "");
        setValue('fsr_no', "");
        setValue('system_name', "");
        setValue('category_labels', []);
        setValue('powerform_full_name', "");
        setValue('powerform_employee_id', "");
        setValue('powerform_email', "");
        setValue('powerform_company_number', "");
        setValue('powerform_imei', "");
        setValue('powerform_client_name', "");
        setValue('powerform_store_code', "");
        setValue('powerform_store_name', "");
        setValue('powerform_store_address', "");
        setValue('powerform_store_ownership', "");
        setValue('powerform_store_type', "");
        setValue('service_logs_mobile_no', "");
        setValue('service_logs_mobile_model', "");
        setValue('service_logs_mobile_serial_no', "");
        setValue('service_logs_imei', "");
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

    // UNIFIED SUBMIT FORM FUNCTION
    const submitForm = useCallback(
        async (data: FormValues) => {
            // CREATE FORMDATA AND SUBMIT WITH MUTATION
            const submitData = new FormData();

            // APPEND FORM FIELDS
            submitData.append('full_name', toCapitalizeName(data.full_name));
            submitData.append('email', data.email);
            submitData.append('service_center_id', String(data.service_center_id));
            submitData.append('system_id', String(data.system_id));
            submitData.append('description', data.description);
            submitData.append('priority_id', String(data.priority_id));

            // APPEND STORE FIELDS IF CUSTOMER NOT FOUND IS SELECTED
            // OR IF FSR ONLINE IS SELECTED WITH CUSTOMER NOT FOUND CATEGORY
            if (requiresStoreFields(data.system_name, data.category_labels)) {
                submitData.append('store_code', data.store_code || "");
                submitData.append('store_name', data.store_name || "");
                submitData.append('store_address', data.store_address || "");
            }
            
            // APPEND FSR NO FIELD IF FSR ONLINE IS SELECTED AND REQUIRES FSR VALIDATION
            if (data.system_name === "FSR Online") {
                const requiresFsrValidation = data.category_labels?.some(
                    (label) =>
                        label === "Wrong client input" ||
                        label === "Wrong service input" ||
                        label === "Wrong FSR Number Input" ||
                        label === "Wrong Ticket Number input" ||
                        label === "Delete FSR"
                );
                
                if (requiresFsrValidation) {
                    submitData.append('fsr_no', data.fsr_no || "");
                }
            }

            if (requiresPowerFormFields(data.system_name, data.category_labels)) {
                submitData.append('powerform_full_name', data.powerform_full_name || "");
                submitData.append('powerform_employee_id', data.powerform_employee_id || "");
                submitData.append('powerform_email', data.powerform_email || "");
                submitData.append('powerform_company_number', data.powerform_company_number || "");
                submitData.append('powerform_imei', data.powerform_imei || "");
            }

            if (requiresPowerFormAdditionalNewStoreFields(data.system_name, data.category_labels)) {
                submitData.append('powerform_client_name', data.powerform_client_name || "");
                submitData.append('powerform_store_code', data.powerform_store_code || "");
                submitData.append('powerform_store_name', data.powerform_store_name || "");
                submitData.append('powerform_store_address', data.powerform_store_address || "");
                submitData.append('powerform_store_ownership', data.powerform_store_ownership || "");
                submitData.append('powerform_store_type', data.powerform_store_type || "");
            }

            if (requiresAccountLockedFields(data.system_name, data.category_labels)) {
                submitData.append('powerform_email', data.powerform_email || "");
                submitData.append('powerform_company_number', data.powerform_company_number || "");
            }

            if (requiresServiceLogsFields(data.system_name, data.category_labels)) {
                submitData.append('service_logs_mobile_no', data.service_logs_mobile_no || "");
                submitData.append('service_logs_mobile_model', data.service_logs_mobile_model || "");
                submitData.append('service_logs_mobile_serial_no', data.service_logs_mobile_serial_no || "");
                submitData.append('service_logs_imei', data.service_logs_imei || "");
            }

            // APPEND KNOX CHANGE OWNERSHIP FIELDS
            if (requiresKnoxChangeOwnershipFields(data.system_name, data.category_labels)) {
                submitData.append('knox_full_name', data.knox_full_name || "");
                submitData.append('knox_employee_id', data.knox_employee_id || "");
                submitData.append('knox_email', data.knox_email || "");
                submitData.append('knox_company_mobile_number', data.knox_company_mobile_number || "");
                submitData.append('knox_mobile_imei', data.knox_mobile_imei || "");
            }

            if (requireClientNameField(data.system_name, data.category_labels)) {
                // Keep legacy client_name in payload for backward compatibility.
                submitData.append('client_name', data.powerform_client_name || data.client_name || "");
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

        if (normalizeSystemName(newValue?.label) !== "power form") {
            setValue('powerform_full_name', "");
            setValue('powerform_employee_id', "");
            setValue('powerform_email', "");
            setValue('powerform_company_number', "");
            setValue('powerform_imei', "");
            setValue('powerform_client_name', "");
            setValue('powerform_store_code', "");
            setValue('powerform_store_name', "");
            setValue('powerform_store_address', "");
            setValue('powerform_store_ownership', "");
            setValue('powerform_store_type', "");
        }

        if (normalizeSystemName(newValue?.label) !== "service logs system") {
            setValue('service_logs_mobile_no', "");
            setValue('service_logs_mobile_model', "");
            setValue('service_logs_mobile_serial_no', "");
            setValue('service_logs_imei', "");
        }

        if (normalizeSystemName(newValue?.label) !== "knox") {
            setValue('knox_full_name', "");
            setValue('knox_employee_id', "");
            setValue('knox_email', "");
            setValue('knox_company_mobile_number', "");
            setValue('knox_mobile_imei', "");
        }
    };

    // RENDER TICKET COMPONENTS
    const isLoading = isPendingCategories || isPendingPriorities || isPendingServiceCenters || isPendingSystems || isPendingOwnerships || isPendingStoreTypes;

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
            ownershipOptions={ownershipOptions}
            storeTypeOptions={storeTypeOptions}
            isPendingOwnerships={isPendingOwnerships}
            isPendingStoreTypes={isPendingStoreTypes}
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
