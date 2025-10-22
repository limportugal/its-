import { PropsWithChildren } from "react";
import { Container, Box, Paper, useTheme, useMediaQuery, Typography } from "@mui/material";
import AnimatedBackground from "@/Layouts/components/animatedBackground";

// GUEST LAYOUT COMPONENT
export default function CreatePasswordLayout({ children, isLoading = false }: PropsWithChildren<{ isLoading?: boolean }>) {
    // MUI BREAKPOINTS MEDIA QUERY
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // RENDER THE PAGE
    return (
        <>
            <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
                <AnimatedBackground />
            </Box>
            <Box
                sx={{
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                    px: { xs: 0, sm: 4 }
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        maxWidth: { xs: "100%", sm: "600px", md: "960px", lg: "1024px", xl: "1280px" },
                    }}
                >
                    <Paper
                        variant="outlined"
                        elevation={0}
                        sx={{
                            width: "100%",
                            borderRadius: 2,
                            p: {
                                xs: 3,
                                sm: 5,
                                md: 4
                            },
                            px: {
                                xs: 2,
                                sm: 4,
                                md: 6
                            }
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mb: 2,
                            mt: -1
                        }}>
                        </Box>
                        <Box sx={{ position: 'relative', width: '100%' }}>
                            {children}
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* FOOTER */}
            <Box
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
                <Typography 
                    variant="body2" 
                    sx={{ 
                        fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" }, 
                        color: "rgba(255, 255, 255, 0.3)",
                        lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
                    }}
                >
                    © {new Date().getFullYear()}{" "}
                    <Box component="span" sx={{ display: "inline" }}>
                        <Box
                            component="a"
                            href="https://apsoft.com.ph/"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: "rgba(255, 255, 255, 0.5)",
                                textDecoration: "none",
                                transition: "color 0.3s ease",
                                "&:hover": {
                                    color: "rgba(255, 255, 255, 0.8)",
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Apsoft Inc.
                        </Box>{" "}
                        |{" "}
                        <Box
                            component="a"
                            href="https://phillogix.site/"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: "rgba(255, 255, 255, 0.5)",
                                textDecoration: "none",
                                transition: "color 0.3s ease",
                                "&:hover": {
                                    color: "rgba(255, 255, 255, 0.8)",
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Phillogix Systems, Inc.
                        </Box>{" "}
                        |{" "}
                        <Box
                            component="a"
                            href="https://ideaserv.site/"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: "rgba(255, 255, 255, 0.5)",
                                textDecoration: "none",
                                transition: "color 0.3s ease",
                                "&:hover": {
                                    color: "rgba(255, 255, 255, 0.8)",
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Ideaserv Systems, Inc.
                        </Box>
                    </Box>{" "}
                    | All Rights Reserved.
                </Typography>
            </Box>
        </>
    );
}
