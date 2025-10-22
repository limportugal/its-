import { Box } from "@mui/material";

interface FormBoxProps {
    children: React.ReactNode;
}

const FormBox: React.FC<FormBoxProps> = ({ children }) => {
    return (
        <Box
            sx={{ width: "100%" }}
            marginBottom={3}
            marginTop={1}
        >
            {children}
        </Box>
    );
};

export default FormBox;
