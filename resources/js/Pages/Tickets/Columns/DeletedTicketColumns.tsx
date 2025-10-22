import { GridColDef } from "@mui/x-data-grid";
import { Box } from '@mui/material';
import AvatarClient from "@/Components/Mui/AvatarClient";

// MUI ICONS
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// CLOSED TICKET COMPONENTS
import StatusChip from "@/Pages/Tickets/TicketComponents/StatusChip";
import DeletedByUserChip from "@/Pages/Tickets/TicketComponents/DeletedByUserChip";
import UserInfoTooltip from "@/Pages/Tickets/Columns/Tooltips/UserInfoTooltip";
import DescriptionTooltip from "@/Pages/Tickets/Columns/Tooltips/DescriptionTooltip";

// UTILS, TYPES & CONSTANTS
import { timeAgo } from "@/Reuseable/utils/timeAgo";
import { decodeHtmlEntities } from "@/Reuseable/utils/decodeHtmlEntities";
import { snakeCaseToTitleCase } from "@/Reuseable/utils/capitalize";
import { DeletedTicketRow } from "@/Reuseable/types/ticket/deleted-tickets.types";

const baseDeletedTicketsColumns: GridColDef<DeletedTicketRow>[] = [
    {
        field: "created_at",
        headerName: "DELETED ON",
        minWidth: 180,
        flex: 1,
        filterable: true,
        renderCell: (params) => (
            <Box display="flex" alignItems="center" gap={1} height="100%">
                <CalendarTodayIcon color="primary" />
                <span>{timeAgo(params.row.deleted_at as string)}</span>
            </Box>
        ),
    },
    {
        field: "deleted_by",
        headerName: "DELETED BY",
        flex: 1,
        minWidth: 250,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => {
            return <DeletedByUserChip row={row} />;
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
        flex: 1,
        minWidth: 250,
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
];

const DeletedTicketsColumns = baseDeletedTicketsColumns;
export default DeletedTicketsColumns; 