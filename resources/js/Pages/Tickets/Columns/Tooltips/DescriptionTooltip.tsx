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
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import ComputerIcon from "@mui/icons-material/Computer";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import StoreIcon from "@mui/icons-material/Store";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TagIcon from "@mui/icons-material/Tag";

interface DescriptionTooltipProps {
    description: string;
    system?: string;
    categories?: Array<{ category_name: string }>;
    fsr_no?: string;
    store_code?: string;
    store_name?: string;
    address?: string;
}

const DescriptionTooltip: React.FC<DescriptionTooltipProps> = ({
    description,
    categories,
    system,
    fsr_no,
    store_code,
    store_name,
    address,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const categoryNames =
        categories?.map((cat) => cat.category_name).join(", ") ||
        "No categories";

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

                    // MORE ACCURATE POPOVER HEIGHT ESTIMATION
                    const estimatedPopoverHeight = isMobile ? 150 : 200;

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
                    width: "auto",
                    minWidth: { xs: 280, sm: 350 },
                    maxWidth: { xs: "90vw", sm: "80vw" },
                    [theme.breakpoints.down("sm")]: {
                        fontSize: "0.75rem",
                    },
                    [theme.breakpoints.up("sm")]: {
                        fontSize: "0.875rem",
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 0.75, sm: 1 },
                        marginBottom: { xs: 0.75, sm: 1 },
                    }}
                >
                    <DescriptionOutlinedIcon
                        sx={{
                            fontSize: { xs: 14, sm: 16 },
                            color: "primary.main",
                        }}
                    />
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                    >
                        Description
                    </Typography>
                </Box>
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        marginBottom: { xs: 1, sm: 1.5 },
                        textAlign: "left",
                        display: "block",
                        lineHeight: 1.5,
                        color: "text.primary",
                    }}
                >
                    {description}
                </Typography>

                {/* THIN DIVIDER */}
                <Box
                    sx={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "grey.300",
                        marginBottom: { xs: 1, sm: 1.5 },
                    }}
                />

                {/* TWO-COLUMN LAYOUT FOR OTHER FIELDS */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: { xs: 1, sm: 2 },
                        marginTop: { xs: 0.75, sm: 1 },
                    }}
                >
                    {/* LEFT COLUMN */}
                    <Box>
                        {/* SYSTEM SECTION */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: { xs: 0.75, sm: 1 },
                                marginTop: { xs: 0.75, sm: 1 },
                            }}
                        >
                            <ComputerIcon
                                sx={{
                                    fontSize: { xs: 14, sm: 16 },
                                    color: "primary.main",
                                }}
                            />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                }}
                            >
                                System
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                                marginLeft: { xs: 2, sm: 3 },
                            }}
                        >
                            {system || "No system"}
                        </Typography>

                        {/* FSR NO SECTION */}
                        {fsr_no && (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: { xs: 0.75, sm: 1 },
                                        marginTop: { xs: 0.75, sm: 1 },
                                    }}
                                >
                                    <TagIcon
                                        sx={{
                                            fontSize: { xs: 14, sm: 16 },
                                            color: "primary.main",
                                        }}
                                    />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                        }}
                                    >
                                        FSR No.
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                                        marginLeft: { xs: 2, sm: 3 },
                                    }}
                                >
                                    {fsr_no}
                                </Typography>
                            </>
                        )}

                        {/* CATEGORIES SECTION */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: { xs: 0.75, sm: 1 },
                                marginTop: { xs: 0.75, sm: 1 },
                            }}
                        >
                            <CategoryIcon
                                sx={{
                                    fontSize: { xs: 14, sm: 16 },
                                    color: "primary.main",
                                }}
                            />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                }}
                            >
                                Problem Categories
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                                marginLeft: { xs: 2, sm: 3 },
                            }}
                        >
                            {categoryNames}
                        </Typography>
                    </Box>

                    {/* RIGHT COLUMN */}
                    <Box>
                        {/* STORE CODE SECTION */}
                        {store_code && (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: { xs: 0.75, sm: 1 },
                                        marginTop: { xs: 0.75, sm: 1 },
                                    }}
                                >
                                    <QrCode2Icon
                                        sx={{
                                            fontSize: { xs: 14, sm: 16 },
                                            color: "primary.main",
                                        }}
                                    />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                        }}
                                    >
                                        Store Code
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                                        marginLeft: { xs: 2, sm: 3 },
                                    }}
                                >
                                    {store_code}
                                </Typography>
                            </>
                        )}

                        {/* STORE NAME SECTION */}
                        {store_name && (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: { xs: 0.75, sm: 1 },
                                        marginTop: { xs: 0.75, sm: 1 },
                                    }}
                                >
                                    <StoreIcon
                                        sx={{
                                            fontSize: { xs: 14, sm: 16 },
                                            color: "primary.main",
                                        }}
                                    />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                        }}
                                    >
                                        Store Name
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                                        marginLeft: { xs: 2, sm: 3 },
                                    }}
                                >
                                    {store_name}
                                </Typography>
                            </>
                        )}

                        {/* ADDRESS SECTION */}
                        {address && (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: { xs: 0.75, sm: 1 },
                                        marginTop: { xs: 0.75, sm: 1 },
                                    }}
                                >
                                    <LocationOnIcon
                                        sx={{
                                            fontSize: { xs: 14, sm: 16 },
                                            color: "primary.main",
                                        }}
                                    />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                        }}
                                    >
                                        Address
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                                        marginLeft: { xs: 2, sm: 3 },
                                    }}
                                >
                                    {address}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        ),
        [description, system, categoryNames, fsr_no, store_code, store_name, address, theme]
    );

    return (
        <>
            <Box
                ref={containerRef}
                display="flex"
                alignItems="center"
                gap={{ xs: 0.75, sm: 1 }}
                height="100%"
                sx={{ width: "100%", cursor: "help" }}
                aria-owns={open ? "description-popover" : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <DescriptionOutlinedIcon
                    color="primary"
                    sx={{ fontSize: { xs: 16, sm: 20 } }}
                />
                <Typography
                    sx={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        width: "100%",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                >
                    {description}
                </Typography>
            </Box>
            <Popover
                id="description-popover"
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

export default DescriptionTooltip;
