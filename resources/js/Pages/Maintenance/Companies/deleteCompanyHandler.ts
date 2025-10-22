import { showDeleteConfirmationAlert, showDeletedSuccessAlert, showDeleteErrorAlert } from "@/Reuseable/helpers/deleteComfirmationAlerts";
import { deleteCompanyData } from "@/Reuseable/api/maintenance/companyApi";
import Swal from "sweetalert2";

export const handleDeleteCompany = async (row: any, refetch: () => void) => {
    const confirmed = await showDeleteConfirmationAlert(
        undefined,
        `Do you really want to delete this <span style="color: #1565c0;">"${row.company_name}"</span>?<br/> 
        <span style="font-weight: 500;">This action cannot be undone.</span>`,
    );

    if (confirmed) {
        try {
            // Delete the company
            await deleteCompanyData(row.id);

            await showDeletedSuccessAlert(
                undefined,
                `<span style="color: #1565c0;">"${row.company_name}"</span> has been deleted successfully.`,
            );
            refetch();
        } catch (error) {
            await showDeleteErrorAlert(
                undefined,
                `<span style="color: #1565c0;">"${row.company_name}"</span> could not be deleted. 
                <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`,
            );
        }
    }
}; 