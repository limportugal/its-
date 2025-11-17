import { Controller, useWatch } from "react-hook-form";
import React, { useMemo } from "react";

// MUI COMPONENTS
import { Typography, Grid, Dialog, DialogContent, DialogActions, Checkbox, Box, Chip, TextField } from "@mui/material";
import MuiTextField from "@/Components/Mui/MuiTextField";
import DialogTitle from "@/Components/Mui/DialogTitle";
import SubmitButton from "@/Components/Mui/SubmitButton";
import ClearButton from "@/Components/Mui/ClearButton";
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

// CREATE TICKET COMPONENTS
import FileUploadField from "@/Pages/Tickets/TicketComponents/FileUploadField";
import PriorityChip from "@/Pages/Tickets/TicketComponents/PriorityChip";
import AutoComplete from "@/Components/Mui/AutoComplete";

// SKELETON COMPONENT
import CreateTicketSkeleton from "@/Pages/Tickets/Skeletons/CreateTicketSkeleton";

// RECAPTCHA
import ReCaptcha from "@/Pages/Tickets/TicketComponents/ReCaptcha";

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
    recaptchaRef,
    recaptchaSiteKey,
    onRecaptchaChange,
    onRecaptchaError,
    onRecaptchaExpired,
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
                title="CREATE A NEW TICKET"
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
                            spacing={{ xs: 0, sm: 2 }}
                            sx={{
                                px: { xs: 0, sm: 6 },
                                py: { xs: 0, sm: 0 }
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
                                                getOptionLabel={(option) =>
                                                    typeof option === 'string' ? option : option.label
                                                }
                                                isOptionEqualToValue={(option, value) => {
                                                    if (!option || !value) return false;
                                                    return option.value === value.value;
                                                }}
                                                icon={<ReportIcon />}
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
                                                placeholder="Select a problem category"
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
                                            minRows={isMobile ? 5 : 2}
                                            rows={Math.min(Math.max((field.value?.split('\n').length || (isMobile ? 5 : 2)), (isMobile ? 5 : 2)), 10)}
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

                        {/* INVISIBLE RECAPTCHA */}
                        <Box sx={{
                            position: 'fixed',
                            bottom: 16,
                            right: 16,
                            zIndex: 1000
                        }}>
                            <ReCaptcha
                                ref={recaptchaRef}
                                siteKey={recaptchaSiteKey}
                                onChange={onRecaptchaChange}
                                onExpired={onRecaptchaExpired}
                                onError={onRecaptchaError}
                                theme="light"
                                size="invisible"
                            />
                        </Box>
                    </form>
                )}
            </DialogContent>
            <DialogActions
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "center",
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: { xs: 2, sm: 0 },
                    my: 1,
                    px: { xs: 3, sm: 9 }
                }}
            >
                <Box sx={{
                    display: 'flex',
                    gap: '8px',
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    <ClearButton
                        fullWidth={isMobile}
                        onClick={() => {
                            resetForm();
                            // Also reset locally controlled Autocomplete states
                            setServiceCenter(null);
                            setSystem(null);
                        }}
                        disabled={ticketIsPending || isPendingPriorities || isPendingServiceCenters || isPendingSystems}
                    />
                    <SubmitButton
                        fullWidth={isMobile}
                        onClick={() => handleSubmit(submitForm)()}
                        disabled={ticketIsPending || isPendingPriorities || isPendingServiceCenters || isPendingSystems}
                        loading={ticketIsPending}
                    />
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default CreateTicketDialog; 