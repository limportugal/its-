import { useEffect, useState } from "react";
import { Box } from "@mui/material";

const SpinnerLoader = () => {
    const [showImg, setShowImg] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowImg(false);
        }, 30000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                color: "white",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "20px",
                fontSize: "24px",
                fontWeight: "bold",
                backgroundColor: "#f2f4f7",
                backdropFilter: "blur(10px)",
                opacity: showImg ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
            }}
        >
            {showImg && (
                <img
                    src="/img/Spinner.svg"
                    alt="Loading..."
                    style={{
                        width: "25vw",
                        maxWidth: "280px",
                        height: "auto",
                        backgroundColor: "transparent",
                        display: "block",
                        margin: "0 auto",
                    }}
                />
            )}
        </Box>
    );
};

export default SpinnerLoader;
