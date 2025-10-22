import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Tooltip, SvgIconProps, ListItemIcon, ListItemText, Box, useTheme, useMediaQuery } from "@mui/material";
import { blue, red, green, grey, yellow, orange } from '@mui/material/colors';

interface MenuOption {
    text: string;
    icon?: React.ComponentType<SvgIconProps>;
    color?: "primary" | "error" | "info" | "success" | "warning" | "secondary";
    sx?: any;
}

export interface KebabMenuProps {
    options: (MenuOption | string)[];
    onSelect: (option: string, closeMenu: () => void) => void;
}

const getColorFromType = (colorType: MenuOption['color']) => {
    switch (colorType) {
        case 'primary':
            return blue[500];
        case 'error':
            return red[500];
        case 'info':
            return blue[500];
        case 'success':
            return green[500];
        case 'warning':
            return orange[500];
        default:
            return 'inherit';
    }
};

const getBackgroundColor = (colorType: MenuOption['color']) => {
    switch (colorType) {
        case 'primary':
            return { bg: blue[50], hover: blue[100] };
        case 'error':
            return { bg: red[50], hover: red[100] };
        case 'info':
            return { bg: blue[50], hover: blue[100] };
        case 'success':
            return { bg: green[50], hover: green[100] };
        case 'warning':
            return { bg: orange[50], hover: orange[100] };
        default:
            return { bg: grey[50], hover: grey[100] };
    }
};

const KebabMenu: React.FC<KebabMenuProps> = ({ options, onSelect }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (option?: MenuOption | string) => {
        setAnchorEl(null);
        if (option) {
            setTimeout(() => {
                onSelect(typeof option === 'string' ? option : option.text, () => setAnchorEl(null));
            }, 100);
        }
    };

    return (
        <div>
            <Tooltip title="More options" arrow>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                    sx={{
                        color: grey[700],
                        bgcolor: grey[50],
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        borderRadius: '50%',
                        '&:hover': {
                            bgcolor: grey[100],
                            color: grey[900]
                        }
                    }}
                >
                    <MoreVertIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' } }} />
                </IconButton>
            </Tooltip>
            <Menu
                id="long-menu"
                MenuListProps={{ 
                    "aria-labelledby": "long-button",
                    dense: true
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose()}
                slotProps={{
                    paper: {
                        sx: {
                            maxHeight: { xs: '250px', sm: '300px' },
                            minWidth: { xs: "180px", sm: "200px" },
                            maxWidth: { xs: "250px", sm: "300px" },
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            }
                        }
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {options.map((option) => {
                    const opt = typeof option === 'string' ? { text: option } : option;
                    const iconColor = opt.color ? getColorFromType(opt.color) : undefined;
                    const bgColor = opt.color ? getBackgroundColor(opt.color) : undefined;
                    
                    return (
                        <MenuItem 
                            key={opt.text} 
                            onClick={() => handleClose(option)}
                            sx={{ 
                                py: { xs: 1, sm: 1.5 },
                                px: { xs: 1.5, sm: 2 },
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 1.5, sm: 2 },
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                },
                                ...opt.sx
                            }}
                        >
                            {opt.icon && (
                                <ListItemIcon 
                                    sx={{ 
                                        minWidth: 'unset',
                                        m: 0
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: bgColor?.bg || grey[50],
                                            width: { xs: '32px', sm: '40px' },
                                            height: { xs: '32px', sm: '40px' },
                                            borderRadius: '50%',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: bgColor?.hover || grey[100],
                                            }
                                        }}
                                    >
                                        <opt.icon 
                                            style={{ 
                                                fontSize: isMobile ? '1rem' : '1.2rem',
                                                color: iconColor
                                            }} 
                                        />
                                    </Box>
                                </ListItemIcon>
                            )}
                            <ListItemText 
                                primary={opt.text}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontSize: { xs: '0.875rem', sm: '0.95rem' }
                                    }
                                }}
                            />
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );
};

export default KebabMenu;