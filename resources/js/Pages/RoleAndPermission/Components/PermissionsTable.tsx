import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Checkbox } from "@mui/material";
import PermissionCard from "./PermissionCard";
import { useTheme } from "@mui/material/styles";

interface Permission {
    id: number;
    name: string;
    create: boolean;
    update: boolean;
    delete: boolean;
}

interface PermissionsTableProps {
    permissions: {
        page: string;
        permission: Permission;
        selectAllChecked: boolean;
        onSelectAll: (index: number, checked: boolean) => void;
        onPermissionChange: (index: number, key: string, checked: boolean) => void;
    }[];
    onGlobalSelectAll?: (checked: boolean) => void;
    globalSelectAllChecked?: boolean;
    disabled?: boolean;
}

const PermissionsTable = ({ permissions, onGlobalSelectAll, globalSelectAllChecked = false, disabled = false }: PermissionsTableProps) => {
    const theme = useTheme();

    return (
        <Box sx={{ 
            borderRadius: '12px',
            backgroundColor: 'background.paper',
            boxShadow: theme.shadows[1],
            overflow: 'hidden'
        }}>
            {/* Table Title Section */}
            <Box 
                sx={{ 
                    p: 2.5, 
                    backgroundColor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Box>
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Administrator Permission Access
                    </Typography>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: 'text.secondary',
                            display: 'block',
                            mt: 0.5 
                        }}
                    >
                        Manage access control for different sections
                    </Typography>
                </Box>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    pr: 1
                }}>
                    <Checkbox
                        size="small"
                        checked={globalSelectAllChecked}
                        onChange={(e) => onGlobalSelectAll?.(e.target.checked)}
                        color="primary"
                        disabled={disabled}
                    />
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: 'text.secondary',
                            fontWeight: 500
                        }}
                    >
                        Select All Permissions
                    </Typography>
                </Box>
            </Box>

            <TableContainer 
                component={Paper} 
                elevation={0} 
                sx={{ 
                    backgroundColor: 'background.paper',
                    '& .MuiTable-root': {
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                    },
                    '& .MuiTableCell-root': {
                        borderColor: theme.palette.divider,
                    },
                    '& .MuiTableRow-root:last-child .MuiTableCell-root': {
                        borderBottom: 'none',
                    },
                }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow 
                            sx={{ 
                                backgroundColor: theme.palette.grey[50],
                                '& .MuiTableCell-root': {
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    py: 2.5,
                                    transition: 'all 200ms ease-in-out',
                                }
                            }}
                        >
                            <TableCell 
                                sx={{ 
                                    width: '250px',
                                    pl: 3,
                                    pr: 2,
                                    borderRight: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        fontWeight: 600, 
                                        color: 'text.secondary',
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Modules
                                </Typography>
                            </TableCell>
                            <TableCell 
                                sx={{ 
                                    pl: 2, 
                                    pr: 3,
                                }}
                            >
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        fontWeight: 600, 
                                        color: 'text.secondary',
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Permissions
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {permissions.map(({ page, permission, selectAllChecked, onSelectAll, onPermissionChange }, index) => (
                            <PermissionCard
                                key={index}
                                page={page}
                                index={index}
                                permission={permission}
                                selectAllChecked={selectAllChecked}
                                onSelectAll={onSelectAll}
                                onPermissionChange={onPermissionChange}
                                disabled={disabled}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PermissionsTable; 