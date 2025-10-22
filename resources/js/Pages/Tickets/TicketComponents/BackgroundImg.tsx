import { Box } from "@mui/material";

const BgImg = () => {
    return (
        <Box
            sx={{
                position: "fixed", 
                top: 0,
                left: 0,
                width: "100vw", 
                height: "100vh", 
                zIndex: -100,
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: 'url("/img/background.png")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(150%)",
                    zIndex: -1,
                },
            }}
        />
    );
};

export default BgImg;
