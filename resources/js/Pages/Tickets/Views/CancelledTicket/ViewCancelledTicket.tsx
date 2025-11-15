import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import "@css/disabled-textfield.css";
import React, { useState } from "react";

// MUI COMPONENTS
import { useTheme, useMediaQuery, Typography, Box, Paper, Tooltip, Fade, Zoom } from "@mui/material";
import { blue } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

// MUI ICONS
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DevicesIcon from '@mui/icons-material/Devices';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import StoreIcon from '@mui/icons-material/Store';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

// TAB ICONS
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';

// HOOKS, API, TYPES & UTILS, VALIDATION
import { DetailField } from "@/Reuseable/types/ticketTypes";
import { formatDate } from "@/Reuseable/utils/formatDate";
import { decodeHtmlEntities } from "@/Reuseable/utils/decodeHtmlEntities";

// TICKET COMPONENTS
import IndexUserLogsByTicketNumber from "@/Pages/UserLogs/IndexUserLogsByTicketNumber";
import ReOpenTicket from "@/Pages/Tickets/ReOpenTicket";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import { ViewPendingTicketResponse } from "@/Reuseable/types/ticket/view-pending-ticket.types";
import { fetchViewCancelledTicketData } from "@/Reuseable/api/ticket/view-cancelled-ticket.api";
import ViewPendingTicketSkeleton from "@/Pages/Tickets/Skeletons/ViewPendingTicketSkeleton";
import AvatarUser from "@/Components/Mui/AvatarUser";
import AvatarClient from "@/Components/Mui/AvatarClient";
import { timeAgo } from "@/Reuseable/utils/timeAgo";

// LOCAL COMPONENTS
import TicketDetailsSection from "@/Pages/Tickets/Views/CancelledTicket/TicketDetailsSection";
import FollowUpDetailsSection from "@/Pages/Tickets/Views/CancelledTicket/FollowUpDetailsSection";
import ResubmissionDetailsSection from "@/Pages/Tickets/Views/CancelledTicket/ResubmissionDetailsSection";
import AssignedDetailsSection from "@/Pages/Tickets/Views/CancelledTicket/AssignedDetailsSection";
import ReturnedDetailsSection from "@/Pages/Tickets/Views/CancelledTicket/ReturnedDetailsSection";
import ClosedDetailsSection from "@/Pages/Tickets/Views/CancelledTicket/ClosedDetailsSection";
import ReopenedDetailsSection from "@/Pages/Tickets/Views/CancelledTicket/ReopenedDetailsSection";
import CancelledDetailsSection from "@/Pages/Tickets/Views/CancelledTicket/CancelledDetailsSection";
import ReminderDetailSection from "@/Pages/Tickets/Views/CancelledTicket/ReminderDetailSection";
import AttachmentViewer from "@/Pages/Tickets/Views/CancelledTicket/AttachmentViewer";

// VIEW CANCELLED TICKET COMPONENT
const ViewCancelledTicket: React.FC<{ userRoles: string[], uuid: string }> = ({ userRoles, uuid }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // STATE HOOKS
    const [openReopenTicketDialog, setOpenReopenTicketDialog] = useState(false);
    const [value, setValue] = useState('1');
    const [activeAttachment, setActiveAttachment] = useState<{ url: string; name: string | null }>({
        url: "",
        name: null
    });

    // HANDLE RE-OPEN TICKET
    const handleReopenTicket = () => {
        if (!currentTicket) {
            return;
        }
        setOpenReopenTicketDialog(true);
    };

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    // FETCHING DATA
    const {
        data: viewCancelledTicketData,
        isPending: isPendingViewCancelledTicket,
        isError: isErroViewCancelledTicket,
    } = useDynamicQuery<ViewPendingTicketResponse>(
        ["getViewCancelledTicketData", uuid],
        () => fetchViewCancelledTicketData(uuid)
    );

    // EFFECT TO SET ACTIVE ATTACHMENT WHEN DATA CHANGES
    React.useEffect(() => {
        if (!viewCancelledTicketData) return;

        // GET ATTACHMENT DATA
        const originalAttachment = viewCancelledTicketData.attachments?.find(
            (attachment) =>
                attachment.category === "CREATED TICKET ATTACHMENT" &&
                attachment.user_id === null,
        );
        const originalFileName = originalAttachment
            ? originalAttachment.file_path
            : null;

        let resubmittedFileName: string | null = null;
        if (
            viewCancelledTicketData.resubmission_reasons &&
            viewCancelledTicketData.resubmission_reasons.length > 0
        ) {
            const latestResubmission =
                viewCancelledTicketData.resubmission_reasons[
                    viewCancelledTicketData.resubmission_reasons.length - 1
                ];
            if (
                latestResubmission.attachments &&
                latestResubmission.attachments.length > 0
            ) {
                resubmittedFileName = latestResubmission.attachments[0].file_path;
            }
        }

        // Construct URLs
        const baseUrl = window.location.origin;
        const constructAttachmentUrl = (filePath: string) => {
            if (!filePath) return "";
            const pathParts = filePath.split('/');
            if (pathParts.length >= 4 && pathParts[0] === 'attachments') {
                const year = pathParts[1];
                const month = pathParts[2];
                const date = pathParts[3];
                const filename = pathParts[4];
                return `${baseUrl}/attachments/${year}/${month}/${date}/${filename}`;
            } else {
                return `${baseUrl}/${encodeURIComponent(filePath)}`;
            }
        };

        const originalPdfUrl = originalFileName
            ? constructAttachmentUrl(originalFileName)
            : "";
        const resubmittedPdfUrl = resubmittedFileName
            ? constructAttachmentUrl(resubmittedFileName)
            : "";

        // Set active attachment - prioritize resubmitted if available
        if (resubmittedPdfUrl && resubmittedFileName) {
            setActiveAttachment({
                url: resubmittedPdfUrl,
                name: resubmittedFileName,
            });
        } else if (originalPdfUrl && originalFileName) {
            setActiveAttachment({ url: originalPdfUrl, name: originalFileName });
        } else {
            setActiveAttachment({ url: "", name: null });
        }
    }, [viewCancelledTicketData]);

    // ERROR STATE
    if (isErroViewCancelledTicket) {
        fetchingErrorAlert();
        return null;
    }

    // LOADING SKELETON
    if (isPendingViewCancelledTicket) {
        return (
            <AuthenticatedLayout header={<Typography variant="h6"></Typography>}>
                <ViewPendingTicketSkeleton />
            </AuthenticatedLayout>
        );
    }

    // TICKET DETAILS - Use fetched data
    const currentTicket = viewCancelledTicketData;

    // CHECK IF THE USER HAS ADMIN ACCESS (Super Admin, Admin, or Manager)
    const hasAdminAccess = userRoles.includes("Super Admin") || userRoles.includes("Admin") || userRoles.includes("Manager");


    // GET THE FILE NAME AND FIX THE URL
    const baseUrl = window.location.origin;
    
    // PRIORITIZE RESUBMISSION ATTACHMENT IF EXISTS, OTHERWISE USE ORIGINAL ATTACHMENT
    const originalAttachment = currentTicket.attachments?.find(
        (attachment) =>
            attachment.category === "CREATED TICKET ATTACHMENT" &&
            attachment.user_id === null,
    );
    const originalFileName = originalAttachment
        ? originalAttachment.file_path
        : null;

    let resubmittedFileName: string | null = null;
    if (
        currentTicket.resubmission_reasons &&
        currentTicket.resubmission_reasons.length > 0
    ) {
        const latestResubmission =
            currentTicket.resubmission_reasons[
                currentTicket.resubmission_reasons.length - 1
            ];
        if (
            latestResubmission.attachments &&
            latestResubmission.attachments.length > 0
        ) {
            resubmittedFileName = latestResubmission.attachments[0].file_path;
        }
    }

    // Construct the correct URL for S3 attachments
    const constructAttachmentUrl = (filePath: string) => {
        if (!filePath) return "";
        const pathParts = filePath.split('/');
        if (pathParts.length >= 4 && pathParts[0] === 'attachments') {
            const year = pathParts[1];
            const month = pathParts[2];
            const date = pathParts[3];
            const filename = pathParts[4];
            return `${baseUrl}/attachments/${year}/${month}/${date}/${filename}`;
        } else {
            return `${baseUrl}/${encodeURIComponent(filePath)}`;
        }
    };
    
    const originalPdfUrl = originalFileName
        ? constructAttachmentUrl(originalFileName)
        : "";
    const resubmittedPdfUrl = resubmittedFileName
        ? constructAttachmentUrl(resubmittedFileName)
        : "";


    // TABLE STYLES - RESPONSIVE DESIGN
    const tableCellHeaderStyle = {
        width: { xs: '50%', sm: '35%' },
        fontWeight: 'bold',
        backgroundColor: alpha(theme.palette.grey[100], 0.8),
        borderBottom: `1px solid ${theme.palette.divider}`,
        fontSize: { xs: '0.65rem', sm: '0.875rem' },
        py: { xs: 0.25, sm: 2, md: 3 },
        px: { xs: 0.5, sm: 1.5, md: 2 }
    };

    const tableCellStyle = {
        borderBottom: `1px solid ${theme.palette.divider}`,
        fontSize: { xs: '0.65rem', sm: '0.875rem' },
        py: { xs: 0.25, sm: 2, md: 3 },
        px: { xs: 0.5, sm: 1.5, md: 2 }
    };

    const ticketDetails: DetailField[] = [
        { label: "DATE REPORTED", value: formatDate(currentTicket.created_at), icon: <CalendarTodayIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} /> },
        { 
            label: "REPORTED BY", 
            value: (
                <AvatarClient
                    fullName={currentTicket.full_name}
                    email={currentTicket.email}
                    serviceCenter={currentTicket.service_center?.service_center_name}
                    avatarSize={{ xs: 48, sm: 68 }}
                />
            ), 
            icon: <PersonOutlineOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} /> 
        },
        {
            label: "SYSTEM",
            value: currentTicket.system?.system_name || "Not specified",
            icon: <DevicesIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
        },
        {
            label: "PROBLEM CATEGORY",
            value:
                currentTicket.categories && currentTicket.categories.length > 0
                    ? currentTicket.categories
                        .map((category) => category.category_name)
                        .join(", ")
                    : "No category Name Provided",
            icon: <ReportGmailerrorredOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
        },
        {
            label: "FSR NO.",
            value: currentTicket.fsr_no || "Not specified",
            icon: <ConfirmationNumberIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
        },
        {
            label: "STORE DETAILS",
            value: currentTicket.store_code || currentTicket.store_name || currentTicket.store_address
                ? (
                    <>
                        {currentTicket.store_code && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Store Code:</strong> {currentTicket.store_code}
                            </Typography>
                        )}
                        {currentTicket.store_name && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Store Name:</strong> {currentTicket.store_name}
                            </Typography>
                        )}
                        {currentTicket.store_address && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' } }}>
                                <strong>Address:</strong> {currentTicket.store_address}
                            </Typography>
                        )}
                    </>
                )
                : "Not specified",
            icon: <StoreIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
        },
        {
            label: "POWER FORM DETAILS",
            value: currentTicket.powerform_full_name ||
                currentTicket.powerform_employee_id ||
                currentTicket.powerform_email ||
                currentTicket.powerform_company_number ||
                currentTicket.powerform_imei ? (
                    <>
                        {currentTicket.powerform_full_name && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Full Name:</strong> {currentTicket.powerform_full_name}
                            </Typography>
                        )}
                        {currentTicket.powerform_employee_id && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Employee ID:</strong> {currentTicket.powerform_employee_id}
                            </Typography>
                        )}
                        {currentTicket.powerform_email && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Email:</strong> {currentTicket.powerform_email}
                            </Typography>
                        )}
                        {currentTicket.powerform_company_number && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Company Mobile Number:</strong> {currentTicket.powerform_company_number}
                            </Typography>
                        )}
                        {currentTicket.powerform_imei && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' } }}>
                                <strong>IMEI:</strong> {currentTicket.powerform_imei}
                            </Typography>
                        )}
                    </>
                ) : "Not specified",
            icon: <BadgeOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
        },
        {
            label: "DESCRIPTION",
            value: currentTicket.description || "",
            multiline: true,
            minRows: 1,
            rows: Math.min(Math.max(currentTicket.description?.split('\n').length || 1, 1), 10),
            icon: <DescriptionOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
        },
    ];

    // FILTER OUT ROWS WITH NO MEANINGFUL DATA
    const filteredTicketDetails = ticketDetails.filter(field => {
        if (typeof field.value === 'string') {
            return field.value && 
                   field.value.trim() !== '' && 
                   field.value !== 'Not specified' && 
                   field.value !== 'No category Name Provided' &&
                   field.value !== 'No Priority Set';
        }
        return field.value; // KEEP NON-STRING VALUES (LIKE StatusChip, PriorityChip)
    });

    // ASSIGNED DETAILS - SHOW IF TICKET WAS ASSIGNED BEFORE BEING CANCELLED
    const assignedDetails: DetailField[] = [];
    if (currentTicket.assigned_user) {
        const assignedUser = currentTicket.assigned_user as any;
        const assignedBy = currentTicket.assigned_by as any;
        
        if (assignedUser?.name && assignedUser.name !== "Not specified") {
            assignedDetails.push({
                label: "ASSIGNED TO",
                value: (
                    <AvatarUser
                        full_name={assignedUser?.name || "Not specified"}
                        avatar_url={assignedUser?.avatar_url || null}
                        role_name={assignedUser?.roles?.length > 0 ? assignedUser?.roles[0].name : "No Role"}
                    />
                ),
                icon: <AssignmentIndIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
            });
        }
        
        if (assignedBy?.name && assignedBy.name !== "Not specified") {
            assignedDetails.push({
                label: "ASSIGNED BY",
                value: (
                    <AvatarUser
                        full_name={assignedBy?.name || "Not specified"}
                        avatar_url={assignedBy?.avatar_url || null}
                        role_name={assignedBy?.roles?.length > 0 ? assignedBy?.roles[0].name : "No Role"}
                    />
                ),
                icon: <PersonAddIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
            });
        }
        
        if ((currentTicket as any).assigned_at) {
            assignedDetails.push({
                label: "ASSIGNED ON",
                value: timeAgo((currentTicket as any).assigned_at),
                icon: <AccessTimeIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
            });
        }
    }

    // RETURNED DETAILS - SHOW IF TICKET WAS RETURNED BEFORE BEING CANCELLED
    const returnedDetails: DetailField[] = [];
    if (currentTicket.returned_by) {
        const returnedBy = currentTicket.returned_by;
        
        if (returnedBy?.name && returnedBy.name !== "Not specified") {
            returnedDetails.push({
                label: "RETURNED BY",
                value: (
                    <AvatarUser
                        full_name={returnedBy?.name || "Not specified"}
                        avatar_url={returnedBy?.avatar_url || null}
                        role_name={returnedBy?.roles?.length > 0 ? returnedBy?.roles[0].name : "No Role"}
                    />
                ),
                icon: <UndoOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
            });
        }
        

        // ADD RETURN REASONS HISTORY - ONLY SHOW IF THERE'S BOTH REASON TEXT AND TIMESTAMP
        if (currentTicket.return_reasons && currentTicket.return_reasons.length > 0) {
            currentTicket.return_reasons.forEach((reason, index) => {
                // ONLY SHOW RETURN REASON ENTRY IF THERE'S BOTH REASON TEXT AND RETURNED_AT TIMESTAMP
                if (reason.reason_text && reason.reason_text !== "Not specified" && reason.returned_at) {
                    returnedDetails.push({
                        label: `RETURN REASON`,
                        value: reason.reason_text,
                        multiline: true,
                        minRows: 1,
                        rows: Math.min(Math.max(reason.reason_text?.split('\n').length || 1, 1), 3),
                        icon: <DescriptionOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                    });
                    
                    returnedDetails.push({
                        label: `RETURNED ON`,
                        value: timeAgo(reason.returned_at),
                        icon: <AccessTimeIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                    });
                }
            });
        }
    }

    // CLOSED DETAILS - SHOW IF TICKET WAS CLOSED BEFORE BEING CANCELLED
    const closedDetails: DetailField[] = [];
    if ((currentTicket as any).closed_by) {
        const closedBy = (currentTicket as any).closed_by;
        
        if (closedBy?.name && closedBy.name !== "Not specified") {
            closedDetails.push({
                label: "CLOSED BY",
                value: (
                    <AvatarUser
                        full_name={closedBy?.name || "Not specified"}
                        avatar_url={closedBy?.avatar_url || null}
                        role_name={closedBy?.roles?.length > 0 ? closedBy?.roles[0].name : "No Role"}
                    />
                ),
                icon: <AssignmentIndIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
            });
        }
        
        // ADD CLOSE REASONS HISTORY - ONLY SHOW IF THERE'S BOTH REASON TEXT AND TIMESTAMP
        if ((currentTicket as any).close_reasons && (currentTicket as any).close_reasons.length > 0) {
            (currentTicket as any).close_reasons.forEach((reason: any, index: number) => {
                // ONLY SHOW CLOSE REASON ENTRY IF THERE'S BOTH REASON TEXT AND CLOSED_AT TIMESTAMP
                if (reason.reason_text && reason.reason_text !== "Not specified" && reason.closed_at) {
                    closedDetails.push({
                        label: `CLOSE REASON`,
                        value: reason.reason_text,
                        multiline: true,
                        minRows: 1,
                        rows: Math.min(Math.max(reason.reason_text?.split('\n').length || 1, 1), 3),
                        icon: <DescriptionOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                    });
                    
                    closedDetails.push({
                        label: `CLOSED ON`,
                        value: timeAgo(reason.closed_at),
                        icon: <AccessTimeIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                    });
                }
            });
        }
    }

    // REOPENED DETAILS - SHOW IF TICKET WAS REOPENED BEFORE BEING CANCELLED
    const reopenedDetails: DetailField[] = [];
    if ((currentTicket as any).reopened_by) {
        const reopenedBy = (currentTicket as any).reopened_by;
        
        if (reopenedBy?.name && reopenedBy.name !== "Not specified") {
            reopenedDetails.push({
                label: "REOPENED BY",
                value: (
                    <AvatarUser
                        full_name={reopenedBy?.name || "Not specified"}
                        avatar_url={reopenedBy?.avatar_url || null}
                        role_name={reopenedBy?.roles?.length > 0 ? reopenedBy?.roles[0].name : "No Role"}
                    />
                ),
                icon: <AutorenewIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
            });
        }
        
        // ADD REOPEN REASONS HISTORY - ONLY SHOW IF THERE'S BOTH REASON TEXT AND TIMESTAMP
        if ((currentTicket as any).reopen_reason && (currentTicket as any).reopen_reason.length > 0) {
            (currentTicket as any).reopen_reason.forEach((reason: any, index: number) => {
                // ONLY SHOW REOPEN REASON ENTRY IF THERE'S BOTH REASON TEXT AND REOPENED_AT TIMESTAMP
                if (reason.reason_text && reason.reason_text !== "Not specified" && reason.reopened_at) {
                    reopenedDetails.push({
                        label: `REOPEN REASON`,
                        value: reason.reason_text,
                        multiline: true,
                        minRows: 1,
                        rows: Math.min(Math.max(reason.reason_text?.split('\n').length || 1, 1), 3),
                        icon: <DescriptionOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                    });
                    
                    reopenedDetails.push({
                        label: `REOPENED ON`,
                        value: timeAgo(reason.reopened_at),
                        icon: <AccessTimeIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                    });
                }
            });
        }
    }

    // CANCELLED DETAILS - SHOW CANCELLATION INFORMATION
    const cancelledDetails: DetailField[] = [];
    if ((currentTicket as any).cancelled_by) {
        const cancelledBy = (currentTicket as any).cancelled_by;
        
        if (cancelledBy?.name && cancelledBy.name !== "Not specified") {
            cancelledDetails.push({
                label: "CANCELLED BY",
                value: (
                    <AvatarUser
                        full_name={cancelledBy?.name || "Not specified"}
                        avatar_url={cancelledBy?.avatar_url || null}
                        role_name={cancelledBy?.roles?.length > 0 ? cancelledBy?.roles[0].name : "No Role"}
                    />
                ),
                icon: <CancelOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
            });
        }
        
        // ADD CANCELLATION REASONS HISTORY - ONLY SHOW IF THERE'S BOTH REASON TEXT AND TIMESTAMP
        if ((currentTicket as any).cancellation_reasons && (currentTicket as any).cancellation_reasons.length > 0) {
            (currentTicket as any).cancellation_reasons.forEach((reason: any, index: number) => {
                // ONLY SHOW CANCELLATION REASON ENTRY IF THERE'S BOTH REASON TEXT AND CANCELLED_AT TIMESTAMP
                if (reason.reason_text && reason.reason_text !== "Not specified" && reason.cancelled_at) {
                    cancelledDetails.push({
                        label: `CANCELLATION REASON`,
                        value: reason.reason_text,
                        multiline: true,
                        minRows: 1,
                        rows: Math.min(Math.max(reason.reason_text?.split('\n').length || 1, 1), 3),
                        icon: <DescriptionOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                    });
                    
                    cancelledDetails.push({
                        label: `CANCELLED ON`,
                        value: timeAgo(reason.cancelled_at),
                        icon: <AccessTimeIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                    });
                }
            });
        }
    }

    // FOLLOW-UP DETAILS - SHOW IF TICKET HAS FOLLOW-UP DATA
    const followUpDetails: DetailField[] = [];
    if (currentTicket.follow_up_reasons && currentTicket.follow_up_reasons.length > 0) {
        currentTicket.follow_up_reasons.forEach((reason, index) => {
            // ONLY SHOW FOLLOW-UP REASON ENTRY IF THERE'S BOTH REASON TEXT AND FOLLOW_UP_AT TIMESTAMP
            if (reason.reason_text && reason.reason_text !== "Not specified" && reason.follow_up_at) {
                followUpDetails.push({
                    label: `FOLLOW-UP REASON`,
                    value: reason.reason_text,
                    multiline: true,
                    minRows: 1,
                    rows: Math.min(Math.max(reason.reason_text?.split('\n').length || 1, 1), 3),
                    icon: <DescriptionOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                });

                followUpDetails.push({
                    label: `FOLLOWED UP ON`,
                    value: timeAgo(reason.follow_up_at),
                    icon: <AccessTimeIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                });
            }
        });
    }

    // REMINDER DETAILS - SHOW IF TICKET HAS REMINDER DATA
    const reminderDetails: DetailField[] = [];
    if (currentTicket.reminder_reasons && currentTicket.reminder_reasons.length > 0) {
        currentTicket.reminder_reasons.forEach((reason, index) => {
            // ONLY SHOW REMINDER REASON ENTRY IF THERE'S BOTH REASON TEXT AND REMINDED_AT TIMESTAMP
            if (reason.reason_text && reason.reason_text !== "Not specified" && reason.reminded_at) {
                reminderDetails.push({
                    label: `REMINDER REASON`,
                    value: reason.reason_text,
                    multiline: true,
                    minRows: 1,
                    rows: Math.min(Math.max(reason.reason_text?.split('\n').length || 1, 1), 3),
                    icon: <DescriptionOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                });

                reminderDetails.push({
                    label: `REMINDED ON`,
                    value: timeAgo(reason.reminded_at),
                    icon: <AccessTimeIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                });
            }
        });
    }

    // RESUBMISSION DETAILS - SHOW IF TICKET HAS RESUBMISSION DATA
    const resubmissionDetails: DetailField[] = [];
    if (currentTicket.resubmission_reasons && currentTicket.resubmission_reasons.length > 0) {
        currentTicket.resubmission_reasons.forEach((reason, index) => {
            // ONLY SHOW RESUBMISSION REASON ENTRY IF THERE'S BOTH REASON TEXT AND RESUBMITTED_AT TIMESTAMP
            if (reason.reason_text && reason.reason_text !== "Not specified" && reason.resubmitted_at) {
                resubmissionDetails.push({
                    label: `RESUBMISSION REASON`,
                    value: reason.reason_text,
                    multiline: true,
                    minRows: 1,
                    rows: Math.min(Math.max(reason.reason_text?.split('\n').length || 1, 1), 3),
                    icon: <DescriptionOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                });

                resubmissionDetails.push({
                    label: `RESUBMITTED ON`,
                    value: timeAgo(reason.resubmitted_at),
                    icon: <AccessTimeIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                });
            }
        });
    }

    // RENDER MAIN COMPONENT
    return (
        <AuthenticatedLayout header={<Typography variant="h6"></Typography>}>
            <Head title="Update Ticket" />
            <Fade in={true} timeout={500}>
                <Box sx={{ mx: { xs: -1, sm: 0 } }}>
                    <Box sx={{
                        mt: { xs: -2, sm: 1 },
                        p: { xs: 0.125, sm: 0.5 },
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: { xs: 'auto', sm: 'hidden' },
                        border: `1px solid ${theme.palette.grey[300]}`,
                        borderRadius: { xs: 1, sm: 2 },
                        backgroundColor: theme.palette.background.default,
                        boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08)`,
                        height: { xs: 'calc(100vh - 40px)', sm: 'calc(100vh - 100px)' },
                        maxHeight: { xs: 'calc(100vh - 40px)', sm: 'calc(100vh - 100px)' },
                        mx: { xs: 0.25, sm: 0 },
                        mb: { xs: 0, sm: 0 }
                    }}>

                        {/* TICKET HEADER CARD */}
                    <Paper
                        elevation={0}
                        sx={{
                            marginBottom: 0,
                            borderRadius: "12px",
                            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            minHeight: 0,
                            height: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                justifyContent: "space-between",
                                alignItems: { xs: "center", sm: "center" },
                                mb: 0,
                                gap: { xs: 2, sm: 0 },
                            }}
                        >
                        </Box>

                            {/* TICKET DETAILS TABS */}
                        <Box sx={{
                            width: '100%',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: { xs: 'auto', sm: 'hidden' },
                            height: '100%'
                        }}>
                            <TabContext value={value}>
                                <Box sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    mb: { xs: 0.25, sm: 0.5 },
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: 'space-between',
                                    alignItems: { xs: 'stretch', sm: 'center' },
                                    py: { xs: 0.25, sm: 0.5 },
                                    minHeight: { xs: 'auto', sm: '48px' },
                                    flexShrink: 0,
                                    gap: { xs: 0.75, sm: 0 }
                                }}>
                                    <TabList
                                        onChange={handleChange}
                                        aria-label="ticket details tabs"
                                        sx={{
                                            flex: { xs: 1, sm: 'none' },
                                            '& .MuiTabs-indicator': {
                                                backgroundColor: theme.palette.primary.main,
                                                height: 3,
                                                borderRadius: '3px 3px 0 0',
                                                mb: { xs: 2, sm: 0 },
                                            },
                                            '& .MuiTab-root': {
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                                                minHeight: { xs: 36, sm: 48 },
                                                transition: 'all 0.2s ease-in-out',
                                                px: { xs: 0.75, sm: 2 },
                                                '&.Mui-selected': {
                                                    color: theme.palette.primary.main,
                                                },
                                            },
                                        }}
                                    >
                                        <Tab
                                            label={isMobile ? "Details" : "Reported Details"}
                                            value="1"
                                            icon={<BadgeOutlinedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                                            iconPosition="start"
                                        />
                                        {/* <Tab
                                            label={isMobile ? "History" : "Ticket Number History"}
                                            value="2"
                                            icon={<WorkHistoryOutlinedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                                            iconPosition="start"
                                        /> */}
                                    </TabList>

                                        {/* ACTION BUTTONS - RESPONSIVE LAYOUT */}
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: { xs: 0.125, sm: 1 },
                                        mt: { xs: -2, sm: 0 },
                                        mb: { xs: 0.5, sm: 1 },
                                        mr: { xs: 0, sm: 1 },
                                        height: { xs: 'auto', sm: '48px' },
                                        justifyContent: { xs: 'space-between', sm: 'flex-end' },
                                        flexShrink: 0,
                                        flexWrap: 'wrap',
                                        px: { xs: 0.5, sm: 0 }
                                    }}>
                                        {hasAdminAccess && currentTicket.status === 'cancelled' && (
                                            <Tooltip title="Re-open ticket" TransitionComponent={Zoom} arrow>
                                                <Box 
                                                    component="div" 
                                                    sx={{ 
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        p: { xs: 0.5, sm: 1 },
                                                        borderRadius: 1,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        color: 'text.secondary',
                                                        backgroundColor: 'action.hover',
                                                        '&:hover': {
                                                            backgroundColor: blue[50],
                                                            transform: 'translateY(-2px)',
                                                            color: 'primary.main',
                                                        },
                                                    }}
                                                    onClick={handleReopenTicket}
                                                >
                                                    <AutorenewIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                                                </Box>
                                            </Tooltip>
                                        )}
                                        <Tooltip title="Back to Cancelled List">
                                            <Link href={route('tickets.indexCancelledTickets')}>
                                                <Box
                                                    component="div"
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        p: { xs: 0.5, sm: 1 },
                                                        borderRadius: 1,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        color: 'text.secondary',
                                                        backgroundColor: 'action.hover',
                                                        '&:hover': {
                                                            backgroundColor: blue[50],
                                                            transform: 'translateY(-2px)',
                                                            color: 'primary.main',
                                                        },
                                                    }}
                                                >
                                                    <ArrowBackIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                                                </Box>
                                            </Link>
                                        </Tooltip>
                                    </Box>
                                </Box>
                                {/* <TabPanel value="2" sx={{
                                    p: 0,
                                    m: 0,
                                    width: '100%',
                                    height: '100%',
                                    '& .MuiDataGrid-root': {
                                        border: 'none',
                                        p: 0,
                                        m: 0
                                    },
                                    '& .MuiPaper-root': {
                                        boxShadow: 'none',
                                        p: 0,
                                        m: 0
                                    }
                                }}>
                                    <IndexUserLogsByTicketNumber ticketNumber={currentTicket.ticket_number} />
                                </TabPanel> */}
                                <TabPanel value="1" sx={{
                                    p: 0,
                                    flex: 1,
                                    overflow: { xs: 'auto', sm: 'hidden' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    pb: { xs: 0, sm: 0 },
                                    mb: { xs: 0, sm: 0 }
                                }}>
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: {
                                                xs: '1fr',
                                                sm: '1fr',
                                                md: '1fr 1fr'
                                            },
                                            gap: { xs: 0.75, sm: 1.5, md: 1.5 },
                                            flex: 1,
                                            overflow: { xs: 'visible', sm: 'hidden' },
                                            minHeight: { xs: 'auto', sm: 0 },
                                            height: { xs: 'auto', sm: '100%' },
                                            px: { xs: 0.25, sm: 0 },
                                            pb: { xs: 0, sm: 0 }
                                        }}
                                    >
                                            {/* LEFT SIDE - TICKET DETAILS AND ASSIGNED DETAILS */}
                                        <Box sx={{
                                            flex: { xs: 'none', md: 1 },
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: { xs: 'auto', md: '100%' },
                                            overflow: { xs: 'visible', md: 'auto' },
                                            gap: { xs: 1, sm: 2 },
                                            minHeight: { xs: 'auto', md: 0 },
                                                mx: { xs: 0.5, sm: 0 },
                                            ml: { xs: 0.5, sm: 1 }
                                        }}>

                                                 {/* REPORTED DETAILS SECTION */}
                                                 <TicketDetailsSection
                                                     ticketDetails={ticketDetails}
                                                     status={currentTicket?.status || 'cancelled'}
                                                     ticketNumber={currentTicket.ticket_number}
                                                     priority={currentTicket.priority}
                                                     tableCellHeaderStyle={tableCellHeaderStyle}
                                                     tableCellStyle={tableCellStyle}
                                                 />

                                                 {/* FOLLOW-UP DETAILS SECTION (ONLY SHOW IF FOLLOWED UP) */}
                                                 <FollowUpDetailsSection
                                                     followUpDetails={followUpDetails}
                                                     status={currentTicket?.status || 'cancelled'}
                                                     tableCellHeaderStyle={tableCellHeaderStyle}
                                                     tableCellStyle={tableCellStyle}
                                                 />

                                                 {/* REMINDER DETAILS SECTION (ONLY SHOW IF REMINDED) */}
                                                 <ReminderDetailSection
                                                     reminderDetails={reminderDetails}
                                                     status={currentTicket?.status || 'cancelled'}
                                                     tableCellHeaderStyle={tableCellHeaderStyle}
                                                     tableCellStyle={tableCellStyle}
                                                 />

                                                 {/* RESUBMISSION DETAILS SECTION (ONLY SHOW IF RESUBMITTED) */}
                                                 <ResubmissionDetailsSection
                                                     resubmissionDetails={resubmissionDetails}
                                                     status={currentTicket?.status || 'cancelled'}
                                                     tableCellHeaderStyle={tableCellHeaderStyle}
                                                     tableCellStyle={tableCellStyle}
                                                 />

                                                 {/* ASSIGNED DETAILS SECTION (ONLY SHOW IF ASSIGNED) */}
                                                <AssignedDetailsSection
                                                    assignedDetails={assignedDetails}
                                                    status={currentTicket?.status || 'cancelled'}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                />

                                                {/* RETURNED DETAILS SECTION (ONLY SHOW IF RETURNED) */}
                                                <ReturnedDetailsSection
                                                    returnedDetails={returnedDetails}
                                                    status={currentTicket?.status || 'cancelled'}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                    attachments={viewCancelledTicketData?.attachments || []}
                                                />

                                                {/* CLOSED DETAILS SECTION (ONLY SHOW IF CLOSED) */}
                                                <ClosedDetailsSection
                                                    closedDetails={closedDetails}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                />

                                                {/* REOPENED DETAILS SECTION (ONLY SHOW IF REOPENED) */}
                                                <ReopenedDetailsSection
                                                    reopenedDetails={reopenedDetails}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                />

                                                {/* CANCELLED DETAILS SECTION (ONLY SHOW IF CANCELLED) */}
                                                <CancelledDetailsSection
                                                    cancelledDetails={cancelledDetails}
                                                    status={currentTicket?.status || 'cancelled'}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                />
                                                    </Box>

                                             {/* RIGHT SIDE - SCREENSHOT */}
                                             <AttachmentViewer
                                                 originalFileName={originalFileName}
                                                 resubmittedFileName={resubmittedFileName}
                                                 originalPdfUrl={originalPdfUrl}
                                                 resubmittedPdfUrl={resubmittedPdfUrl}
                                                 activeAttachment={activeAttachment}
                                                 setActiveAttachment={setActiveAttachment}
                                             />
                                    </Box>
                                </TabPanel>
                            </TabContext>
                        </Box>
                        </Paper>
                    </Box>
                </Box>
            </Fade>

            {/* RE-OPEN TICKET DIALOG */}
            <ReOpenTicket
                open={openReopenTicketDialog}
                onClose={() => setOpenReopenTicketDialog(false)}
                onCancel={() => setOpenReopenTicketDialog(false)}
                ticket={{
                    ...currentTicket,
                    user_roles: userRoles,
                    user_id: currentTicket.id,
                    priority_id: currentTicket.priority?.id || 0,
                } as any}
            />
        </AuthenticatedLayout>
    );
};

export default ViewCancelledTicket;
