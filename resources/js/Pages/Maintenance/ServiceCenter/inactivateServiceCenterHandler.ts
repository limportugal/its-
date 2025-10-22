import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from "@/Reuseable/helpers/statusChangeAlerts";
import { inactivateServiceCenterData } from "@/Reuseable/api/maintenance/service-center.api";

export const handleInactivateServiceCenter = async (row: any, refetch: () => void) => {
    try {
        // SHOW CONFIRMATION DIALOG
        const confirmed = await showConfirmationAlert(
            "Inactivate Service Center",
            undefined,
            `Are you sure you want to inactivate <span style="color: #1565c0;">"${row.service_center_name}"</span>?`,
        );

        if (!confirmed) {
            return; // User cancelled the operation
        }

        // INACTIVATE THE SERVICE CENTER
        await inactivateServiceCenterData(row.id);

        await showSuccessAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.service_center_name}"</span> has been inactivated successfully.`,
        );
        refetch();
    } catch (error) {
        await showErrorAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.service_center_name}"</span> could not be inactivated. 
            <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`,
        );
    }
};