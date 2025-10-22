import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from "@/Reuseable/helpers/statusChangeAlerts";
import { inactivatePriorityData } from "@/Reuseable/api/maintenance/priorityApi";

export const handleInactivatePriority = async (row: any, refetch: () => void) => {
    try {
        // SHOW CONFIRMATION DIALOG
        const confirmed = await showConfirmationAlert(
            "Inactivate Priority",
            undefined,
            `Are you sure you want to inactivate <span style="color: #1565c0;">"${row.priority_name}"</span>?`,
        );

        if (!confirmed) {
            return; // User cancelled the operation
        }

        // INACTIVATE THE PRIORITY
        await inactivatePriorityData(row.id);

        await showSuccessAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.priority_name}"</span> has been inactivated successfully.`,
        );
        refetch();
    } catch (error) {
        await showErrorAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.priority_name}"</span> could not be inactivated. 
            <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`,
        );
    }
};
