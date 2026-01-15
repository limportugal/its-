import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import AvatarUser from "@/Components/Mui/AvatarUser";
import { router, usePage } from "@inertiajs/react";
import { Button, CircularProgress, Typography, alpha, useTheme, useMediaQuery } from "@mui/material";
import { menuPaperProps } from "./MenuPaperProps";
import { Fade } from "@mui/material";
import RoleChips from "@/Components/Mui/RoleChips";
import PersonIcon from '@mui/icons-material/Person';
import { getCsrfToken, refreshCsrfToken } from "@/Reuseable/helpers/csrf";

// ACCOUNT MENU COMPONENT
export default function AccountMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { auth } = usePage().props;
    const [processingLogout, setProcessingLogout] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        if (!processingLogout) {
            setAnchorEl(null);
        }
    };

    const handleLogout = async (event: React.MouseEvent) => {
        event.preventDefault();
        setProcessingLogout(true);
        
        try {
            // First, try to get a fresh CSRF token
            const csrfResponse = await fetch(route('csrf-token'), {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            
            if (!csrfResponse.ok) {
                throw new Error('Failed to get CSRF token');
            }

            const csrfData = await csrfResponse.json();
            const freshToken = csrfData.csrf_token;
            
            // Perform logout using fetch (not Inertia router) for full control
            const logoutResponse = await fetch(route("logout"), {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': freshToken,
                },
                body: JSON.stringify({
                    _token: freshToken,
                }),
            });
            
            if (logoutResponse.ok || logoutResponse.status === 302) {
                // Logout successful, do full page reload to home
                setProcessingLogout(false);
                setAnchorEl(null);
                window.location.href = '/';
            } else if (logoutResponse.status === 419) {
                // CSRF token expired, refresh page to get new token
                window.location.reload();
            } else {
                throw new Error(`Logout failed with status: ${logoutResponse.status}`);
            }
        } catch (error) {
            console.error('Logout error:', error);
            setProcessingLogout(false);
            
            // Fallback: refresh the page
            window.location.reload();
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Tooltip title="Account settings" arrow>
                    <IconButton
                        onClick={handleClick}
                        sx={{
                            width: isMobile ? 36 : 40,
                            height: isMobile ? 36 : 40,
                            borderRadius: "50%",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                                transform: "scale(1.05)",
                                backgroundColor: "transparent",
                            },
                            padding: 0,
                        }}
                    >
                        <AvatarUser
                            avatar_url={auth.user?.avatar_url || null}
                        />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            ...menuPaperProps,
                            minWidth: isMobile ? 260 : 280,
                            maxWidth: isMobile ? '90vw' : 'none',
                            mt: 1.5,
                            borderRadius: 2,
                            boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                            "& .MuiMenuItem-root": {
                                px: isMobile ? 2 : 2.5,
                                py: isMobile ? 1.5 : 2,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 200 }}
            >
                {/* USER INFO */}
                <MenuItem
                    onClick={handleClose}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        "&:hover": {
                            backgroundColor: "transparent",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            gap: 2,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: "auto" }}>
                            <Avatar
                                sx={{
                                    width: isMobile ? "56px !important" : "64px !important",
                                    height: isMobile ? "56px !important" : "64px !important",
                                    bgcolor: "grey.400",
                                }}
                                src={auth.user?.avatar_url || undefined}
                            >
                                {!auth.user?.avatar_url && (
                                    <PersonIcon sx={{
                                        fontSize: isMobile ? "2.5rem" : "3rem",
                                        color: "white"
                                    }} />
                                )}
                            </Avatar>
                        </ListItemIcon>
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight="600"
                                sx={{
                                    fontSize: isMobile ? "1rem" : "1.1rem",
                                    mb: 0.5,
                                    color: "text.primary",
                                    wordBreak: "break-word",
                                }}
                            >
                                {auth.user?.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontSize: isMobile ? "0.8rem" : "0.875rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mb: 0.5,
                                    wordBreak: "break-word",
                                }}
                            >
                                {auth.user?.email}
                            </Typography>
                            {Array.isArray(auth.user?.roles) && auth.user.roles.length > 0 && (
                                <RoleChips roles={auth.user.roles} />
                            )}
                        </Box>
                    </Box>
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem
                    onClick={() => {
                        handleClose(); 
                        router.visit(route('profile.index'), {
                            onSuccess: () => {
                                // USE this requestAnimationFrame para sure na na-render na yung Profile component
                                requestAnimationFrame(() => {
                                    window.dispatchEvent(new CustomEvent('refetchProfileData'));
                                });
                            }
                        });
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                            transform: "translateX(4px)",
                        },
                    }}
                >
                    <PersonIcon sx={{ color: "text.secondary" }} />
                    <Typography variant="body2">Profile</Typography>
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                {/* LOGOUT MENU */}
                <Box 
                    display="flex" 
                    justifyContent={isMobile ? "center" : "flex-end"} 
                    px={isMobile ? 2 : 2.5} 
                    py={isMobile ? 1.5 : 2}
                >
                    <Button
                        onClick={handleLogout}
                        disabled={processingLogout}
                        variant="outlined"
                        color="primary"
                        fullWidth={isMobile}
                        sx={{
                            borderRadius: 1,
                            textTransform: "none",
                            px: isMobile ? 2 : 3,
                            py: isMobile ? 0.8 : 1,
                            fontSize: isMobile ? "0.875rem" : "0.9rem",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                                backgroundColor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.08),
                                transform: "translateY(-1px)",
                            },
                        }}
                        endIcon={processingLogout ? <CircularProgress size={isMobile ? 16 : 20} /> : <Logout fontSize="small" />}
                    >
                        {processingLogout ? "Logging out..." : "Logout"}
                    </Button>
                </Box>
            </Menu>
        </>
    );
}
