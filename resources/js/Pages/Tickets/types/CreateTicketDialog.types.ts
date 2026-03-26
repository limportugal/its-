import { UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { FormValues } from "@/Reuseable/validations/ticketValidation";

export interface CreateTicketDialogProps {
    open: boolean;
    handleClose: () => void;
    handleDialogClose: (event: { stopPropagation: () => void }, reason: string) => void;
    isMobile: boolean;
    ticketIsPending: boolean;
    control: any;
    errors: any;
    formResetKey?: number;
    priorityOptions: any[];
    categoryOptions: any[];
    serviceCenterOptions: any[];
    systemOptions: any[];
    ownershipOptions: any[];
    storeTypeOptions: any[];
    resetForm: () => void;
    handleSubmit: (callback: (data: any) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    submitForm: (data: any) => void;
    isPendingPriorities: boolean;
    isPendingCategories: boolean;
    isPendingServiceCenters: boolean;
    isPendingSystems: boolean;
    isPendingOwnerships: boolean;
    isPendingStoreTypes: boolean;

    // STATE AND HANDLERS FOR FORM CONTROLS
    serviceCenter: any;
    system: any;
    category: any;
    setServiceCenter: (value: any) => void;
    setSystem: (value: any) => void;
    setCategory: (value: any) => void;
    handleChange: (setter: (value: any) => void) => (event: any, newValue: any) => void;
    handleSystemChange: (event: any, newValue: any) => void;
    getValues: UseFormGetValues<FormValues>;
    setValue: UseFormSetValue<FormValues>;
}