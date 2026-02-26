import { Controller, useWatch } from "react-hook-form";
import React, { useMemo } from "react";

// MUI COMPONENTS
import { Typography, Grid, Dialog, DialogContent, DialogActions, Button, Box, Chip, TextField, CircularProgress, Checkbox } from "@mui/material";
import MuiTextField from "@/Components/Mui/MuiTextField";
import DialogTitle from "@/Components/Mui/DialogTitle";
import Dropdown from "@/Components/Mui/Dropdown";

// MUI ICONS
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import DevicesIcon from '@mui/icons-material/Devices';
import ReportIcon from '@mui/icons-material/Report';
import DescriptionIcon from '@mui/icons-material/Description';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TagIcon from '@mui/icons-material/Tag';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SendIcon from '@mui/icons-material/Send';

// CREATE TICKET COMPONENTS
import FileUploadField from "@/Pages/Tickets/TicketComponents/FileUploadField";
import PriorityChip from "@/Pages/Tickets/TicketComponents/PriorityChip";
import AutoComplete from "@/Components/Mui/AutoComplete";

// SKELETON COMPONENT
import CreateTicketSkeleton from "@/Pages/Tickets/Skeletons/CreateTicketSkeleton";

// TYPES
import { CreateTicketDialogProps } from "@/Pages/Tickets/types/CreateTicketDialog.types";

const CreateTicketDialog: React.FC<CreateTicketDialogProps> = ({
    open,
    handleClose,
    handleDialogClose,
    isMobile,
    ticketIsPending,
    priorityOptions,
    isPendingPriorities,
    categoryOptions,
    isPendingCategories,
    serviceCenterOptions,
    systemOptions,
    isPendingServiceCenters,
    isPendingSystems,
    control,
    errors,
    formResetKey,
    resetForm,
    handleSubmit,
    submitForm,
    serviceCenter,
    system,
    category,
    setServiceCenter,
    setSystem,
    setCategory,
    handleChange,
    handleSystemChange,
    getValues,
    setValue,
}) => {
    const showSkeleton = isPendingPriorities || isPendingServiceCenters || isPendingSystems;

    const normalizeText = (value?: string | number | null) => {
        if (value === undefined || value === null) return "";
        return String(value).trim().toLowerCase();
    };

    // WATCH system_name TO CONDITIONALLY SHOW STORE FIELDS
    const systemName = useWatch({
        control,
        name: "system_name",
        defaultValue: "",
    });
    
    // WATCH categories TO CONDITIONALLY SHOW FSR NO FIELD
    const selectedCategories = useWatch({
        control,
        name: "categories",
    }) as (string | number)[] | undefined;

    // DETERMINE IF STORE FIELDS SHOULD BE SHOWN
    // SHOW WHEN "Customer Not Found" SYSTEM IS SELECTED
    // OR WHEN "FSR Online" IS SELECTED AND "Customer Not Found" CATEGORY IS SELECTED
    const showStoreFields = useMemo(() => {
        const normalizedSystemName = normalizeText(systemName);
        if (normalizedSystemName === "customer not found") return true;

        if (normalizedSystemName === "fsr online") {
            // GET "Customer Not Found" CATEGORY ID
            const customerNotFoundCategoryId = categoryOptions
                .find((cat: any) => normalizeText(cat.label) === "customer not found")?.value;

            // CHECK IF "Customer Not Found" CATEGORY IS SELECTED
            return selectedCategories?.some(
                (categoryId) => normalizeText(categoryId) === normalizeText(customerNotFoundCategoryId)
            ) || false;
        }

        return false;
    }, [systemName, selectedCategories, categoryOptions]);
    
    // DETERMINE IF FSR NO FIELD SHOULD BE SHOWN
    // Show when FSR Online is selected AND one of the specific categories is selected
    const showFsrNoField = useMemo(() => {
        if (normalizeText(systemName) !== "fsr online") return false;
        
        // GET CATEGORY LABELS THAT SHOULD TRIGGER FSR NO FIELD
        const triggerCategoryIds = categoryOptions
            .filter((cat: any) => {
                const label = normalizeText(cat.label);
                return (
                    label === "wrong client input" ||
                    label === "wrong service input" ||
                    label === "wrong fsr number input" ||
                    label === "wrong ticket number input" ||
                    label === "delete fsr"
                );
            })
            .map((cat: any) => cat.value);
        
        // CHECK IF ANY SELECTED CATEGORY MATCHES THE TRIGGER CATEGORIES
        return selectedCategories?.some((catId) =>
            triggerCategoryIds.some((triggerId: string) => normalizeText(triggerId) === normalizeText(catId))
        ) || false;
    }, [systemName, selectedCategories, categoryOptions]);

    // DETERMINE IF POWERFORM FIELDS SHOULD BE SHOWN
    const showPowerFormFields = useMemo(() => {
        if (normalizeText(systemName) !== "power form") return false;

        const triggerLabels = new Set(["forgot password", "reset password", "unable to login", "unable to access"]);
        const triggerCategoryIds = categoryOptions
            .filter((cat: { label: string }) => triggerLabels.has(normalizeText(cat.label)))
            .map((cat: { value: string | number }) => String(cat.value));

        const normalizedSelectedCategories = selectedCategories?.map((categoryId) => normalizeText(categoryId)) || [];
        return normalizedSelectedCategories.some((categoryId) =>
            triggerCategoryIds.some((triggerId) => normalizeText(triggerId) === categoryId)
        );
    }, [systemName, selectedCategories, categoryOptions]);

    // DETERMINE IF POWERFORM ADDITIONAL NEW STORE FIELDS SHOULD BE SHOWN
    const showPowerFormAdditionalNewStoreFields = useMemo(() => {
        if (normalizeText(systemName) !== "power form") return false;

        return selectedCategories?.some((categoryId) => {
            const category = categoryOptions.find((cat: any) => normalizeText(cat.value) === normalizeText(categoryId));
            return category && normalizeText(category.label) === "additional new store";
        }) || false;
    }, [systemName, selectedCategories, categoryOptions]);

    // DETERMINE IF ACCOUNT LOCKED FIELDS SHOULD BE SHOWN
    // ONLY SHOW IF ACCOUNT LOCKED IS SELECTED AND NO OTHER POWERFORM CATEGORIES ARE SELECTED
    const showAccountLockedFields = useMemo(() => {
        if (normalizeText(systemName) !== "power form") return false;
        if (showPowerFormFields) return false; // DON'T SHOW IF OTHER POWERFORM CATEGORIES ARE SELECTED

        const triggerLabel = "account locked";
        const triggerCategoryIds = categoryOptions
            .filter((cat: { label: string }) => normalizeText(cat.label) === triggerLabel)
            .map((cat: { value: string | number }) => String(cat.value));

        const normalizedSelectedCategories = selectedCategories?.map((categoryId) => normalizeText(categoryId)) || [];
        return normalizedSelectedCategories.some((categoryId) =>
            triggerCategoryIds.some((triggerId) => normalizeText(triggerId) === categoryId)
        );
    }, [systemName, selectedCategories, categoryOptions, showPowerFormFields]);

    // DETERMINE IF SERVICE LOGS FIELDS SHOULD BE SHOWN
    // SHOW WHEN "Service Logs System" IS SELECTED AND "Location Error" CATEGORY IS SELECTED
    const showServiceLogsFields = useMemo(() => {
        if (normalizeText(systemName) !== "service logs system") return false;

        const triggerLabel = "location error";
        const triggerCategoryIds = categoryOptions
            .filter((cat: { label: string }) => normalizeText(cat.label) === triggerLabel)
            .map((cat: { value: string | number }) => String(cat.value));

        const normalizedSelectedCategories = selectedCategories?.map((categoryId) => normalizeText(categoryId)) || [];
        return normalizedSelectedCategories.some((categoryId) =>
            triggerCategoryIds.some((triggerId) => normalizeText(triggerId) === categoryId)
        );
    }, [systemName, selectedCategories, categoryOptions]);

    // DETERMINE IF KNOX CHANGE OWNERSHIP FIELDS SHOULD BE SHOWN
    // SHOW WHEN "Knox" IS SELECTED AND "Change Ownership" CATEGORY IS SELECTED
    const showKnoxChangeOwnershipFields = useMemo(() => {
        if (normalizeText(systemName) !== "knox") return false;

        // Check if any selected category contains "change ownership"
        return selectedCategories?.some((categoryId) => {
            const category = categoryOptions.find((cat: any) => cat.value === categoryId);
            return category && normalizeText(category.label).includes("change ownership");
        }) || false;
    }, [systemName, selectedCategories, categoryOptions]);

    return (
        <Dialog
            open={open}
            onClose={isPendingPriorities || isPendingServiceCenters || isPendingSystems || ticketIsPending ? undefined : handleDialogClose}
            fullWidth={false}
            fullScreen={isMobile}
            maxWidth={false}
            PaperProps={{
                tabIndex: 0,
                sx: {
                    width: '960px',
                    maxWidth: '960px',
                }
            }}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            disableEnforceFocus={false}
            disableAutoFocus={false}
            keepMounted={false}
            aria-modal="true"
        >
            <DialogTitle
                title="Ticket Creation Form"
                subtitle="Kindly provide complete and detailed information about your issue. Our support team will review your request and respond accordingly."
                handleClose={handleClose}
                disabled={isPendingPriorities || isPendingServiceCenters || isPendingSystems || ticketIsPending}
            />
            <Typography id="dialog-title" variant="h6" sx={{ display: 'none' }}>
                Create a New Ticket
            </Typography>
            <DialogContent dividers>
                {showSkeleton ? (
                    <CreateTicketSkeleton />
                ) : (
                    <form onSubmit={handleSubmit(submitForm)}>
                        <Grid
                            container
                            spacing={{ xs: 0.5, sm: 2 }}
                            sx={{
                                px: { xs: 0, sm: 6 },
                                py: { xs: 0, sm: 0 },
                            }}
                        >
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <MuiTextField
                                    name="full_name"
                                    label="FULL NAME"
                                    control={control}
                                    placeholder="Enter your name"
                                    errors={errors}
                                    fullWidth
                                    disabled={ticketIsPending}
                                    icon={<PersonIcon />}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <MuiTextField
                                    name="email"
                                    label="EMAIL"
                                    control={control}
                                    placeholder="Enter your email"
                                    errors={errors}
                                    fullWidth
                                    disabled={ticketIsPending}
                                    icon={<EmailIcon />}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ mt: isMobile ? 1 : 0 }}>
                                <Controller
                                    name="service_center_id"
                                    control={control}
                                    render={({ field }) => (
                                        <AutoComplete
                                            key={`service-center-${formResetKey}`}
                                            name="service_center_id"
                                            label="BRANCH"
                                            options={serviceCenterOptions}
                                            value={serviceCenter}
                                            onChange={(event, newValue) => {
                                                setServiceCenter(newValue);
                                                field.onChange((newValue as any)?.value || "");
                                            }}
                                            onBlur={field.onBlur}
                                            disabled={ticketIsPending}
                                            loading={isPendingServiceCenters}
                                            error={errors.service_center_id}
                                            isOptionEqualToValue={(option, value) => option.value === value?.value}
                                            fullWidth
                                            icon={<LocationOnIcon />}
                                            placeholder="Select a branch"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ mt: isMobile ? 0.5 : -1 }}>
                                <Dropdown
                                    key={`priority-${formResetKey}`}
                                    name="priority_id"
                                    label="PRIORITY"
                                    control={control}
                                    options={priorityOptions}
                                    errors={errors}
                                    disabled={ticketIsPending || isPendingPriorities}
                                    loading={isPendingPriorities}
                                    icon={<SignalCellularAltIcon />}
                                    placeholder="Select a priority"
                                    renderOption={(props: any, option: any) => {
                                        const { key, ...otherProps } = props;
                                        return (
                                            <li key={key} {...otherProps}>
                                                <PriorityChip label={option.label} priority={option.label} />
                                            </li>
                                        );
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} sx={{ mt: isMobile ? 1 : 0 }}>
                                <Controller
                                    name="system_id"
                                    control={control}
                                    render={({ field }) => (
                                        <AutoComplete
                                            key={`system-${formResetKey}`}
                                            name="system_id"
                                            label="SYSTEM"
                                            options={systemOptions}
                                            value={system}
                                            onChange={(event, newValue) => {
                                                handleSystemChange(event, newValue);
                                                field.onChange((newValue as any)?.value || "");
                                            }}
                                            onBlur={field.onBlur}
                                            disabled={ticketIsPending}
                                            loading={isPendingSystems}
                                            error={errors.system_id}
                                            isOptionEqualToValue={(option, value) => option.value === value?.value}
                                            fullWidth
                                            icon={<DevicesIcon />}
                                            placeholder="Select a system"
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, }} sx={{ mt: isMobile ? 1.5 : 0, mb: isMobile ? 0.8 : 0 }}>
                                <Controller
                                    name="categories"
                                    control={control}
                                    render={({ field }) => {
                                        // Memoize the selected values to prevent unnecessary re-renders
                                        const selectedCategoryObjects = useMemo(() => {
                                            if (!field.value || !Array.isArray(field.value) || field.value.length === 0) {
                                                return [];
                                            }
                                            return categoryOptions.filter((opt: any) => field.value.includes(opt.value));
                                        }, [field.value, categoryOptions]);

                                        return (
                                            <AutoComplete
                                                key={`categories-${formResetKey}`}
                                                label="PROBLEM CATEGORY"
                                                name="categories"
                                                options={categoryOptions}
                                                value={selectedCategoryObjects}
                                                onChange={(event, newValue) => {
                                                    const selectedValues = newValue ? newValue.map((item: any) => item.value) : [];
                                                    const selectedLabels = newValue ? newValue.map((item: any) => item.label) : [];
                                                    field.onChange(selectedValues);
                                                    setValue('category_labels', selectedLabels);
                                                }}
                                                onBlur={field.onBlur}
                                                disabled={ticketIsPending || !system}
                                                loading={system && isPendingCategories}
                                                multiple={true}
                                                disableCloseOnSelect={true}
                                                fullWidth={true}
                                                error={errors.categories}
                                                limitTags={1}
                                                getOptionLabel={(option) =>
                                                    typeof option === 'string' ? option : option.label
                                                }
                                                isOptionEqualToValue={(option, value) => {
                                                    if (!option || !value) return false;
                                                    return option.value === value.value;
                                                }}
                                                icon={<ReportIcon />}
                                                placeholder={selectedCategoryObjects.length > 0 ? "" : "Select a problem category"}
                                                renderTags={(value, getTagProps) => {
                                                    return value.map((option, index) => {
                                                        const { key, ...tagProps } = getTagProps({ index });
                                                        return (
                                                            <Chip
                                                                key={key}
                                                                {...tagProps}
                                                                label={option.label}
                                                                deleteIcon={
                                                                    <Box
                                                                        component="span"
                                                                        sx={{
                                                                            width: '18px',
                                                                            height: '18px',
                                                                            borderRadius: '50%',
                                                                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            fontSize: '12px',
                                                                            color: 'rgba(0, 0, 0, 0.54)',
                                                                        }}
                                                                    >
                                                                        ×
                                                                    </Box>
                                                                }
                                                                sx={{
                                                                    height: '28px',
                                                                    maxWidth: '180px',
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                                    color: 'rgba(0, 0, 0, 0.87)',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: 400,
                                                                    '& .MuiChip-label': {
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                        maxWidth: '140px',
                                                                        paddingLeft: '8px',
                                                                        paddingRight: '4px',
                                                                    },
                                                                    '& .MuiChip-deleteIcon': {
                                                                        marginLeft: '4px',
                                                                        marginRight: '4px',
                                                                        fontSize: '16px',
                                                                    },
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                                                    },
                                                                }}
                                                            />
                                                        );
                                                    });
                                                }}
                                                renderOption={(props, option, { selected }) => {
                                                    const { key, ...otherProps } = props as any;
                                                    return (
                                                        <li key={key} {...otherProps}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <Checkbox checked={selected} />
                                                                <span>{option.label}</span>
                                                            </div>
                                                        </li>
                                                    );
                                                }}
                                            />
                                        );
                                    }}
                                />
                            </Grid>

                            {/* CONDITIONAL STORE FIELDS - ONLY SHOW IF "Customer Not Found" IS SELECTED */}
                            {showStoreFields && (
                                <>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="store_code"
                                            label="STORE CODE"
                                            placeholder="Enter store code"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<QrCode2Icon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="store_name"
                                            label="STORE NAME"
                                            placeholder="Enter store name"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<StorefrontIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }} sx={{ mt: isMobile ? 0 : -1 }}>
                                        <MuiTextField
                                            name="store_address"
                                            label="ADDRESS"
                                            placeholder="Enter address"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<LocationOnIcon />}
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* CONDITIONAL FSR NO FIELD - ONLY SHOW IF "FSR Online" IS SELECTED */}
                            {showFsrNoField && (
                                <Grid size={{ xs: 12}} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                    <MuiTextField
                                        name="fsr_no"
                                        label="FSR NO"
                                        placeholder="Enter FSR no."
                                        control={control}
                                        errors={errors}
                                        disabled={ticketIsPending}
                                        fullWidth
                                        icon={<TagIcon />}
                                    />
                                </Grid>
                            )}

                            {/* CONDITIONAL POWERFORM FIELDS */}
                            {showPowerFormFields && (
                                <>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="powerform_full_name"
                                            label="FULL NAME"
                                            placeholder="Enter full name"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<PersonIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="powerform_employee_id"
                                            label="EMPLOYEE ID"
                                            placeholder="Enter employee ID"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<BadgeIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="powerform_email"
                                            label="EMAIL"
                                            placeholder="Enter employee email"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<EmailIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="powerform_company_number"
                                            label="COMPANY MOBILE NUMBER"
                                            placeholder="Enter company mobile number"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<PhoneAndroidIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12}} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="powerform_imei"
                                            label="IMEI"
                                            placeholder="You can find it by dialing *#06# on your phone's keypad"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<PhoneAndroidIcon />}
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* CONDITIONAL POWERFORM ADDITIONAL NEW STORE FIELDS */}
                            {showPowerFormAdditionalNewStoreFields && (
                                <>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="powerform_store_code"
                                            label="STORE CODE"
                                            placeholder="Enter store code"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<QrCode2Icon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="powerform_store_name"
                                            label="STORE NAME"
                                            placeholder="Enter store name"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<StorefrontIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="powerform_store_address"
                                            label="STORE ADDRESS"
                                            placeholder="Enter store address"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<LocationOnIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="powerform_store_ownership"
                                            label="OWNERSHIP"
                                            placeholder="Enter ownership"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<BadgeIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="powerform_store_type"
                                            label="STORE TYPE"
                                            placeholder="Enter store type"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<TagIcon />}
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* CONDITIONAL ACCOUNT LOCKED FIELDS */}
                            {showAccountLockedFields && (
                                <>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="powerform_email"
                                            label="USERNAME / EMAIL"
                                            placeholder="Enter username or email"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<EmailIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="powerform_company_number"
                                            label="COMPANY PHONE NUMBER"
                                            placeholder="Enter company phone number"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<PhoneAndroidIcon />}
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* CONDITIONAL SERVICE LOGS FIELDS */}
                            {showServiceLogsFields && (
                                <>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="service_logs_mobile_no"
                                            label="MOBILE NO."
                                            placeholder="Enter mobile number"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<PhoneAndroidIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="service_logs_mobile_model"
                                            label="MOBILE MODEL"
                                            placeholder="Enter mobile model or dial *#1234#"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<DevicesIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="service_logs_mobile_serial_no"
                                            label="MOBILE SERIAL NO."
                                            placeholder="Enter mobile serial number or dial *#06#"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<QrCode2Icon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="service_logs_imei"
                                            label="IMEI"
                                            placeholder="You can find it by dialing *#06# on your phone's keypad"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<PhoneAndroidIcon />}
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* CONDITIONAL KNOX CHANGE OWNERSHIP FIELDS */}
                            {showKnoxChangeOwnershipFields && (
                                <>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="knox_full_name"
                                            label="FULL NAME"
                                            placeholder="Enter full name"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<PersonIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="knox_employee_id"
                                            label="EMPLOYEE ID"
                                            placeholder="Enter employee ID"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<BadgeIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="knox_email"
                                            label="EMAIL"
                                            placeholder="Enter email"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<EmailIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="knox_company_mobile_number"
                                            label="COMPANY MOBILE NUMBER"
                                            placeholder="Enter company mobile number"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<PhoneAndroidIcon />}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12}} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                        <MuiTextField
                                            name="knox_mobile_imei"
                                            label="MOBILE IMEI"
                                            placeholder="Enter mobile IMEI"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            fullWidth
                                            icon={<PhoneAndroidIcon />}
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* TEXT AREA FIELD */}
                            <Grid size={{ xs: 12, sm: 12, md: 12 }} sx={{ mt: isMobile ? 0 : -0.5 }}>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <MuiTextField
                                            {...field}
                                            control={control}
                                            label="REPORT DESCRIPTION"
                                            placeholder="Please provide a detailed report description..."
                                            fullWidth
                                            multiline
                                            maxRows={10}
                                            minRows={2}
                                            rows={Math.min(Math.max((field.value?.split('\n').length || 2), 2), 10)}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            icon={<DescriptionIcon />}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* UPLOAD FILE */}
                            <Grid size={{ xs: 12 }} sx={{ my: isMobile ? 1.2 : 0 }}>
                                <Controller
                                    name="attachment"
                                    control={control}
                                    render={({ field }) => (
                                        <FileUploadField
                                            {...field}
                                            name="attachment"
                                            label="UPLOAD IMAGE (Optional)"
                                            control={control}
                                            errors={errors}
                                            disabled={ticketIsPending}
                                            inputRef={React.useRef<HTMLInputElement>(null)}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </form>
                )}
            </DialogContent>
            <DialogActions
                sx={{ px: { xs: 3, sm: 9 }, justifyContent: "flex-end" }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Button
                        variant="text"
                        color="primary"
                        onClick={() => {
                            resetForm();
                            setServiceCenter(null);
                            setSystem(null);
                        }}
                        disabled={ticketIsPending || isPendingPriorities || isPendingServiceCenters || isPendingSystems}
                        sx={{
                            textTransform: "none",
                            fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                            py: { xs: 0.375, sm: 0.75 },
                            px: { xs: 1, sm: 1.5 },
                            minHeight: { xs: 32, sm: 36 },
                        }}
                    >
                        Clear form
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmit(submitForm)()}
                        disabled={ticketIsPending || isPendingPriorities || isPendingServiceCenters || isPendingSystems}
                        endIcon={
                            ticketIsPending ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : (
                                <SendIcon fontSize="small" />
                            )
                        }
                        sx={{
                            textTransform: "uppercase",
                            fontWeight: 600,
                            fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                            py: { xs: 0.375, sm: 0.75 },
                            px: { xs: 1.5, sm: 2 },
                            minHeight: { xs: 32, sm: 36 },
                            "& .MuiButton-endIcon svg": {
                                fontSize: { xs: 18, sm: 20 },
                            },
                        }}
                    >
                        {ticketIsPending ? "SUBMITTING..." : "SUBMIT"}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default CreateTicketDialog; 
