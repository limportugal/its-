import { GridColDef } from "@mui/x-data-grid";
import { Box } from '@mui/material';
import AvatarClient from "@/Components/Mui/AvatarClient";

// MUI ICONS
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// CLOSED TICKET COMPONENTS
import StatusChip from "@/Pages/Tickets/TicketComponents/StatusChip";
import UserInfoTooltip from "@/Pages/Tickets/Columns/Tooltips/UserInfoTooltip";
import DescriptionTooltip from "@/Pages/Tickets/Columns/Tooltips/DescriptionTooltip";

// UTILS
import { decodeHtmlEntities } from "@/Reuseable/utils/decodeHtmlEntities";
import CancelledByChip from "@/Pages/Tickets/TicketComponents/CancelledByChip";
import { timeAgo } from "@/Reuseable/utils/timeAgo";

// TYPES
import { CancelledTicketsResponse } from "@/Reuseable/types/ticket/cancelled-tickets.types";


//  CLOSED TICKET DATA GRID COLUMNS
const CancelledTicketsColumns: GridColDef<CancelledTicketsResponse>[] = [

    {
        field: "cancelled_at",
        headerName: "CANCELLED ON",
        minWidth: 200,
        flex: 1,
        filterable: true,
        renderCell: (params) => (
            <Box display="flex" alignItems="center" gap={1} height="100%">
                <CalendarTodayIcon color="primary" />
                <span>{timeAgo(params.row.cancelled_at)}</span>
            </Box>
        ),
    },
    {
        field: "cancelled_by",
        headerName: "CANCELLED BY",
        minWidth: 230,
        flex: 1,
        filterable: true,
        sortable: true,
        disableColumnMenu: false,
        renderCell: ({ row }) => {
            return <CancelledByChip row={row} />;
        }
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
                            fullName={decodeHtmlEntities(params.row.full_name)}
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
        minWidth: 150,
        flex: 1,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <DescriptionTooltip 
                description={params.value} 
                system={params.row.system?.system_name}
                categories={params.row.categories} 
            />
        ),
    },
    {
        field: "ticket_number",
        headerName: "TICKET NUMBER",
        minWidth: 200,
        flex: 1,
        headerAlign: "center",
        align: "center",
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <StatusChip
                label={params.value}
                status={params.row.status}
                isTicketNumber={true}
            />
        ),
    },
    {
        field: "status",
        headerName: "STATUS",
        minWidth: 150,
        flex: 1,
        headerAlign: "center",
        align: "center",
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <StatusChip
                label={params.value}
                status={params.row.status}
            />
        ),
    },
];

export default CancelledTicketsColumns; 