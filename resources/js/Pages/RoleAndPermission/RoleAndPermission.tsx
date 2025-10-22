import CustomTabs from '@/Components/Mui/CustomTabs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import IndexRoles from './Roles/IndexRoles';
import IndexPermissions from './Permissions/IndexPermissions';
import { Head } from '@inertiajs/react';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LockIcon from '@mui/icons-material/Lock';
import { Box, useTheme, useMediaQuery } from '@mui/material';

interface RoleAndPermissionProps {
    auth: {
        user: {
            permissions: string[];
        };
    };
}

export default function RoleAndPermissionTabs({ auth }: RoleAndPermissionProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const tabsData = [
        {
            label: <span style={{ display: 'flex', alignItems: 'center' }}><SupervisorAccountIcon style={{ marginRight: 4 }} /> ROLES</span>,
            value: 'roles',
            content: <IndexRoles userPermissions={auth.user.permissions} />,
        },
        {
            label: <span style={{ display: 'flex', alignItems: 'center' }}><LockIcon style={{ marginRight: 4 }} /> PERMISSIONS</span>,
            value: 'permissions',
            content: <IndexPermissions userPermissions={auth.user.permissions} />,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Roles and Permissions" />
            <Box sx={{
                mt: isMobile ? -3 : 0,
                mx: isMobile ? -1 : 0
            }}>
                <CustomTabs tabs={tabsData} />
            </Box>
        </AuthenticatedLayout>
    );
}
