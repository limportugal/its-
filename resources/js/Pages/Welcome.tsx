import { Box, Typography, Container, Button, Grid } from "@mui/material";
import { IoTicket } from "react-icons/io5";
import { Head } from "@inertiajs/react";
import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import "@/../../public/css/floatAnimation.css";
import SignInForm from "@/Pages/Tickets/TicketComponents/HeaderSignInForm";
import CreateTicket from "@/Pages/Tickets/CreateTicket";
import { useCreateTicketStore } from "@/stores/useCreateTicketStore";

import "@fontsource/geist-sans/800.css";
import "@fontsource-variable/inter";

const MotionBox = motion.create(Box);
const MotionSpan = motion.create("span");

export default function Welcome() {
    const { isDialogOpen, openDialog, closeDialog } = useCreateTicketStore();

    // ANIMATION STATE - TRIGGER ON MOUNT
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // TRIGGER ANIMATION AFTER MOUNT 
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    // MOTION VARIANTS - SMOOTH PORTFOLIO-STYLE ANIMATIONS (STAGGER FROM LEFT)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const heroTextVariants = {
        hidden: { 
            opacity: 0, 
            x: -30,
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1] as const,
            },
        },
    };

    const textItemVariants = {
        hidden: { 
            opacity: 0, 
            x: -30,
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1] as const,
            },
        },
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            x: 50,
            scale: 0.96,
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1] as const,
                delay: 0.1,
            },
        },
    };

    const verticalLineVariants = {
        hidden: {
            scaleY: 0,
            opacity: 0,
        },
        visible: {
            scaleY: 1,
            opacity: 1,
            transition: {
                scaleY: {
                    duration: 1.2,
                    ease: [0.25, 0.1, 0.25, 1] as const,
                },
                opacity: {
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1] as const,
                },
            },
        },
    };

    const footerVariants = {
        hidden: {
            opacity: 0,
            y: 15,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1] as const,
                delay: 0.2,
            },
        },
    };


    const signInFormVariants = {
        hidden: {
            opacity: 0,
            y: -50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1] as const,
                delay: 0.1,
            },
        },
    };

    // DIALOG HANDLERS
    const handleOpenCreateTicketDialog = () => {
        openDialog();
    };

    const handleCloseCreateTicketDialog = () => {
        closeDialog();
    };

    return (
        <Box
            sx={{
                height: "100vh",
                position: "relative",
                background: "linear-gradient(135deg, #1a237e 0%, #000051 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                opacity: 1,
                transition: "opacity 0.2s ease-in-out",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background: `
                        radial-gradient(circle at 20% 30%, rgba(41, 98, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(66, 165, 245, 0.1) 0%, transparent 50%)
                    `,
                    zIndex: 1,
                },
            }}
        >
            <Head title="Welcome">
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
                />
            </Head>

            {/* FLOATING ELEMENTS */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    perspective: "1000px",
                    "& > div": {
                        position: "absolute",
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.03)",
                        backdropFilter: "blur(5px)",
                        animation: "float 15s infinite ease-in-out",
                    },
                    "& > div:nth-of-type(1)": {
                        width: { xs: 80, sm: 100, md: 150 },
                        height: { xs: 80, sm: 100, md: 150 },
                        top: { xs: "8%", sm: "8%", md: "10%" },
                        left: { xs: "8%", sm: "8%", md: "10%" },
                    },
                    "& > div:nth-of-type(2)": {
                        width: { xs: 60, sm: 60, md: 100 },
                        height: { xs: 60, sm: 60, md: 100 },
                        top: { xs: "75%", sm: "65%", md: "62%" },
                        right: { xs: "10%", sm: "12%", md: "15%" },
                    },
                    "& > div:nth-of-type(3)": {
                        width: { xs: 70, sm: 80, md: 120 },
                        height: { xs: 70, sm: 80, md: 120 },
                        bottom: { xs: "12%", sm: "12%", md: "15%" },
                        left: { xs: "12%", sm: "15%", md: "20%" },
                    },
                }}
            >
                <Box />
                <Box />
                <Box />
            </Box>

            {/* Main Content Container */}
            <Container
                maxWidth="lg"
                sx={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    px: { xs: 2, sm: 3, md: 4 },
                    // iPhone 14 Pro Max specific optimizations
                    "@media (max-width: 430px)": {
                        px: 1.5,
                    },
                    // Safe area handling for notched devices
                    paddingTop: { xs: "env(safe-area-inset-top)", sm: 0 },
                    paddingBottom: { xs: "env(safe-area-inset-bottom)", sm: 0 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* MOBILE VIEW - OPTIMIZED FOR IPHONE 14 PRO MAX */}
                    <Box
                        sx={{
                            display: { xs: "flex", md: "none" },
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "100vh",
                            py: { xs: 1, sm: 2 },
                            mt: { xs: 4, sm: 0 },
                            px: { xs: 1.5, sm: 3 },
                            gap: { xs: 1.5, sm: 1.5 },
                            // Specific adjustments for different mobile sizes
                            "@media (max-height: 667px)": {
                                // iPhone SE, iPhone 8 and smaller screens
                                mt: 2,
                                gap: 1,
                                py: 0.5,
                            },
                            "@media (min-height: 800px) and (max-width: 430px)":
                                {
                                    // iPhone 14 Pro Max and similar tall phones
                                    mt: 6,
                                    gap: 2,
                                },
                            position: "relative",
                        }}
                    >
                        {/* TOP SECTION - LOGO */}
                        <MotionBox
                            initial="hidden"
                            animate={isVisible ? "visible" : "hidden"}
                            variants={cardVariants}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                px: { xs: 2, sm: 3 },
                                position: "relative",
                                zIndex: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: "white",
                                    borderRadius: { xs: 2.5, sm: 4 },
                                    p: { xs: 1.5, sm: 3 },
                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100%",
                                    maxWidth: { xs: 300, sm: 360 },
                                    "@media (max-width: 375px)": {
                                        maxWidth: 280,
                                        p: 1.2,
                                        borderRadius: 2,
                                    },
                                    "@media (min-width: 415px)": {
                                        maxWidth: 340,
                                        p: 2,
                                    },
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/img/logo.png"
                                    alt="Company Logo"
                                    loading="eager"
                                    decoding="sync"
                                    sx={{
                                        maxHeight: { xs: 40, sm: 50 },
                                        maxWidth: "100%",
                                        height: "auto",
                                        width: "auto",
                                        objectFit: "contain",
                                        "@media (max-width: 375px)": {
                                            maxHeight: 35,
                                        },
                                        "@media (min-width: 415px)": {
                                            maxHeight: 45,
                                        },
                                    }}
                                />
                            </Box>
                        </MotionBox>

                        {/* MIDDLE SECTION - TEXT CONTENT */}
                        <MotionBox
                            initial="hidden"
                            animate={isVisible ? "visible" : "hidden"}
                            variants={heroTextVariants}
                            sx={{
                                textAlign: "center",
                                color: "white",
                                px: { xs: 1, sm: 2 },
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                position: "relative",
                                zIndex: 2,
                            }}
                        >
                            <Typography
                                variant="h2"
                                component="h2"
                                sx={{
                                    fontWeight: 700,
                                    color: "#ffffff",
                                    fontSize: {
                                        xs: "1.75rem",
                                        sm: "2.25rem",
                                    },
                                    lineHeight: 1.1,
                                    letterSpacing: "-0.02em",
                                    textAlign: "center",
                                    textShadow:
                                        "0 4px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)",
                                    mb: { xs: 1, sm: 1 },
                                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
                                    whiteSpace: "nowrap",
                                    "@media (max-width: 375px)": {
                                        fontSize: "1.5rem",
                                        lineHeight: 1.2,
                                    },
                                    "@media (max-width: 320px)": {
                                        fontSize: "1.5rem",
                                        lineHeight: 1.2,
                                        mb: 0.8,
                                    },
                                }}
                            >
                                Internal Ticketing System
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: 16, sm: 20 },
                                    fontWeight: "600",
                                    mb: { xs: 0.5, sm: 0.5 },
                                    color: "rgba(255,255,255,0.95)",
                                    textTransform: "uppercase",
                                    letterSpacing: { xs: "0.8px", sm: "1.5px" },
                                    textShadow:
                                        "0 0 15px rgba(255,255,255,0.2)",
                                    whiteSpace: "nowrap",
                                    "@media (max-width: 375px)": {
                                        fontSize: 14,
                                        letterSpacing: "0.6px",
                                    },
                                    "@media (max-width: 320px)": {
                                        fontSize: "0.85rem",
                                        letterSpacing: "0.3px",
                                        mb: 0.6,
                                    },
                                    "@media (min-width: 415px)": {
                                        fontSize: 18,
                                        letterSpacing: "1px",
                                    },
                                }}
                            >
                                Streamline Your Support Process
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: 13, sm: 16 },
                                    fontWeight: "400",
                                    color: "rgba(255,255,255,0.85)",
                                    lineHeight: 1.5,
                                    mb: { xs: 0, sm: 0 },
                                    maxWidth: { xs: "95%", sm: "100%" },
                                    mx: "auto",
                                    "@media (max-width: 375px)": {
                                        fontSize: 12,
                                        lineHeight: 1.4,
                                        maxWidth: "98%",
                                    },
                                    "@media (min-width: 415px)": {
                                        fontSize: 15,
                                        lineHeight: 1.6,
                                        maxWidth: "90%",
                                    },
                                }}
                            >
                                Enhance support efficiency with a ticketing
                                solution. Optimize issue tracking, streamline
                                support workflows, and improve collaboration
                                across service centers with a scalable and
                                next-generation ticketing system.
                            </Typography>
                        </MotionBox>

                        {/* BOTTOM SECTION - CREATE TICKET BUTTON */}
                        <MotionBox
                            initial="hidden"
                            animate={isVisible ? "visible" : "hidden"}
                            variants={cardVariants}
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                width: "100%",
                                px: { xs: 2, sm: 3 },
                                position: "relative",
                                zIndex: 2,
                                pt: { xs: 0, sm: 0 },
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleOpenCreateTicketDialog}
                                fullWidth
                                sx={{
                                    fontSize: { xs: 14, sm: 16 },
                                    fontWeight: "500",
                                    textTransform: "uppercase",
                                    py: { xs: 1, sm: 1.5 },
                                    px: { xs: 2, sm: 3 },
                                    minHeight: { xs: 36, sm: 42 },
                                    boxShadow:
                                        "0 4px 16px rgba(25, 118, 210, 0.3)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: { xs: 1, sm: 1.5 },
                                    maxWidth: { xs: 300, sm: 360 },
                                    "@media (max-width: 375px)": {
                                        fontSize: 13,
                                        py: 0.8,
                                        px: 1.5,
                                        minHeight: 32,
                                        gap: 0.8,
                                        maxWidth: 280,
                                    },
                                    "@media (min-width: 415px)": {
                                        fontSize: 15,
                                        py: 1.2,
                                        px: 2.5,
                                        minHeight: 38,
                                        gap: 1.2,
                                        maxWidth: 340,
                                    },
                                    "&:hover": {
                                        boxShadow:
                                            "0 6px 20px rgba(25, 118, 210, 0.4)",
                                        transform: "translateY(-2px)",
                                    },
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <IoTicket size={20} />
                                CREATE TICKET
                            </Button>
                        </MotionBox>
                    </Box>

                    {/* DESKTOP VIEW - LEFT-RIGHT SPLIT LAYOUT */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            maxWidth: "1400px",
                            mx: "auto",
                            gap: 8,
                            position: "relative",
                        }}
                    >
                        {/* ANIMATED VERTICAL LINE */}
                        <MotionBox
                            initial="hidden"
                            animate={isVisible ? "visible" : "hidden"}
                            variants={verticalLineVariants}
                            style={{
                                originY: 0.5,
                            }}
                            sx={{
                                position: "absolute",
                                left: "50%",
                                top: "10%",
                                bottom: "10%",
                                width: "1px",
                                background:
                                    "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 20%, rgba(66,165,245,0.5) 50%, rgba(255,255,255,0.3) 80%, transparent 100%)",
                                transform: "translateX(-50%)",
                                transformOrigin: "center center",
                            }}
                        />
                        {/* LEFT SIDE - TEXT CONTENT */}
                        <MotionBox
                            initial="hidden"
                            animate={isVisible ? "visible" : "hidden"}
                            variants={containerVariants}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                textAlign: "left",
                                color: "white",
                                flex: 1,
                                pr: 4,
                            }}
                        >
                            {/* INTERNAL TICKETING SYSTEM TEXT - STAGGER ANIMATION */}
                            <MotionBox
                                variants={textItemVariants}
                                sx={{ width: "100%", mb: 1 }}
                            >
                                <Typography
                                    variant="h2"
                                    component="h2"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#ffffff",
                                        fontSize: { md: "3.5rem" },
                                        lineHeight: 1.1,
                                        textAlign: "left",
                                        textShadow:
                                            "0 4px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)",
                                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
                                    }}
                                >
                                    Internal
                                </Typography>
                            </MotionBox>
                            <MotionBox
                                variants={textItemVariants}
                                sx={{ width: "100%", mb: 3 }}
                            >
                                <Typography
                                    variant="h2"
                                    component="h2"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#ffffff",
                                        fontSize: { md: "3.5rem" },
                                        lineHeight: 1.1,
                                        textAlign: "left",
                                        textShadow:
                                            "0 4px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)",
                                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
                                    }}
                                >
                                    Ticketing System
                                </Typography>
                            </MotionBox>

                            {/* MIDDLE CONTENT - STAGGER ANIMATION */}
                            <MotionBox
                                variants={textItemVariants}
                                sx={{ width: "100%", mb: 2 }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: { md: 21 },
                                        fontWeight: "600",
                                        color: "rgba(255,255,255,0.95)",
                                        textTransform: "uppercase",
                                        letterSpacing: { md: "2px" },
                                        textShadow:
                                            "0 0 15px rgba(255,255,255,0.3)",
                                        fontFamily: "'Roboto', 'Arial', sans-serif",
                                        lineHeight: { md: 1.4 },
                                        textAlign: "left",
                                        width: "100%",
                                    }}
                                >
                                    Streamline Your Support Process
                                </Typography>
                            </MotionBox>
                            <MotionBox
                                variants={textItemVariants}
                                sx={{ width: "100%", mb: 5 }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: "rgba(255,255,255,0.85)",
                                        maxWidth: { md: 600 },
                                        lineHeight: { md: 1.6 },
                                        fontSize: { md: 18 },
                                        fontWeight: "300",
                                        textShadow:
                                            "0 0 8px rgba(255,255,255,0.15)",
                                        fontFamily: "'Roboto', 'Arial', sans-serif",
                                        textAlign: "left",
                                    }}
                                >
                                    Enhance support efficiency with a ticketing
                                    solution. Optimize issue tracking, streamline
                                    support workflows, and improve collaboration
                                    across service centers with a scalable and
                                    next-generation ticketing system.
                                </Typography>
                            </MotionBox>
                        </MotionBox>

                        {/* RIGHT SIDE - COMPANY LOGOS AND BUTTONS CARD */}
                        <MotionBox
                            initial="hidden"
                            animate={isVisible ? "visible" : "hidden"}
                            variants={cardVariants}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                flex: 1,
                                height: "100%",
                                pl: 4,
                            }}
                        >
                            {/* WHITE CARD CONTAINER */}
                            <Box
                                sx={{
                                    backgroundColor: "white",
                                    borderRadius: 3,
                                    p: 4,
                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 2,
                                    width: { md: 320 },
                                }}
                            >
                                {/* LOGO SECTION */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "100%",
                                        maxWidth: "280px",
                                    }}
                                >
                                    {/* MAIN LOGO */}
                                    <Box
                                        component="img"
                                        src="/img/logo.png"
                                        alt="Company Logo"
                                        loading="eager"
                                        decoding="sync"
                                        sx={{
                                            maxHeight: 45,
                                            maxWidth: "100%",
                                            height: "auto",
                                            width: "auto",
                                            objectFit: "contain",
                                        }}
                                    />
                                </Box>

                                {/* BUTTONS GRID */}
                                <Grid
                                    container
                                    spacing={1}
                                    sx={{ maxWidth: "280px", width: "100%" }}
                                >
                                    {/* CREATE TICKET BUTTON */}
                                    <Grid size={{ xs: 12 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={
                                                handleOpenCreateTicketDialog
                                            }
                                            fullWidth
                                            sx={{
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.5,
                                                textTransform: "uppercase",
                                                fontWeight: "500",
                                                py: 1.3,
                                                px: 2,
                                                minHeight: 44,
                                                fontSize: 14,
                                                boxShadow:
                                                    "0 4px 16px rgba(25, 118, 210, 0.3)",
                                                "&:hover": {
                                                    boxShadow:
                                                        "0 6px 20px rgba(25, 118, 210, 0.4)",
                                                    transform:
                                                        "translateY(-2px)",
                                                },
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            <IoTicket size={20} />
                                            CREATE A NEW TICKET
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </MotionBox>
                    </Box>
                </Box>
            </Container>

            {/* BACKGROUND GRADIENT GRID EFFECT */}
            <Box
                component="div"
                sx={{
                    position: "absolute",
                    top: "2%",
                    left: "50%",
                    width: "100%",
                    height: "185%",
                    background: `
                        linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px),
                        linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px)
                    `,
                    backgroundSize: {
                        xs: "25px 20px",
                        sm: "40px 32px",
                        md: "50px 40px",
                    },
                    transform:
                        "translate(-50%, -50%) perspective(1000px) rotateX(60deg)",
                    transformOrigin: "center center",
                    zIndex: 1,
                }}
            />

            {/* SIGN-IN FORM BUTTON */}
            <MotionBox
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={signInFormVariants}
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                }}
            >
                <SignInForm />
            </MotionBox>

            {/* CREATE TICKET DIALOG */}
            <CreateTicket
                open={isDialogOpen}
                handleClose={handleCloseCreateTicketDialog}
                ticket={undefined}
            />

            {/* FOOTER */}
            <MotionBox
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={footerVariants}
                sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.7)",
                    py: { xs: 1.5, sm: 2, md: 2 },
                    px: { xs: 2, sm: 0, md: 0 },
                    zIndex: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: { xs: 0.5, sm: 1 },
                        flexWrap: "wrap",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: {
                                xs: "0.7rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                            },
                            color: "rgba(255, 255, 255, 0.4)",
                            fontWeight: { xs: 300, sm: 400 },
                        }}
                    >
                        © {new Date().getFullYear()}
                    </Typography>
                    <Box
                        component="a"
                        href="https://apsoft.com.ph/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            textDecoration: "none",
                            fontSize: {
                                xs: "0.7rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                            },
                            fontWeight: 500,
                            px: { xs: 1, sm: 1.5 },
                            py: { xs: 0.3, sm: 0.4 },
                            borderRadius: { xs: 1, sm: 1.5 },
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                color: "rgba(255, 255, 255, 1)",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderColor: "rgba(255, 255, 255, 0.2)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        Apsoft
                    </Box>
                    <Box
                        component="a"
                        href="https://phillogix.online/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            textDecoration: "none",
                            fontSize: {
                                xs: "0.7rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                            },
                            fontWeight: 500,
                            px: { xs: 1, sm: 1.5 },
                            py: { xs: 0.3, sm: 0.4 },
                            borderRadius: { xs: 1, sm: 1.5 },
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                color: "rgba(255, 255, 255, 1)",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderColor: "rgba(255, 255, 255, 0.2)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        Phillogix
                    </Box>
                    <Box
                        component="a"
                        href="https://its.ideaserv.online/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            textDecoration: "none",
                            fontSize: {
                                xs: "0.7rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                            },
                            fontWeight: 500,
                            px: { xs: 1, sm: 1.5 },
                            py: { xs: 0.3, sm: 0.4 },
                            borderRadius: { xs: 1, sm: 1.5 },
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                color: "rgba(255, 255, 255, 1)",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderColor: "rgba(255, 255, 255, 0.2)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        Ideaserv
                    </Box>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: {
                                xs: "0.7rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                            },
                            color: "rgba(255, 255, 255, 0.4)",
                            fontWeight: { xs: 300, sm: 400 },
                        }}
                    >
                        All Rights Reserved.
                    </Typography>
                </Box>
            </MotionBox>
        </Box>
    );
}
