import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link, usePage } from '@inertiajs/react';
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material";

interface RouteTab {
    label: string;
    href: string;
    icon?: React.ReactElement<any>;
}

interface NavTabsProps {
    routes: RouteTab[];
    children: React.ReactNode;
    initialTab?: number;
}

export default function NavTabs({ routes, children, initialTab = 0 }: NavTabsProps) {
    const { url } = usePage();

    // Memoize the URL parsing function
    const getPathFromUrl = React.useCallback((urlString: string) => {
        return new URL(urlString, window.location.origin).pathname;
    }, []);

    // Find the active index based on current URL, ensuring it's never -1
    const activeIndex = React.useMemo(() => {
        const currentPath = getPathFromUrl(url);
        const index = routes.findIndex((route) => {
            const routePath = getPathFromUrl(route.href);
            return currentPath === routePath;
        });
        return index >= 0 ? index : 0;
    }, [routes, url, getPathFromUrl]);

    // Initialize state with active index
    const [value, setValue] = React.useState(activeIndex);

    // Update value whenever activeIndex changes
    React.useEffect(() => {
        setValue(activeIndex);
    }, [activeIndex]);

    const handleChange = React.useCallback((event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }, []);

    // Memoize the Tab components to prevent unnecessary re-renders
    const tabComponents = React.useMemo(() => {
        
        return routes.map((route, index) => {
            const isActive = value === index;
            const icon = route.icon ? React.cloneElement(route.icon, {
                sx: { color: isActive ? 'primary.main' : 'inherit' }
            }) : undefined;

            return (
                <Tab
                    key={route.href}
                    label={route.label}
                    icon={icon}
                    iconPosition="start"
                    component={Link}
                    href={route.href}
                    value={index}
                    preserveState
                    preserveScroll
                    aria-current={isActive ? 'page' : undefined}
                />
            );
        });
    }, [routes, value]);

    const childrenArray = React.Children.toArray(children);

    return (
        <Paper sx={{
            width: '100%',
            borderRadius: 2,
            mt: 1,
            boxShadow: 'none',
            border: '1px solid',
            borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
        }}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="Navigation Tabs"
                role="navigation"
                textColor="primary"
                indicatorColor="primary"
                sx={{
                    minHeight: '48px',
                    borderBottom: '1px solid #e0e0e0',
                    '& .MuiTab-root': {
                        minHeight: '48px',
                        padding: '8px 16px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        gap: '8px',
                        justifyContent: 'flex-start',
                        '&.Mui-selected': {
                            color: 'primary.main',
                            fontWeight: 600,
                        },
                        '&:not(.Mui-selected)': {
                            color: 'text.secondary',
                        },
                    },
                    '& .MuiTabs-indicator': {
                        height: '2px',
                        borderRadius: '2px 2px 0 0',
                    },
                }}
            >
                {tabComponents}
            </Tabs>
            <Box>
                {childrenArray[value]}
            </Box>
        </Paper>
    );
}

// UTILITY FUNCTION TO BLOCK FULL PAGE RELOAD
function samePageLinkNavigation(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
): boolean {
    if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
    ) {
        return false;
    }
    return true;
}
