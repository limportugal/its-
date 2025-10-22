import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { formatDate } from '@/Reuseable/utils/formatDate';
import { decodeHtmlEntities } from '@/Reuseable/utils/decodeHtmlEntities';
import AvatarUser from '@/Components/Mui/AvatarUser';
import StatusChip from '@/Pages/Tickets/TicketComponents/StatusChip';
import { UserLogsResponse } from '@/Reuseable/types/userLogsTypes';

// MEMOIZED CELL COMPONENTS FOR PERFORMANCE - OPTIMIZED
const ActivityDateCell = React.memo(({ row }: { row: UserLogsResponse }) => {
    const formattedDate = React.useMemo(() => formatDate(row.created_at), [row.created_at]);
    return <span>{formattedDate}</span>;
}, (prevProps, nextProps) => {
    return prevProps.row.created_at === nextProps.row.created_at;
});

const UserNameCell = React.memo(({ row }: { row: UserLogsResponse }) => {
    const user = React.useMemo(() => row.user || {
        name: "Ticket Creator",
        email: "",
        avatar_url: null,
        roles: []
    }, [row.user]);
    
    const roleName = React.useMemo(() => 
        user.roles && user.roles.length > 0 ? user.roles[0].name : "", 
        [user.roles]
    );

    return (
        <AvatarUser
            full_name={user.name}
            avatar_url={user.avatar_url || null}
            role_name={roleName}
        />
    );
}, (prevProps, nextProps) => {
    return prevProps.row.user?.id === nextProps.row.user?.id &&
           prevProps.row.user?.name === nextProps.row.user?.name &&
           prevProps.row.user?.avatar_url === nextProps.row.user?.avatar_url;
});

const TicketNumberCell = React.memo(({ row }: { row: UserLogsResponse }) => {
    const ticketNumber = React.useMemo(() => {
        // Use the ticket_number field directly from the backend
        return row?.ticket_number || null;
    }, [row?.ticket_number]);
    
    return ticketNumber ? (
        <StatusChip
            label={ticketNumber}
            status="new_ticket"
            isTicketNumber={true}
        />
    ) : (
        <span>-</span>
    );
}, (prevProps, nextProps) => {
    return prevProps.row.activity === nextProps.row.activity;
});

const ActivityCell = React.memo(({ value }: { value: string }) => {
    const activity = React.useMemo(() => decodeHtmlEntities(value), [value]);
    
    return (
        <div
            style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                lineHeight: '1.5',
                padding: '8px 0'
            }}
            title={activity}
        >
            {activity}
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
});

export const UserLogsColumns = (): GridColDef<UserLogsResponse>[] => [
    {
        field: "created_at",
        headerName: "ACTIVITY DATE",
        width: 200,
        sortable: true,
        filterable: false,
        renderCell: ({ row }) => <ActivityDateCell row={row} />,
    },
    {
        field: "user",
        headerName: "USER NAME",
        width: 300,
        sortable: true,
        filterable: true,
        valueGetter: (_value, row) => row.user?.name || 'Unknown User',
        renderCell: ({ row }) => <UserNameCell row={row} />,
    },
    {
        field: "ticket_number",
        headerName: "TICKET NUMBER",
        width: 230,
        headerAlign: "center",
        align: "center",
        sortable: true, 
        filterable: true,
        renderCell: ({ row }) => <TicketNumberCell row={row} />,
    },
    {
        field: "activity",
        headerName: "DESCRIPTION",
        minWidth: 400,
        flex: 1,
        sortable: true,
        filterable: true,
        renderCell: ({ value }) => <ActivityCell value={value as string} />,
    },
]; 