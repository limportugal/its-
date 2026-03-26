import { inactivateOwnershipData } from "@/Reuseable/api/maintenance/ownershipApi";
import {
    showConfirmationAlert,
    showErrorAlert,
    showSuccessAlert,
} from "@/Reuseable/helpers/statusChangeAlerts";

export const handleInactivateOwnership = async (row: any, refetch: () => void) => {
    try {
        const confirmed = await showConfirmationAlert(
            "Inactivate Ownership",
            undefined,
            `Are you sure you want to inactivate <span style="color: #1565c0;">"${row.ownership_name}"</span>?`
        );

        if (!confirmed) return;

        await inactivateOwnershipData(row.id);
        await showSuccessAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.ownership_name}"</span> has been inactivated successfully.`
        );
        refetch();
    } catch (error) {
        await showErrorAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.ownership_name}"</span> could not be inactivated. 
            <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`
        );
    }
};
