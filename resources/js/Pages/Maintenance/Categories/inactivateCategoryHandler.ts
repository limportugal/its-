import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from "@/Reuseable/helpers/statusChangeAlerts";
import { inactivateCategoryData } from "@/Reuseable/api/maintenance/categoryApi";
import { SystemCategory } from "@/Reuseable/types/system-categories.types";

export const handleInactivateCategory = async (row: SystemCategory, refetch: () => void) => {
    const confirmed = await showConfirmationAlert(
        "Inactivate Category",
        undefined,
        `Are you sure you want to inactivate <span style="color: #1565c0;">"${row.category_name}"</span>?`,
    );

    if (!confirmed) {
        return;
    }

    return inactivateCategoryData(row.id)
        .then(async () => {
            await showSuccessAlert(
                undefined,
                `<span style="color: #1565c0;">"${row.category_name}"</span> has been inactivated successfully.`,
            );
            refetch();
        })
        .catch(async () => {
            await showErrorAlert(
                undefined,
                `<span style="color: #1565c0;">"${row.category_name}"</span> could not be inactivated.
                <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`,
            );
        });
};

