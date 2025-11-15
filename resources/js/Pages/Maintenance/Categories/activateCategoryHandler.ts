import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from "@/Reuseable/helpers/statusChangeAlerts";
import { activateCategoryData } from "@/Reuseable/api/maintenance/categoryApi";
import { SystemCategory } from "@/Reuseable/types/system-categories.types";

export const handleActivateCategory = async (row: SystemCategory, refetch: () => void) => {
    const confirmed = await showConfirmationAlert(
        "Activate Category",
        undefined,
        `Are you sure you want to activate <span style="color: #1565c0;">"${row.category_name}"</span>?`,
    );

    if (!confirmed) {
        return;
    }

    return activateCategoryData(row.id)
        .then(async () => {
            await showSuccessAlert(
                undefined,
                `<span style="color: #1565c0;">"${row.category_name}"</span> has been activated successfully.`,
            );
            refetch();
        })
        .catch(async () => {
            await showErrorAlert(
                undefined,
                `<span style="color: #1565c0;">"${row.category_name}"</span> could not be activated.
                <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`,
            );
        });
};

