import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PowerOffIcon from '@mui/icons-material/PowerOff';

export const kebabMenuOptions = [
    { text: "Edit", icon: EditIcon, color: "info" },
    { text: "Delete", icon: DeleteOutlineIcon, color: "error" },
    { text: "Activate", icon: PowerSettingsNewIcon, color: "success" },
    { text: "Deactivate", icon: PowerOffIcon, color: "error" },
] as const;
