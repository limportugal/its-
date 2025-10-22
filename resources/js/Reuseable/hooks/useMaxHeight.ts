import { useMediaQuery } from "@mui/material";

const useMaxHeight = () => {
    const isSmallScreen = useMediaQuery("(max-width: 1359px)", { noSsr: true });
    const isLargeScreen = useMediaQuery("(min-width: 1536)");

    if (isSmallScreen) return "480px";
    if (isLargeScreen) return "810px";

    return "810px";
};

export default useMaxHeight;
