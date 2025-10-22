import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import { usePage, router } from "@inertiajs/react";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { DrawerComponentProps, MenuItem } from "./types/DrawerTypes";
import DrawerContent from "./DrawerContent";
import { route } from "ziggy-js";
import useDrawerStore from "@/stores/useDrawerStore";

// MUI ICONS
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CancelIcon from '@mui/icons-material/Cancel';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import LockIcon from "@mui/icons-material/Lock";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeleteIcon from '@mui/icons-material/Delete';

const DrawerComponent: React.FC<DrawerComponentProps> = memo(
    ({
        mobileOpen,
        handleDrawerClose,
        handleDrawerTransitionEnd,
        isMiniDrawer,
    }) => {
        const drawerWidth = 300;
        const miniDrawerWidth = 105;

        const [open, setOpen] = useState<Record<number, boolean>>({});
        const [selected, setSelected] = useState<string | null>(null);
        const { url } = usePage();
        const userRoles: string[] = (usePage().props as any).userRoles ?? [];
        const { isMobileExpanded, setMobileOpen } = useDrawerStore();
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

        const allowedRoles = ["Super Admin", "Admin", "Manager"];
        const hasAdminAccess = userRoles.some((role) =>
            allowedRoles.includes(role),
        );
        const isSuperAdmin = userRoles.includes("Super Admin");
        const isAdmin = userRoles.includes("Admin");
        const navMenu: MenuItem[] = useMemo(
            () =>
                [
                    hasAdminAccess && {
                        title: "Dashboard",
                        icon: <DashboardIcon />,
                        route: route('dashboard.index'),
                        tooltip: "System Dashboard - Overview of tickets and system statistics",
                    },
                    {
                        title: "Pending",
                        icon: <ConfirmationNumberIcon />,
                        route: route('tickets.indexPendingTickets'),
                        tooltip: "Pending Tickets - View and manage tickets awaiting action",
                    },
                    {
                        title: "Cancelled",
                        icon: <CancelIcon />,
                        route: route('tickets.indexCancelledTickets'),
                        tooltip: "Cancelled Tickets - View tickets that have been cancelled",
                    },
                    {
                        title: "Closed",
                        icon: <FactCheckIcon />,
                        route: route('tickets.indexClosedTickets'),
                        tooltip: "Closed Tickets - View completed and resolved tickets",
                    },
                    isSuperAdmin && {
                        title: "Trash",
                        icon: <DeleteIcon />,
                        route: route('tickets.indexDeletedTickets'),
                        tooltip: "Recycle Bin - View deleted tickets that can be restored (Super Admin only)",
                    },
                    hasAdminAccess && {
                        title: "Settings",
                        icon: <SettingsApplicationsIcon />,
                        route: route('maintenance.service-centers.index'),
                        tooltip: "Maintenance Settings - Manage categories, companies, and priorities (Super Admin, Admin, Manager only)",
                    },
                    isSuperAdmin && {
                        title: "RBAC",
                        icon: <LockIcon />,
                        route: route('roles-and-permissions.index'),
                        tooltip: "Role-Based Access Control - Manage user roles and permissions (Super Admin only)",
                    },
                    hasAdminAccess && {
                        title: "Users",
                        icon: <PeopleAltIcon />,
                        route: route('users.active-users.index'),
                        tooltip: "User Management - View and manage system users (Super Admin, Admin, Manager only)",
                    },
                    {
                        title: "User Logs",
                        icon: <WorkHistoryIcon />,
                        route: route('userlogs.index'),
                        tooltip: "User Activity Logs - Track user actions and system activities",
                    },
                ].filter(Boolean) as MenuItem[],
            [userRoles],
        );

        // MEMOIZE THE UPDATE MENU STATE FUNCTION
        const updateMenuState = useCallback(() => {
            const currentPath = url;
            let newSelected: string | null = null;
            let newOpenState: Record<number, boolean> = {};

            // HELPER FUNCTION TO NORMALIZE PATHS FOR COMPARISON
            const normalizePath = (path: string) => {
                // REMOVE DOMAIN AND PROTOCOL IF PRESENT
                const urlObj = new URL(path, window.location.origin);
                return urlObj.pathname;
            };

            const normalizedCurrentPath = normalizePath(currentPath);

            // CHECK MAIN ROUTES FIRST - FIND THE BEST MATCH
            let bestMatchIndex = -1;
            let bestMatchLength = 0;
            
            navMenu.forEach((item, index) => {
                if (!item || !item.route) return;
                const normalizedItemPath = normalizePath(item.route);
                
                // SPECIAL HANDLING FOR MAINTENANCE ROUTES
                if (item.title === "Settings" && normalizedCurrentPath.startsWith("/maintenance/")) {
                    bestMatchIndex = index;
                    bestMatchLength = normalizedItemPath.length;
                    return;
                }
                
                // SPECIAL HANDLING FOR USERS ROUTES
                if (item.title === "Users" && normalizedCurrentPath.startsWith("/users/active")) {
                    bestMatchIndex = index;
                    bestMatchLength = normalizedItemPath.length;
                    return;
                }
                
                // CHECK IF CURRENT PATH STARTS WITH THE MENU ITEM PATH
                if (normalizedCurrentPath.startsWith(normalizedItemPath)) {
                    // PREFER LONGER MATCHES TO AVOID CONFLICTS (e.g., /tickets/pending vs /tickets)
                    if (normalizedItemPath.length > bestMatchLength) {
                        bestMatchIndex = index;
                        bestMatchLength = normalizedItemPath.length;
                    }
                }
            });
            
            const mainRouteIndex = bestMatchIndex;

            if (mainRouteIndex !== -1) {
                newSelected = mainRouteIndex.toString();
            } else {
                // CHECK CHILD ROUTES - FIND THE BEST MATCH
                navMenu.forEach((item, index) => {
                    if (item?.children) {
                        let bestChildIndex = -1;
                        let bestChildMatchLength = 0;
                        
                        item.children.forEach((child, childIndex) => {
                            const normalizedChildPath = normalizePath(child.route);
                            // CHECK IF CURRENT PATH STARTS WITH THE CHILD ROUTE PATH
                            if (normalizedCurrentPath.startsWith(normalizedChildPath)) {
                                // PREFER LONGER MATCHES TO AVOID CONFLICTS
                                if (normalizedChildPath.length > bestChildMatchLength) {
                                    bestChildIndex = childIndex;
                                    bestChildMatchLength = normalizedChildPath.length;
                                }
                            }
                        });
                        
                        if (bestChildIndex !== -1) {
                            newSelected = `${index}-${bestChildIndex}`;
                            newOpenState[index] = true;
                        }
                    }
                });
            }

            setSelected(newSelected);
            setOpen(newOpenState);
        }, [url, navMenu]);

        useEffect(() => {
            updateMenuState();
        }, [url]);

        const handleToggle = useCallback((index: number) => {
            setOpen((prev) => ({
                ...prev,
                [index]: !prev[index],
            }));
        }, []);

        const handleSelect = useCallback((index: string) => {
            setSelected(index);
            // Close drawer on mobile when menu item is selected
            if (isMobile) {
                setMobileOpen(false);
            }
        }, [isMobile, setMobileOpen]);

        // MEMOIZE THE DRAWER CONTENT
        const drawerContent = useMemo(
            () => (
                <DrawerContent
                    drawerWidth={drawerWidth}
                    miniDrawerWidth={miniDrawerWidth}
                    isMiniDrawer={mobileOpen ? false : isMiniDrawer} // Always expanded when mobile drawer is open
                    navMenu={navMenu}
                    selected={selected}
                    open={open}
                    handleToggle={handleToggle}
                    handleSelect={handleSelect}
                />
            ),
            [
                drawerWidth,
                miniDrawerWidth,
                isMiniDrawer,
                mobileOpen,
                navMenu,
                selected,
                open,
                handleToggle,
                handleSelect,
            ],
        );

        // FUNCTION TO CHECK IF USER HAS ACCESS TO A SPECIFIC ROUTE
        const checkAccess = (userRoles: string[], allowedRoles: string[], routePath: string) => {
            const hasAccess = userRoles.some(role => allowedRoles.includes(role));

            if (!hasAccess && routePath && window.location.pathname.startsWith(routePath)) {
                // REDIRECT TO DASHBOARD WITH ERROR MESSAGE IF USER TRIES TO ACCESS A RESTRICTED ROUTE
                router.visit(route('tickets.indexPendingTickets'), {
                    preserveState: true,
                    onSuccess: () => {
                        // SHOW ERROR MESSAGE
                        const event = new CustomEvent('flash', {
                            detail: {
                                type: 'error',
                                message: 'You do not have permission to access this resource.'
                            }
                        });
                        window.dispatchEvent(event);
                    }
                });
            }

            return hasAccess;
        };

        // CHECK ACCESS FOR PROTECTED ROUTES
        useEffect(() => {
            // CHECK ACCESS FOR MAINTENANCE PAGES
            checkAccess(userRoles, allowedRoles, route('maintenance.index'));

            // CHECK ACCESS FOR ROLES & PERMISSIONS PAGES
            checkAccess(userRoles, allowedRoles, route('roles-and-permissions.index'));

            // CHECK ACCESS FOR USERS PAGE
            checkAccess(userRoles, allowedRoles, route('users.active-users.index'));

            // CHECK ACCESS FOR USERS PAGE
            checkAccess(userRoles, allowedRoles, route('users.inactive-users.index'));
        }, [userRoles, url]);

        return (
            <Box
                component="nav"
                sx={{
                    width: { sm: isMiniDrawer ? miniDrawerWidth : drawerWidth },
                    flexShrink: { sm: 0 },
                }}
                aria-label="nav items"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            top: "0",
                            backgroundColor: "white",
                            borderLeft: "none",
                            borderTop: "none",
                            borderBottom: "none",
                            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                            overflowX: "hidden",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: isMiniDrawer ? miniDrawerWidth : drawerWidth,
                            top: "65px",
                            backgroundColor: "white",
                            height: "calc(100vh - 65px)",
                            overflow: "auto",
                            overflowX: "hidden",
                            borderLeft: "none",
                            borderTop: "none",
                            borderBottom: "none",
                            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>
        );
    },
);

export default DrawerComponent;
