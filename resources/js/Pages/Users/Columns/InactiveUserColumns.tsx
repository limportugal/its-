// MUI COMPONENTS
import { GridColDef } from '@mui/x-data-grid';
import KebabMenu from '@/Components/Mui/KebabMenu';
import { formatDate } from '@/Reuseable/utils/formatDate';
import CompanyIcon from '@/Pages/Maintenance/Companies/Logo';
import { UsersResponse } from '@/Reuseable/types/userTypes';
import AvatarUser from '@/Components/Mui/AvatarUser';
import { kebabMenuOptions } from '@/Pages/Users/utils/kebabMenuOptions';
import UserStatusChip from '@/Pages/Users/UserComponents/UserStatusChip';
import RoleChips from '@/Components/Mui/RoleChips';

export const InactiveUserColumns = (
    onKebabMenuSelect: (option: any, row: UsersResponse, closeMenu: () => void) => void,
    userRoles: string[] = [],
    showActivateOption: boolean = false,
    showDeactivateOption: boolean = true,
    currentUserId?: string
): GridColDef[] => {
    const isSuperAdmin = userRoles.includes("Super Admin");
    const isAdmin = userRoles.includes("Admin") || userRoles.includes("Manager");

    return [
        {
            field: "created_at",
            headerName: "DATE ADDED",
            minWidth: 200,
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => <span>{formatDate(row.created_at)}</span>,
        },
        {
            field: "name",
            headerName: "USER NAME",
            flex: 1,
            minWidth: 280,
            cellClassName: "user-name-cell",
            renderCell: (params) => {
                const user = {
                    name: params.row.name || "",
                    email: params.row.email || "",
                    avatar_url: params.row.avatar_url || null,
                    roles: params.row.roles || [],
                };

                const firstLetter = user.name
                    ? user.name.charAt(0).toUpperCase()
                    : "";

                return (
                    <AvatarUser
                        full_name={user.name}
                        avatar_url={user.avatar_url}
                        email={user.email}
                    />
                );
            },
        },
        {
            field: "roles",
            headerName: "ROLE",
            headerAlign: "center",
            align: "center",
            minWidth: 180,
            flex: 1,
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                return params.row.roles ? (
                    <RoleChips roles={params.row.roles} />
                ) : null;
            },
        },
        {
            field: "company",
            headerName: "COMPANY",
            minWidth: 250,
            flex: 1,
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: { row: UsersResponse }) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CompanyIcon companyName={row.company?.company_name}/>
                    <span>{row.company?.company_name}</span>
                </div>
            ),
        },
        {
            field: "status",
            headerName: "STATUS",
            minWidth: 180,
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <UserStatusChip status={params.value} />
            ),
        },

        // FOR SUPER ADMIN OR ADMIN WITH UPDATE USER PERMISSION
        {
            field: "action",
            headerName: "ACTION",
            headerAlign: "center",
            align: "center",
            width: 150,
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => {
                // FILTER OPTIONS BASED ON USER ROLE AND STATUS
                const filteredOptions = kebabMenuOptions.filter(option => {
                    // HIDE ACTIVATE OPTION IF USER IS ALREADY ACTIVE OR AWAITING PASSWORD (for all users)
                    if (option.text === "Activate") {
                        const userStatus = row.status?.toLowerCase();
                        if (userStatus === 'active' || userStatus === 'awaiting_password') {
                            return false;
                        }
                    }

                    // HIDE DEACTIVATE OPTION IF USER IS ALREADY INACTIVE
                    if (option.text === "Deactivate") {
                        const userStatus = row.status?.toLowerCase();
                        if (userStatus === 'inactive') {
                            return false;
                        }
                    }

                    // SUPER ADMIN CAN SEE ALL OPTIONS (except delete/deactivate their own profile)
                    if (isSuperAdmin) {
                        if (option.text === "Delete" || option.text === "Deactivate") {
                            const isOwnProfile = currentUserId && row.id.toString() === currentUserId;
                            return !isOwnProfile;
                        }
                        return true;
                    }

                    // HIDE DELETE OPTION FOR ADMIN AND MANAGER
                    if (option.text === "Delete") {
                        return false;
                    }

                    // CHECK IF USER IS ADMIN OR SUPERADMIN
                    const isPrivilegedUser = row.roles && row.roles.some((role: { name: string }) =>
                        role.name === "Admin" || role.name === "Super Admin" || role.name === "Manager"
                    );

                    // DON'T ALLOW ADMIN TO EDIT/ACTIVATE/DEACTIVATE OTHER ADMINS OR SUPERADMINS
                    // BUT ALLOW THEM TO EDIT THEIR OWN PROFILE
                    // ALLOW MANAGER TO EDIT/DEACTIVATE ADMIN USERS
                    if ((option.text === "Edit" || option.text === "Activate" || option.text === "Deactivate")
                        && isPrivilegedUser) {
                        const isOwnProfile = currentUserId && row.id.toString() === currentUserId;
                        
                        // Allow editing own profile for all privileged users
                        if (option.text === "Edit" && isOwnProfile) {
                            return true;
                        }
                        
                        // Allow Manager to edit/deactivate Admin users (but not Super Admin)
                        if (userRoles.includes("Manager")) {
                            const isAdminUser = row.roles && row.roles.some((role: { name: string }) =>
                                role.name === "Admin"
                            );
                            if (isAdminUser && (option.text === "Edit" || option.text === "Deactivate")) {
                                return true;
                            }
                        }
                        
                        // Prevent Admin from editing other Admin users
                        if (userRoles.includes("Admin") && !userRoles.includes("Super Admin")) {
                            const isAdminUser = row.roles && row.roles.some((role: { name: string }) =>
                                role.name === "Admin"
                            );
                            if (isAdminUser && option.text === "Edit" && !isOwnProfile) {
                                return false;
                            }
                        }
                        
                        return false;
                    }

                    // SHOW ACTIVATE OPTION WHEN ENABLED AND FOR ADMIN/SUPERADMIN
                    if (option.text === "Activate") {
                        return showActivateOption && (isAdmin || isSuperAdmin);
                    }

                    // SHOW DEACTIVATE OPTION WHEN ENABLED AND FOR ADMIN/SUPERADMIN
                    if (option.text === "Deactivate") {
                        return showDeactivateOption && (isAdmin || isSuperAdmin);
                    }

                    if (option.text === "View Profile") {
                        // Show View Profile option for Admin, Manager, and Super Admin
                        return (isAdmin || isSuperAdmin);
                    }

                    // SHOW OTHER OPTIONS TO EVERYONE
                    return true;
                });

                return (
                    <KebabMenu
                        options={filteredOptions}
                        onSelect={(option, closeMenu) => onKebabMenuSelect(option, row, closeMenu)}
                    />
                );
            },
        },

    ];
} 