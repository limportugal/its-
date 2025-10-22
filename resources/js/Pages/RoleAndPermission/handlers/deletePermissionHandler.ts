import { showDeleteConfirmationAlert, showDeletedSuccessAlert, showDeleteErrorAlert } from "@/Reuseable/helpers/deleteComfirmationAlerts";
import { deletePermissionData } from "@/Reuseable/api/rbac/permissionApi";
import Swal from "sweetalert2";

export const handleDeletePermission = async (row: any, refetch: () => void) => {
    const confirmed = await showDeleteConfirmationAlert(
        undefined,
        `Do you really want to delete this <span style="color: #1565c0;">"${row.name}"</span>?<br/> 
        <span style="font-weight: 500;">This action cannot be undone.</span>`,
    );

    if (confirmed) {
        try {
            // Show loading state
            Swal.fire({
                title: "Deleting...",
                html: `Deleting <span style="color: #1565c0;">"${row.name}"</span>...`,
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            await deletePermissionData(row.id);
            Swal.close();
            
            await showDeletedSuccessAlert(
                undefined,
                `<span style="color: #1565c0;">"${row.name}"</span> has been deleted successfully.`,
            );
            refetch();
        } catch (error) {
            Swal.close();
            await showDeleteErrorAlert(
                undefined,
                `<span style="color: #1565c0;">"${row.name}"</span> could not be deleted. 
                <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`,
            );
        }
    }
}; 