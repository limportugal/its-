import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from "@/Reuseable/helpers/statusChangeAlerts";
import { activateCompanyData } from "@/Reuseable/api/maintenance/companyApi";

export const handleActivateCompany = async (row: any, refetch: () => void) => {
    try {
        // SHOW CONFIRMATION DIALOG
        const confirmed = await showConfirmationAlert(
            "Activate Company",
            undefined,
            `Are you sure you want to activate <span style="color: #1565c0;">"${row.company_name}"</span>?`,
        );

        if (!confirmed) {
            return; // User cancelled the operation
        }

        // ACTIVATE THE COMPANY
        await activateCompanyData(row.id);

        await showSuccessAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.company_name}"</span> has been activated successfully.`,
        );
        refetch();
    } catch (error) {
        await showErrorAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.company_name}"</span> could not be activated. 
            <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`,
        );
    }
};
