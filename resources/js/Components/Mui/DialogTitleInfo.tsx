import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface DialogTitleInfoProps {
    title: React.ReactNode;
    subtitle?: string;
    showDivider?: boolean;
}

const DialogTitleInfo: React.FC<DialogTitleInfoProps> = ({
    title,
    subtitle,
}) => {
    return (
        <>
            <Box
                id="draggable-dialog-title"
                sx={(theme) => ({
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    padding: theme.spacing(2, 3),
                    backgroundColor: theme.palette.background.paper,
                    borderTopLeftRadius: theme.shape.borderRadius,
                    borderTopRightRadius: theme.shape.borderRadius,
                    cursor: 'move',
                })}
            >
                <Typography
                    component="div"
                    sx={(theme) => ({
                        textAlign: "flex-start",
                    })}
                >
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={(theme) => ({
                            fontSize: "1.25rem",
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            marginBottom: subtitle ? theme.spacing(0.5) : 0,
                            [theme.breakpoints.down("sm")]: {
                                fontSize: "1.25rem",
                            },
                        })}
                    >
                        {title}
                    </Typography>

                    {subtitle && (
                        <Typography
                            variant="subtitle1"
                            sx={(theme) => ({
                                fontSize: "0.9rem",
                                color: theme.palette.text.secondary,
                                [theme.breakpoints.down("sm")]: {
                                    fontSize: "0.8rem",
                                },
                            })}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Typography>
            </Box>
        </>
    );
};

export default DialogTitleInfo;
