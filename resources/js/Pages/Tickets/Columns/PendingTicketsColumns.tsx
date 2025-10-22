import { GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import AvatarClient from "@/Components/Mui/AvatarClient";

// TYPES
import { PendingTicketResponse } from "@/Reuseable/types/ticket/pending-ticket.types";

// CLOSED TICKET COMPONENTS
import StatusChip from "@/Pages/Tickets/TicketComponents/StatusChip";
import PriorityChip from "@/Pages/Tickets/TicketComponents/PriorityChip";
import AssignedUserChip from "@/Pages/Tickets/TicketComponents/AssignedUserChip";
import AssignedByChip from "@/Pages/Tickets/TicketComponents/AssignedByChip";
import ReturnedByChip from "@/Pages/Tickets/TicketComponents/ReturnedByChip";
import UserInfoTooltip from "@/Pages/Tickets/Columns/Tooltips/UserInfoTooltip";
import DescriptionTooltip from "@/Pages/Tickets/Columns/Tooltips/DescriptionTooltip";

// UTILS
import { formatDate } from "@/Reuseable/utils/formatDate";
import { snakeCaseToTitleCase } from "@/Reuseable/utils/capitalize";

// Type for individual ticket row
type PendingTicketRow = PendingTicketResponse['pending_tickets'][0];

// Base columns definition
const basePendingTicketsColumns: GridColDef<PendingTicketRow>[] = [
    {
        field: "created_at",
        headerName: "DATE CREATED",
        minWidth: 220,
        filterable: true,
        renderCell: (params) => (
            <Box display="flex" alignItems="center" gap={1} height="100%">
                <CalendarTodayIcon color="primary" />
                <span>{formatDate(params.row.created_at)}</span>
            </Box>
        ),
    },
    {
        field: "full_name",
        headerName: "REPORTED BY",
        minWidth: 230,
        flex: 1,
        filterable: true,
        renderCell: (params) => {
            return (
                <UserInfoTooltip
                    fullName={params.row.full_name}
                    serviceCenter={params.row.service_center?.service_center_name}
                    email={params.row.email}
                >
                    <Box sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%', cursor: 'pointer' }}>
                        <AvatarClient
                            fullName={params.row.full_name}
                            serviceCenter={params.row.service_center?.service_center_name}
                        />
                    </Box>
                </UserInfoTooltip>
            );
        },
    },
    {
        field: "description",
        headerName: "REPORTED DESCRIPTION",
        flex: 1,
        minWidth: 300,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <DescriptionTooltip 
                description={params.value} 
                system={params.row.system?.system_name}
                categories={params.row.categories}
                fsr_no={params.row.fsr_no}
                store_code={params.row.store_code}
                store_name={params.row.store_name}
                address={params.row.store_address}
            />
        ),
    },
    {
        field: "priority",
        headerName: "PRIORITY",
        width: 160,
        headerAlign: "center",
        align: "center",
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
            const priority = params.row.priority;
            const priorityName = priority?.priority_name || "Not Priority";
            return <PriorityChip label={priorityName} priority={priorityName?.toLowerCase()} />;
        },
    },
    {
        field: "categories",
        headerName: "PROBLEM CATEGORIES",
        minWidth: 250,
        headerAlign: "center",
        align: "center",
        filterable: true,
        renderCell: (params) => {
            const categories = params.row.categories;
            const categoryNames = categories?.map(cat => cat.category_name).join(', ') || 'No categories';
            return (
                <Box display="flex" alignItems="center" justifyContent="flex-start" gap={1} height="100%" width="100%">
                    <CategoryIcon color="primary" />
                    <Typography
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {categoryNames}
                    </Typography>
                </Box>
            );
        },
    },
    {
        field: "ticket_number",
        headerName: "TICKET NUMBER",
        minWidth: 250,
        headerAlign: "center",
        align: "center",
        filterable: true,
        renderCell: (params) => (
            <StatusChip label={snakeCaseToTitleCase(params.value)} status={params.row.status} />
        ),
    },
    {
        field: "status",
        headerName: "STATUS",
        width: 160,
        headerAlign: "center",
        align: "center",
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <StatusChip label={snakeCaseToTitleCase(params.value)} status={params.row.status} />
        ),
    },
    {
        field: "assigned_user",
        headerName: "ASSIGNED TO",
        flex: 1,
        minWidth: 250,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => {
            return <AssignedUserChip row={row} />;
        }
    },
    {
        field: "assigned_by",
        headerName: "ASSIGNED BY",
        flex: 1,
        minWidth: 250,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => {
            return <AssignedByChip row={row} />;
        }
    },
    {
        field: "returned_by",
        headerName: "RETURNED BY",
        flex: 1,
        minWidth: 250,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => {
            return <ReturnedByChip row={row} />;
        }
    },
];

// Function to get filtered columns based on data
const getPendingTicketsColumns = (data: PendingTicketRow[]): GridColDef<PendingTicketRow>[] => {
    // Check if any ticket has an assigned user
    const hasAssignedUsers = data.some(ticket => ticket.assigned_user);
    
    // Start with all base columns
    let filteredColumns = [...basePendingTicketsColumns];
    
    // Filter out assignment columns if no assigned users
    if (!hasAssignedUsers) {
        filteredColumns = filteredColumns.filter(column =>
            !['assigned_user', 'assigned_by'].includes(column.field)
        );
    }
    
    // Always include returned_by column in toggle options
    // No need to filter it out based on data
    
    return filteredColumns;
};

// Default export for backward compatibility
const PendingTicketsColumns = basePendingTicketsColumns;

export default PendingTicketsColumns;
export { getPendingTicketsColumns }; 