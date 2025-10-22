import React, {
    useState,
    useCallback,
    useRef,
    useEffect,
    useMemo,
} from "react";
import {
    Box,
    Typography,
    Popover,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { red } from "@mui/material/colors";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import { decodeHtmlEntities } from "@/Reuseable/utils/decodeHtmlEntities";

interface UserInfoTooltipProps {
    fullName: string;
    storeName?: string;
    email?: string;
    serviceCenter?: string;
    children: React.ReactElement;
}

const UserInfoTooltip: React.FC<UserInfoTooltipProps> = ({
    fullName,
    storeName,
    email,
    serviceCenter,
    children,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [popoverPosition, setPopoverPosition] = useState<"top" | "bottom">(
        "bottom"
    );
    const open = Boolean(anchorEl);
    const containerRef = useRef<HTMLDivElement>(null);
    const positionTimeoutRef = useRef<number | null>(null);

    const handlePopoverOpen = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);

            // CLEAR ANY EXISTING TIMEOUT
            if (positionTimeoutRef.current) {
                clearTimeout(positionTimeoutRef.current);
            }

            // DEBOUNCE POSITION CALCULATION TO PREVENT EXCESSIVE RE-RENDERS
            positionTimeoutRef.current = setTimeout(() => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    const spaceBelow = viewportHeight - rect.bottom;
                    const spaceAbove = rect.top;

                    // MORE ACCURATE POPOVER HEIGHT ESTIMATION FOR USER INFO
                    const estimatedPopoverHeight = isMobile ? 120 : 150;

                    // USE TOP POSITION IF THERE'S INSUFFICIENT SPACE BELOW
                    if (
                        spaceBelow < estimatedPopoverHeight &&
                        spaceAbove > estimatedPopoverHeight
                    ) {
                        setPopoverPosition("top");
                    } else {
                        setPopoverPosition("bottom");
                    }
                }
            }, 10); // SMALL DELAY TO ENSURE DOM IS READY
        },
        [isMobile]
    );

    const handlePopoverClose = useCallback(() => {
        setAnchorEl(null);
        if (positionTimeoutRef.current) {
            clearTimeout(positionTimeoutRef.current);
        }
    }, []);

    // CLEANUP TIMEOUT ON UNMOUNT
    useEffect(() => {
        return () => {
            if (positionTimeoutRef.current) {
                clearTimeout(positionTimeoutRef.current);
            }
        };
    }, []);

    // MEMOIZE POPOVER CONTENT TO PREVENT UNNECESSARY RE-RENDERS
    const memoizedPopoverContent = useMemo(
        () => (
            <Box
                sx={{
                    textAlign: "left",
                    lineHeight: 1.5,
                    padding: { xs: 1, sm: 1.5 },
                    minWidth: { xs: 180, sm: 200 },
                    maxWidth: { xs: 250, sm: 300 },
                    [theme.breakpoints.down("sm")]: {
                        fontSize: "0.75rem",
                    },
                    [theme.breakpoints.up("sm")]: {
                        fontSize: "0.875rem",
                    },
                }}
            >
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: { xs: 0.5, sm: 1 },
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                >
                    {decodeHtmlEntities(fullName?.trim() || "")}
                </Typography>
                {email?.trim() && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 0.5, sm: 1 },
                            marginBottom: { xs: 0.25, sm: 0.5 },
                        }}
                    >
                        <EmailIcon
                            sx={{
                                fontSize: { xs: 14, sm: 16 },
                                color: "primary.main",
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                            }}
                        >
                            {email.trim()}
                        </Typography>
                    </Box>
                )}
                {serviceCenter?.trim() && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 0.5, sm: 1 },
                            marginBottom: { xs: 0.25, sm: 0.5 },
                        }}
                    >
                        <LocationOnIcon
                            sx={{
                                fontSize: { xs: 14, sm: 16 },
                                color: red[500],
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                            }}
                        >
                            {serviceCenter.trim()}
                        </Typography>
                    </Box>
                )}
            </Box>
        ),
        [fullName, email, serviceCenter, theme]
    );

    return (
        <>
            <Box
                ref={containerRef}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                sx={{ cursor: "help" }}
                aria-owns={open ? "user-info-popover" : undefined}
                aria-haspopup="true"
            >
                {children}
            </Box>
            <Popover
                id="user-info-popover"
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: popoverPosition,
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: popoverPosition === "top" ? "bottom" : "top",
                    horizontal: "left",
                }}
                disableRestoreFocus
                sx={{
                    pointerEvents: "none",
                }}
            >
                <Box sx={{ pointerEvents: "auto" }}>
                    {memoizedPopoverContent}
                </Box>
            </Popover>
        </>
    );
};

export default UserInfoTooltip;
