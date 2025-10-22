import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from "@/Reuseable/helpers/statusChangeAlerts";
import { inactivateSystemData } from "@/Reuseable/api/maintenance/system.api";

export const handleInactivateSystem = async (row: any, refetch: () => void) => {
    try {
        // SHOW CONFIRMATION DIALOG
        const confirmed = await showConfirmationAlert(
            "Inactivate System",
            undefined,
            `Are you sure you want to inactivate <span style="color: #1565c0;">"${row.system_name}"</span>?`,
        );

        if (!confirmed) {
            return; // User cancelled the operation
        }

        // INACTIVATE THE SYSTEM
        await inactivateSystemData(row.id);

        await showSuccessAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.system_name}"</span> has been inactivated successfully.`,
        );
        refetch();
    } catch (error) {
        await showErrorAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.system_name}"</span> could not be inactivated. 
            <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`,
        );
    }
};
