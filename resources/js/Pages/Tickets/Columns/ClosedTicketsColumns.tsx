import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Box, Tooltip, Typography } from '@mui/material';

// MUI ICONS
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

// AVATAR CLIENT
import AvatarClient from "@/Components/Mui/AvatarClient";

// TICKET COMPONENTS
import StatusChip from "@/Pages/Tickets/TicketComponents/StatusChip";
import DescriptionTooltip from "@/Pages/Tickets/Columns/Tooltips/DescriptionTooltip";
import AssignedUserChip from "@/Pages/Tickets/TicketComponents/AssignedUserChip";
import { timeAgo } from "@/Reuseable/utils/timeAgo";
import { ClosedTicketsResponse } from "@/Reuseable/types/ticket/closed-tickets.types";
import UserAvatar from "@/Components/Mui/AvatarUser";
import { decodeHtmlEntities } from "@/Reuseable/utils/decodeHtmlEntities";
import UserInfoTooltip from "@/Pages/Tickets/Columns/Tooltips/UserInfoTooltip";

// MEMOIZED CELL COMPONENTS FOR PERFORMANCE
const ClosedDateCell = React.memo(({ row }: { row: ClosedTicketsResponse }) => {
    const timeAgoValue = React.useMemo(() => timeAgo(row.closed_at), [row.closed_at]);
    return (
        <Box display="flex" alignItems="center" gap={1} height="100%">
            <AccessTimeOutlinedIcon color="primary" />
            <span>{timeAgoValue}</span>
        </Box>
    );
}, (prevProps, nextProps) => {
    return prevProps.row.closed_at === nextProps.row.closed_at;
});

const ReportedByCell = React.memo(({ row }: { row: ClosedTicketsResponse }) => {
    const decodedName = React.useMemo(() => decodeHtmlEntities(row.full_name), [row.full_name]);
    const serviceCenter = React.useMemo(() => row.service_center?.service_center_name, [row.service_center]);
    
    return (
        <UserInfoTooltip
            fullName={row.full_name}
            serviceCenter={serviceCenter}
            email={row.email}
        >
            <Box sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%', cursor: 'pointer' }}>
                <AvatarClient
                    fullName={decodedName}
                    serviceCenter={serviceCenter}
                />
            </Box>
        </UserInfoTooltip>
    );
}, (prevProps, nextProps) => {
    return prevProps.row.full_name === nextProps.row.full_name &&
           prevProps.row.service_center?.service_center_name === nextProps.row.service_center?.service_center_name &&
           prevProps.row.email === nextProps.row.email;
});

const DescriptionCell = React.memo(({ row, value }: { row: ClosedTicketsResponse; value: any }) => {
    const description = React.useMemo(() => value || row.description || 'No description', [value, row.description]);
    const systemName = React.useMemo(() => row.system?.system_name, [row.system]);
    const categories = React.useMemo(() => row.categories, [row.categories]);
    
    return (
        <DescriptionTooltip
            description={description}
            system={systemName}
            categories={categories}
            fsr_no={row.fsr_no}
            store_code={row.store_code}
            store_name={row.store_name}
            address={row.store_address}
            powerform_full_name={row.powerform_full_name}
            powerform_employee_id={row.powerform_employee_id}
            powerform_email={row.powerform_email}
            powerform_company_number={row.powerform_company_number}
            powerform_imei={row.powerform_imei}
            service_logs_mobile_no={row.service_logs_mobile_no}
            service_logs_mobile_model={row.service_logs_mobile_model}
            service_logs_mobile_serial_no={row.service_logs_mobile_serial_no}
            service_logs_imei={row.service_logs_imei}
            knox_full_name={row.knox_full_name}
            knox_employee_id={row.knox_employee_id}
            knox_email={row.knox_email}
            knox_company_mobile_number={row.knox_company_mobile_number}
            knox_mobile_imei={row.knox_mobile_imei}
        />
    );
}, (prevProps, nextProps) => {
    return prevProps.value === nextProps.value &&
           prevProps.row.description === nextProps.row.description &&
           prevProps.row.system?.system_name === nextProps.row.system?.system_name;
});

const TicketNumberCell = React.memo(({ row, value }: { row: ClosedTicketsResponse; value: any }) => {
    const ticketNumber = React.useMemo(() => value || row.ticket_number || 'N/A', [value, row.ticket_number]);
    
    return (
        <StatusChip
            label={ticketNumber}
            status={row.status}
            isTicketNumber={true}
        />
    );
}, (prevProps, nextProps) => {
    return prevProps.value === nextProps.value &&
           prevProps.row.ticket_number === nextProps.row.ticket_number &&
           prevProps.row.status === nextProps.row.status;
});

const ClosedByCell = React.memo(({ row }: { row: ClosedTicketsResponse }) => {
    const user = React.useMemo(() => row.closed_by, [row.closed_by]);
    const roleName = React.useMemo(() => user?.roles?.[0]?.name, [user?.roles]);
    
    return (
        <UserAvatar
            full_name={user?.name}
            role_name={roleName}
            avatar_url={user?.avatar_url}
        />
    );
}, (prevProps, nextProps) => {
    return prevProps.row.closed_by?.id === nextProps.row.closed_by?.id &&
           prevProps.row.closed_by?.name === nextProps.row.closed_by?.name &&
           prevProps.row.closed_by?.avatar_url === nextProps.row.closed_by?.avatar_url;
});

const StatusCell = React.memo(({ row, value }: { row: ClosedTicketsResponse; value: any }) => {
    return (
        <StatusChip
            label={value}
            status={row.status}
        />
    );
}, (prevProps, nextProps) => {
    return prevProps.value === nextProps.value &&
           prevProps.row.status === nextProps.row.status;
});

const ClosedTicketsColumns: GridColDef<ClosedTicketsResponse>[] = [

    {
        field: "closed_at",
        headerName: "CLOSED ON",
        minWidth: 200,
        flex: 1,
        renderCell: ({ row }) => <ClosedDateCell row={row} />,
    },
    {
        field: "full_name",
        headerName: "REPORTED BY",
        flex: 1,
        minWidth: 250,
        filterable: true,
        valueGetter: (value, row) => row?.full_name || '', // Add valueGetter for quick filter
        renderCell: ({ row }) => <ReportedByCell row={row} />,
    },
    {
        field: "description",
        headerName: "REPORTED DESCRIPTION",
        width: 250,
        filterable: true,
        sortable: false,
        disableColumnMenu: true,
        valueGetter: (value, row) => row?.description || '', // Add valueGetter for quick filter
        renderCell: ({ row, value }) => <DescriptionCell row={row} value={value} />,
    },
    {
        field: "ticket_number",
        headerName: "TICKET NUMBER",
        minWidth: 250,
        flex: 1,
        hideable: true,
        headerAlign: "center",
        align: "center",
        filterable: true,
        sortable: false,
        disableColumnMenu: true,
        valueGetter: (value, row) => row?.ticket_number || '', // Add valueGetter for quick filter
        renderCell: ({ row, value }) => <TicketNumberCell row={row} value={value} />,
    },
    {
        field: "closed_by",
        headerName: "CLOSED BY",
        minWidth: 250,
        flex: 1,
        filterable: true,
        valueGetter: (value, row) => row?.closed_by?.name || '', // Add valueGetter for quick filter
        renderCell: ({ row }) => <ClosedByCell row={row} />,
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
        field: "status",
        headerName: "STATUS",
        minWidth: 250,
        flex: 1,
        headerAlign: "center",
        align: "center",
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ row, value }) => <StatusCell row={row} value={value} />,
    },
];

export default ClosedTicketsColumns; 