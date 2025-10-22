import { Box, TableRow, TableCell, Checkbox, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

interface Permission {
    id: number;
    name: string;
    create: boolean;
    update: boolean;
    delete: boolean;
}

interface PermissionCardProps {
    page: string;
    index: number;
    permission: Permission;
    selectAllChecked: boolean;
    onSelectAll: (index: number, checked: boolean) => void;
    onPermissionChange: (index: number, key: string, checked: boolean) => void;
    disabled: boolean;
}

type ActionColor = "success" | "primary" | "warning" | "error" | "info" | "secondary";
type PermissionKey = "create" | "update" | "delete";

const ACTIONS = [
    { label: "Create", key: "create" as PermissionKey, color: "success" as ActionColor },
    { label: "Update", key: "update" as PermissionKey, color: "warning" as ActionColor },
    { label: "Delete", key: "delete" as PermissionKey, color: "error" as ActionColor },
];

const PermissionCard = ({
    page,
    index,
    permission = {
        id: -1,
        name: '',
        create: false,
        update: false,
        delete: false,
    },
    selectAllChecked = false,
    onSelectAll,
    onPermissionChange,
    disabled = false,
}: PermissionCardProps) => {
    const theme = useTheme();

    if (!permission) {
        return null;
    }

    return (
        <TableRow 
            sx={{ 
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    '& .MuiTypography-root': {
                        color: theme.palette.primary.main,
                    }
                },
                borderBottom: '1px solid',
                borderColor: 'divider',
                height: '48px'
            }}
        >
            <TableCell 
                sx={{ 
                    width: '250px', 
                    pl: 3,
                    pr: 2,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    verticalAlign: 'middle',
                }}
            >
                <Typography 
                    variant="body2" 
                    sx={{ 
                        fontWeight: 500,
                        transition: 'color 0.2s ease-in-out',
                        color: theme.palette.text.primary,
                    }}
                >
                    {page}
                </Typography>
            </TableCell>
            <TableCell 
                sx={{ 
                    pl: 2,
                    pr: 3,
                    verticalAlign: 'middle',
                }}
            >
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 4,
                        '& .MuiCheckbox-root': {
                            transition: 'all 0.2s ease-in-out',
                            padding: '4px',
                        },
                        '& .MuiTypography-root': {
                            transition: 'color 0.2s ease-in-out',
                        }
                    }}
                >
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            minWidth: '100px',
                            gap: 0.5,
                            '&:hover .MuiCheckbox-root': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            }
                        }}
                    >
                        <Checkbox
                            size="small"
                            checked={selectAllChecked}
                            onChange={(e) => onSelectAll(index, e.target.checked)}
                            color="primary"
                            disabled={disabled}
                        />
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: theme.palette.text.secondary,
                                fontWeight: 500
                            }}
                        >
                            Select All
                        </Typography>
                    </Box>
                    {ACTIONS.map((action) => (
                        <Box 
                            key={action.key} 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                minWidth: '90px',
                                gap: 0.5,
                                '&:hover .MuiCheckbox-root': {
                                    backgroundColor: alpha(theme.palette[action.color].main, 0.08),
                                }
                            }}
                        >
                            <Checkbox
                                size="small"
                                checked={permission?.[action.key] ?? false}
                                onChange={(e) => onPermissionChange(index, action.key, e.target.checked)}
                                color={action.color}
                                disabled={disabled}
                            />
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: theme.palette.text.secondary,
                                    fontWeight: 500
                                }}
                            >
                                {action.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default PermissionCard;