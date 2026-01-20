import { GridColDef } from "@mui/x-data-grid";
import { Box } from '@mui/material';
import AvatarClient from "@/Components/Mui/AvatarClient";

// MUI ICONS
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// CLOSED TICKET COMPONENTS
import StatusChip from "@/Pages/Tickets/TicketComponents/StatusChip";
import DeletedByUserChip from "@/Pages/Tickets/TicketComponents/DeletedByUserChip";
import AssignedUserChip from "@/Pages/Tickets/TicketComponents/AssignedUserChip";
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
                fsr_no={params.row.fsr_no}
                store_code={params.row.store_code}
                store_name={params.row.store_name}
                address={params.row.store_address}
                powerform_full_name={params.row.powerform_full_name}
                powerform_employee_id={params.row.powerform_employee_id}
                powerform_email={params.row.powerform_email}
                powerform_company_number={params.row.powerform_company_number}
                powerform_imei={params.row.powerform_imei}
                service_logs_mobile_no={params.row.service_logs_mobile_no}
                service_logs_mobile_model={params.row.service_logs_mobile_model}
                service_logs_mobile_serial_no={params.row.service_logs_mobile_serial_no}
                service_logs_imei={params.row.service_logs_imei}
                knox_full_name={params.row.knox_full_name}
                knox_employee_id={params.row.knox_employee_id}
                knox_email={params.row.knox_email}
                knox_company_mobile_number={params.row.knox_company_mobile_number}
                knox_mobile_imei={params.row.knox_mobile_imei}
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