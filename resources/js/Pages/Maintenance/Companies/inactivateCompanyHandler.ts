import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from "@/Reuseable/helpers/statusChangeAlerts";
import { inactivateCompanyData } from "@/Reuseable/api/maintenance/companyApi";

export const handleInactivateCompany = async (row: any, refetch: () => void) => {
    try {
        // SHOW CONFIRMATION DIALOG
        const confirmed = await showConfirmationAlert(
            "Inactivate Company",
            undefined,
            `Are you sure you want to inactivate <span style="color: #1565c0;">"${row.company_name}"</span>?`,
        );

        if (!confirmed) {
            return; // User cancelled the operation
        }

        // INACTIVATE THE COMPANY
        await inactivateCompanyData(row.id);

        await showSuccessAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.company_name}"</span> has been inactivated successfully.`,
        );
        refetch();
    } catch (error) {
        await showErrorAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.company_name}"</span> could not be inactivated. 
            <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`,
        );
    }
};
