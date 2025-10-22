import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from "@/Reuseable/helpers/statusChangeAlerts";
import { activatePriorityData } from "@/Reuseable/api/maintenance/priorityApi";

export const handleActivatePriority = async (row: any, refetch: () => void) => {
    try {
        // SHOW CONFIRMATION DIALOG
        const confirmed = await showConfirmationAlert(
            "Activate Priority",
            undefined,
            `Are you sure you want to activate <span style="color: #1565c0;">"${row.priority_name}"</span>?`,
        );

        if (!confirmed) {
            return; // User cancelled the operation
        }

        // ACTIVATE THE PRIORITY
        await activatePriorityData(row.id);

        await showSuccessAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.priority_name}"</span> has been activated successfully.`,
        );
        refetch();
    } catch (error) {
        await showErrorAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.priority_name}"</span> could not be activated. 
            <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`,
        );
    }
};
