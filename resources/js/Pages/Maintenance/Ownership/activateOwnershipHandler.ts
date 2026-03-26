import { activateOwnershipData } from "@/Reuseable/api/maintenance/ownershipApi";
import {
    showConfirmationAlert,
    showErrorAlert,
    showSuccessAlert,
} from "@/Reuseable/helpers/statusChangeAlerts";

export const handleActivateOwnership = async (row: any, refetch: () => void) => {
    try {
        const confirmed = await showConfirmationAlert(
            "Activate Ownership",
            undefined,
            `Are you sure you want to activate <span style="color: #1565c0;">"${row.ownership_name}"</span>?`
        );

        if (!confirmed) return;

        await activateOwnershipData(row.id);
        await showSuccessAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.ownership_name}"</span> has been activated successfully.`
        );
        refetch();
    } catch (error) {
        await showErrorAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.ownership_name}"</span> could not be activated. 
            <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`
        );
    }
};
