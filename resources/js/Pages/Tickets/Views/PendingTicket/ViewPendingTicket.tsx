import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import "@css/disabled-textfield.css";
import React, { useEffect } from "react";

// MUI COMPONENTS
import {
    Typography,
    Box,
    useTheme,
    useMediaQuery,
    Paper,
    Fade,
    Tab,
    Tooltip,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import { TabContext, TabList, TabPanel } from "@mui/lab";

// MUI ICONS
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DevicesIcon from '@mui/icons-material/Devices';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import StoreIcon from '@mui/icons-material/Store';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

// TAB ICONS
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';

// HOOKS, API, TYPES & UTILS, VALIDATION
import { DetailField } from "@/Reuseable/types/ticketTypes";
import { formatDate } from "@/Reuseable/utils/formatDate";
import { useAuthUser } from "@/Reuseable/hooks/useAuthUser";
import { decodeHTML } from "@/Reuseable/helpers/decodeHTML";

// TICKET COMPONENTS
import BottomNav from "@/Pages/Tickets/TicketComponents/BottomNav";
import IndexUserLogsByTicketNumber from "@/Pages/UserLogs/IndexUserLogsByTicketNumber";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import { ViewPendingTicketResponse } from "@/Reuseable/types/ticket/view-pending-ticket.types";
import { fetchViewPendingTicketData } from "@/Reuseable/api/ticket/view-pending-ticket.api";
import ViewPendingTicketSkeleton from "@/Pages/Tickets/Skeletons/ViewPendingTicketSkeleton";
import AvatarUser from "@/Components/Mui/AvatarUser";
import AvatarClient from "@/Components/Mui/AvatarClient";
import AvatarGroupWithPopover from "@/Components/Mui/AvatarGroupWithPopover";
import { timeAgo } from "@/Reuseable/utils/timeAgo";

// LOCAL COMPONENTS
import TicketDetailsSection from "@/Pages/Tickets/Views/PendingTicket/TicketDetailsSection";
import FollowUpDetailsSection from "@/Pages/Tickets/Views/PendingTicket/FollowUpDetailsSection";
import ResubmissionDetailsSection from "@/Pages/Tickets/Views/PendingTicket/ResubmissionDetailsSection";
import AssignedDetailsSection from "@/Pages/Tickets/Views/PendingTicket/AssignedDetailsSection";
import ReturnedDetailsSection from "@/Pages/Tickets/Views/PendingTicket/ReturnedDetailsSection";
import ReopenedDetailsSection from "@/Pages/Tickets/Views/PendingTicket/ReopenedDetailsSection";
import ClosedDetailsSection from "@/Pages/Tickets/Views/PendingTicket/ClosedDetailsSection";
import ReminderDetailSection from "@/Pages/Tickets/Views/PendingTicket/ReminderDetailSection";
import AttachmentViewer from "@/Pages/Tickets/Views/PendingTicket/AttachmentViewer";

// ZUSTAND STORE
import { useViewPendingTicketSelectors } from "@/stores/ticket/useViewPendingTicketStore";

// UPDATE TICKET COMPONENT
const ViewPendingTicket: React.FC<{ userRoles: string[], uuid: string }> = ({ userRoles, uuid }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { user: currentUser } = useAuthUser();

    // ZUSTAND STORE HOOKS
    const { open: openReturnDialog, setOpen: setOpenReturnDialog } = useViewPendingTicketSelectors.useReturnDialog();
    const { open: openActionTakenDialog, setOpen: setOpenActionTakenDialog } = useViewPendingTicketSelectors.useActionTakenDialog();
    const { open: openDeleteAlert, setOpen: setOpenDeleteAlert } = useViewPendingTicketSelectors.useDeleteAlert();
    const { open: openCancelTicketDialog, setOpen: setOpenCancelTicketDialog } = useViewPendingTicketSelectors.useCancelTicketDialog();
    const { activeTab: value, setActiveTab: setValue } = useViewPendingTicketSelectors.useTab();
    const { activeAttachment, setActiveAttachment } = useViewPendingTicketSelectors.useAttachment();

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    // FETCHING DATA
    const {
        data: viewPendingTicketData,
        isPending: isPendingViewPendingTicketData,
        isError: isErrorViewPendingTicketData,
    } = useDynamicQuery<ViewPendingTicketResponse>(
        ["getViewPendingTicketData", uuid],
        () => fetchViewPendingTicketData(uuid)
    );

    // EFFECT TO SET ACTIVE ATTACHMENT WHEN DATA CHANGES
    useEffect(() => {
        if (!viewPendingTicketData) return;

        // Get attachment data
        const originalAttachment = viewPendingTicketData.attachments?.find(
            (attachment) =>
                attachment.category === "CREATED TICKET ATTACHMENT" &&
                attachment.user_id === null,
        );
        const originalFileName = originalAttachment
            ? originalAttachment.file_path
            : null;

        let resubmittedFileName: string | null = null;
        if (
            viewPendingTicketData.resubmission_reasons &&
            viewPendingTicketData.resubmission_reasons.length > 0
        ) {
            const latestResubmission =
                viewPendingTicketData.resubmission_reasons[
                viewPendingTicketData.resubmission_reasons.length - 1
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

        // Set active attachment
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
    }, [viewPendingTicketData]);

    // ERROR STATE
    if (isErrorViewPendingTicketData) {
        fetchingErrorAlert();
        return null;
    }

    // Render loading state
    if (isPendingViewPendingTicketData) {
        return (
            <AuthenticatedLayout header={<Typography variant="h6"></Typography>}>
                <ViewPendingTicketSkeleton />
            </AuthenticatedLayout>
        );
    }

    // TICKET DETAILS - Use fetched data
    const currentTicket = viewPendingTicketData;

    // CHECK IF THE USER IS SUPER ADMIN OR ADMIN
    const isSuperAdmin = userRoles.includes("Super Admin");
    const isAdmin = userRoles.includes("Admin");

    const ticketForBottomNav = {
        ...currentTicket,
        uuid: currentTicket.uuid,
        ticket_uuid: currentTicket.uuid,
        user_roles: userRoles,
        user_id: currentTicket.id,
        priority_id: currentTicket.priority?.id || 0,
        action_taken: currentTicket.action_taken || "",
    } as any;

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

        // Parse the S3 path: attachments/2025/09/07/filename.ext
        const pathParts = filePath.split('/');

        if (pathParts.length >= 4 && pathParts[0] === 'attachments') {
            const year = pathParts[1];
            const month = pathParts[2];
            const date = pathParts[3];
            const filename = pathParts[4];
            return `${baseUrl}/attachments/${year}/${month}/${date}/${filename}`;
        } else {
            // Fallback for other file paths
            return `${baseUrl}/${encodeURIComponent(filePath)}`;
        }
    };

    const originalPdfUrl = originalFileName
        ? constructAttachmentUrl(originalFileName)
        : "";
    const resubmittedPdfUrl = resubmittedFileName
        ? constructAttachmentUrl(resubmittedFileName)
        : "";


    // Table styles - Responsive Design
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
        
        ...(currentTicket.categories?.some(c =>
            c.category_name.toLowerCase() === "additional store"
        ) ? [{
            label: "CLIENT NAME",
            value: currentTicket.client_name || "No Client Name Provided",
            icon: <ReportGmailerrorredOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
        }] as DetailField[] : []),

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
                currentTicket.powerform_imei ||
                currentTicket.powerform_store_code ||
                currentTicket.powerform_store_name ||
                currentTicket.powerform_store_address ||
                currentTicket.powerform_store_ownership ||
                currentTicket.powerform_store_type ? (
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
                        {currentTicket.powerform_store_code && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Store Code:</strong> {currentTicket.powerform_store_code}
                            </Typography>
                        )}
                        {currentTicket.powerform_store_name && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Store Name:</strong> {currentTicket.powerform_store_name}
                            </Typography>
                        )}
                        {currentTicket.powerform_store_address && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Store Address:</strong> {currentTicket.powerform_store_address}
                            </Typography>
                        )}
                        {currentTicket.powerform_store_ownership && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Ownership:</strong> {currentTicket.powerform_store_ownership}
                            </Typography>
                        )}
                        {currentTicket.powerform_store_type && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' } }}>
                                <strong>Store Type:</strong> {currentTicket.powerform_store_type}
                            </Typography>
                        )}
                    </>
                ) : "Not specified",
            icon: <BadgeOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
        },
        {
            label: "SERVICE LOGS SYSTEM DETAILS",
            value: currentTicket.service_logs_mobile_no ||
                currentTicket.service_logs_mobile_model ||
                currentTicket.service_logs_mobile_serial_no ||
                currentTicket.service_logs_imei ? (
                    <>
                        {currentTicket.service_logs_mobile_no && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Mobile Number:</strong> {currentTicket.service_logs_mobile_no}
                            </Typography>
                        )}
                        {currentTicket.service_logs_mobile_model && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Mobile Model:</strong> {currentTicket.service_logs_mobile_model}
                            </Typography>
                        )}
                        {currentTicket.service_logs_mobile_serial_no && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Mobile Serial Number:</strong> {currentTicket.service_logs_mobile_serial_no}
                            </Typography>
                        )}
                        {currentTicket.service_logs_imei && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' } }}>
                                <strong>IMEI:</strong> {currentTicket.service_logs_imei}
                            </Typography>
                        )}
                    </>
                ) : "Not specified",
            icon: <PhoneAndroidIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
        },
        {
            label: "KNOX DETAILS",
            value: currentTicket.knox_full_name ||
                currentTicket.knox_employee_id ||
                currentTicket.knox_email ||
                currentTicket.knox_company_mobile_number ||
                currentTicket.knox_mobile_imei ? (
                    <>
                        {currentTicket.knox_full_name && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Full Name:</strong> {currentTicket.knox_full_name}
                            </Typography>
                        )}
                        {currentTicket.knox_employee_id && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Employee ID:</strong> {currentTicket.knox_employee_id}
                            </Typography>
                        )}
                        {currentTicket.knox_email && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Email:</strong> {currentTicket.knox_email}
                            </Typography>
                        )}
                        {currentTicket.knox_company_mobile_number && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' }, mb: 0.5 }}>
                                <strong>Company Mobile Number:</strong> {currentTicket.knox_company_mobile_number}
                            </Typography>
                        )}
                        {currentTicket.knox_mobile_imei && (
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' } }}>
                                <strong>Mobile IMEI:</strong> {currentTicket.knox_mobile_imei}
                            </Typography>
                        )}
                    </>
                ) : "Not specified",
            icon: <DevicesIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
        },
        {
            label: "DESCRIPTION",
            value: decodeHTML(currentTicket.description || ""),
            multiline: true,
            minRows: 1,
            rows: Math.min(Math.max(currentTicket.description?.split('\n').length || 1, 1), 10),
            icon: <DescriptionOutlinedIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
        },
    ];


    // Filter out rows with no meaningful data
    const filteredTicketDetails = ticketDetails.filter(field => {
        if (typeof field.value === 'string') {
            return field.value &&
                field.value.trim() !== '' &&
                field.value !== 'Not specified' &&
                field.value !== 'No category Name Provided' &&
                field.value !== 'No Priority Set';
        }
        return field.value; // Keep non-string values (like StatusChip, PriorityChip)
    });

    // ASSIGNED DETAILS - Show if ticket is assigned, returned, resubmitted, reopened, follow-up, or reminder (since reminder tickets may have been previously assigned)
    const assignedDetails: DetailField[] = [];
    if ((currentTicket.status === 'assigned' || currentTicket.status === 'returned' || currentTicket.status === 'resubmitted' || currentTicket.status === 're-open' || currentTicket.status === 'follow-up' || currentTicket.status === 'reminder') && currentTicket.assigned_user) {
        const assignedUser = currentTicket.assigned_user as any;
        const assignedBy = currentTicket.assigned_by as any;

        // Show all assigned users in a consolidated avatar group
        if (currentTicket.assign_to_users && currentTicket.assign_to_users.length > 0) {
            let assignedUsers: any[] = currentTicket.assign_to_users
                ?.filter((assignment) => assignment?.user?.name) // Filter out assignments without valid users
                ?.map((assignment) => assignment.user) // Extract user objects
                ?.filter(Boolean) || []; // Remove any undefined values

            // Sort users so current logged-in user comes first, then primary user, then others
            if (assignedUsers.length > 0) {
                assignedUsers = assignedUsers.sort((a, b) => {
                    // Current user should always be first
                    if (currentUser && a.id === currentUser.id) return -1;
                    if (currentUser && b.id === currentUser.id) return 1;

                    // Then primary user comes next
                    if (assignedUser && a.id === assignedUser.id) return -1;
                    if (assignedUser && b.id === assignedUser.id) return 1;

                    return 0;
                });
            }

            if (assignedUsers.length > 0) {
                if (assignedUsers.length === 1) {
                    // Single user - display AvatarUser with name, service center, and role
                    const singleUser = assignedUsers[0];
                    assignedDetails.push({
                        label: "ASSIGNED TO",
                        value: (
                            <AvatarUser
                                full_name={singleUser?.name || "Not specified"}
                                avatar_url={singleUser?.avatar_url || null}
                                role_name={singleUser?.roles?.length > 0 ? singleUser?.roles[0].name : "No Role"}
                            />
                        ),
                        icon: <AssignmentIndIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                    });
                } else {
                    // Multiple users - display AvatarGroupWithPopover
                    assignedDetails.push({
                        label: "ASSIGNED TO",
                        value: (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <AvatarGroupWithPopover
                                    users={assignedUsers}
                                    max={3}
                                />
                            </Box>
                        ),
                        icon: <AssignmentIndIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                    });
                }
            }
        } else if (assignedUser?.name && assignedUser.name !== "Not specified") {
            // Fallback to single user display if no assign_to_users data
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

        // Show all assigners in a consolidated display
        if (currentTicket.assignment_history && currentTicket.assignment_history.length > 0) {
            let assigners: any[] = currentTicket.assignment_history
                ?.filter((assignment) => assignment?.assigned_by?.name) // Filter out assignments without valid users
                ?.map((assignment) => assignment.assigned_by) // Extract assigned_by user objects
                ?.filter(Boolean) || []; // Remove any undefined values

            // Remove duplicates based on user ID and keep unique assigners
            const uniqueAssigners = assigners.reduce((acc: any[], current: any) => {
                const existingIndex = acc.findIndex((user: any) => user.id === current.id);
                if (existingIndex === -1) {
                    acc.push(current);
                }
                return acc;
            }, []);

            // Sort assigners so current logged-in user comes first
            if (uniqueAssigners.length > 0) {
                uniqueAssigners.sort((a: any, b: any) => {
                    // Current user should always be first
                    if (currentUser && a.id === currentUser.id) return -1;
                    if (currentUser && b.id === currentUser.id) return 1;
                    return 0;
                });
            }

            if (uniqueAssigners.length > 0) {
                if (uniqueAssigners.length === 1) {
                    // Single assigner - display AvatarUser
                    const singleAssigner = uniqueAssigners[0];
                    assignedDetails.push({
                        label: "ASSIGNED BY",
                        value: (
                            <AvatarUser
                                full_name={singleAssigner?.name || "Not specified"}
                                avatar_url={singleAssigner?.avatar_url || null}
                                role_name={singleAssigner?.roles?.length > 0 ? singleAssigner?.roles[0].name : "No Role"}
                            />
                        ),
                        icon: <PersonAddIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                    });
                } else {
                    // Multiple assigners - display AvatarGroupWithPopover
                    assignedDetails.push({
                        label: "ASSIGNED BY",
                        value: (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <AvatarGroupWithPopover
                                    users={uniqueAssigners}
                                    max={3}
                                    label="Assigned By"
                                />
                            </Box>
                        ),
                        icon: <PersonAddIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                    });
                }
            }
        } else if (assignedBy?.name && assignedBy.name !== "Not specified") {
            // Fallback to single assigner display if no assignment_history data
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

    // RETURNED DETAILS - Show if ticket is returned, resubmitted, reopened, follow-up, or reminder (since reminder tickets may have been previously returned)
    const returnedDetails: DetailField[] = [];
    if ((currentTicket.status === 'returned' || currentTicket.status === 'resubmitted' || currentTicket.status === 're-open' || currentTicket.status === 'follow-up' || currentTicket.status === 'reminder') && currentTicket.returned_by) {
        const returnedBy = currentTicket.returned_by;

        // Only add if we have meaningful data
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


        // Add return reasons history - only show if there's both reason text and timestamp
        if (currentTicket.return_reasons && currentTicket.return_reasons.length > 0) {
            currentTicket.return_reasons.forEach((reason, index) => {
                // Only show return reason entry if there's both reason text and returned_at timestamp
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

    // REOPENED DETAILS - Show if ticket is reopened, follow-up, or reminder (since reminder tickets may have been previously reopened)
    const reopenedDetails: DetailField[] = [];
    if ((currentTicket.status === 're-open' || currentTicket.status === 'follow-up' || currentTicket.status === 'reminder') && currentTicket.reopened_by) {
        const reopenedBy = currentTicket.reopened_by;

        // Only add if we have meaningful data
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
                icon: <RefreshIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
            });
        }


        // Add reopen reasons history - only show if there's both reason text and timestamp
        if (currentTicket.reopen_reason && currentTicket.reopen_reason.length > 0) {
            currentTicket.reopen_reason.forEach((reason, index) => {
                // Only show reopen reason entry if there's both reason text and reopened_at timestamp
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


    // CLOSED DETAILS - Show if ticket has closed data (regardless of current status)
    const closedDetails: DetailField[] = [];
    if (currentTicket.closed_by) {
        const closedBy = currentTicket.closed_by;

        // Only add if we have meaningful data
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

        // Add close reasons history - only show if there's both reason text and timestamp
        if (currentTicket.close_reasons && currentTicket.close_reasons.length > 0) {
            currentTicket.close_reasons.forEach((reason, index) => {
                // Only show close reason entry if there's both reason text and closed_at timestamp
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

    // FOLLOW-UP DETAILS - Show if ticket has follow-up data
    const followUpDetails: DetailField[] = [];
    if (currentTicket.follow_up_reasons && currentTicket.follow_up_reasons.length > 0) {
        currentTicket.follow_up_reasons.forEach((reason, index) => {
            // Only show follow-up reason entry if there's both reason text and follow_up_at timestamp
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

    // REMINDER DETAILS - Show if ticket has reminder data
    const reminderDetails: DetailField[] = [];
    if (currentTicket.reminder_reasons && currentTicket.reminder_reasons.length > 0) {
        currentTicket.reminder_reasons.forEach((reason, index) => {
            // Only show reminder reason entry if there's both reason text and reminded_at timestamp
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

    // RESUBMISSION DETAILS - Show if ticket has resubmission data
    const resubmissionDetails: DetailField[] = [];
    if (currentTicket.resubmission_reasons && currentTicket.resubmission_reasons.length > 0) {
        currentTicket.resubmission_reasons.forEach((reason, index) => {
            // Only show resubmission reason entry if there's both reason text and resubmitted_at timestamp
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
                        {/* Ticket Header Card */}
                        <Paper
                            elevation={0}
                            sx={{
                                marginBottom: 0,
                                borderRadius: { xs: "8px", sm: "12px" },
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: { xs: 'auto', sm: 'hidden' },
                                minHeight: 0,
                                height: '100%',
                                pb: { xs: 0, sm: 0 }
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
                                {/* Removed TICKET DETAILS header and priority chip - now empty */}
                            </Box>

                            {/* Removed divider */}

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

                                        {/* Action buttons - responsive layout */}
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
                                            <BottomNav
                                                open={openReturnDialog}
                                                onClose={() => setOpenReturnDialog(false)}
                                                selectedTicket={ticketForBottomNav}
                                                openActionTakenDialog={openActionTakenDialog}
                                                onOpenActionTakenDialog={() => setOpenActionTakenDialog(true)}
                                                onCloseTicket={() => { }}
                                                onOpenReturnDialog={() => setOpenReturnDialog(true)}
                                                openCancelTicketDialog={openCancelTicketDialog}
                                                setOpenCancelTicketDialog={setOpenCancelTicketDialog}
                                                openDeleteAlert={openDeleteAlert}
                                                setOpenDeleteAlert={setOpenDeleteAlert}
                                                isAdmin={isSuperAdmin || isAdmin}
                                                showDeleteIcon={isSuperAdmin}
                                            />
                                            <Tooltip title="Back to Pending List">
                                                <Link href={route('tickets.indexPendingTickets')}>
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
                                            {/* Left side - Ticket Details and Assigned Details */}
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
                                                {/* Reported Details Section */}
                                                <TicketDetailsSection
                                                    ticketDetails={filteredTicketDetails}
                                                    status={currentTicket?.status || 're-open'}
                                                    ticketNumber={currentTicket.ticket_number}
                                                    priority={currentTicket.priority}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                />


                                                {/* Follow-up Details Section */}
                                                <FollowUpDetailsSection
                                                    followUpDetails={followUpDetails}
                                                    status={currentTicket?.status || 're-open'}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                />

                                                {/* Reminder Details Section */}
                                                <ReminderDetailSection
                                                    reminderDetails={reminderDetails}
                                                    status={currentTicket?.status || 're-open'}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                />

                                                {/* Resubmission Details Section */}
                                                <ResubmissionDetailsSection
                                                    resubmissionDetails={resubmissionDetails}
                                                    status={currentTicket?.status || 're-open'}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                />

                                                {/* Assigned Details Section */}
                                                <AssignedDetailsSection
                                                    assignedDetails={assignedDetails}
                                                    status={currentTicket?.status || 're-open'}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                />

                                                {/* Returned Details Section */}
                                                <ReturnedDetailsSection
                                                    returnedDetails={returnedDetails}
                                                    status={currentTicket?.status || 're-open'}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                    attachments={viewPendingTicketData?.attachments || []}
                                                />

                                                {/* Re-opened Details Section */}
                                                <ReopenedDetailsSection
                                                    reopenedDetails={reopenedDetails}
                                                    status={currentTicket?.status || 're-open'}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                />


                                                {/* Closed Details Section */}
                                                <ClosedDetailsSection
                                                    closedDetails={closedDetails}
                                                    tableCellHeaderStyle={tableCellHeaderStyle}
                                                    tableCellStyle={tableCellStyle}
                                                    attachments={viewPendingTicketData?.attachments || []}
                                                />
                                            </Box>
                                            {/* Right side - Attachment Viewer */}
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
        </AuthenticatedLayout>
    );
};

export default ViewPendingTicket;
