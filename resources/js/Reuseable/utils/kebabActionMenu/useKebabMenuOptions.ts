import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { SvgIconProps } from "@mui/material";

interface MenuOption {
    text: string;
    icon?: React.ComponentType<SvgIconProps>;
    color?: "action" | "inherit" | "disabled" | "primary" | "error" | "info" | "success" | "warning" | "secondary";
}

const allKebabMenuOptions: MenuOption[] = [
    { text: "Edit", icon: EditIcon, color: "info" },
    { text: "Delete", icon: DeleteOutlineIcon, color: "error" },
    { text: "Activate", icon: PowerSettingsNewIcon, color: "success" },
    { text: "Inactivate", icon: PowerOffIcon, color: "error" },
];

export const useKebabMenuOptions = (status?: string) => {
    // Filter options based on status
    const kebabMenuOptions = allKebabMenuOptions.filter(option => {
        // If status is "active", don't show "Activate" option
        if (status === "active" && option.text === "Activate") {
            return false;
        }
        // If status is "inactive", don't show "Inactivate" option
        if (status === "inactive" && option.text === "Inactivate") {
            return false;
        }
        return true;
    });

    return { kebabMenuOptions };
};

export type KebabMenuOption = typeof allKebabMenuOptions[number]; 