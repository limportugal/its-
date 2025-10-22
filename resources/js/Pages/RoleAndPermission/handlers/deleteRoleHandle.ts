import { showDeleteConfirmationAlert, showDeletedSuccessAlert, showDeleteErrorAlert } from "@/Reuseable/helpers/deleteComfirmationAlerts";
import { deleteRoleData } from "@/Reuseable/api/rbac/roleApi";
import Swal from "sweetalert2";

export const handleDeleteRole = async (row: any, refetch: () => void) => {
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

            await deleteRoleData(row.id);
            Swal.close();
            
            await showDeletedSuccessAlert(
                undefined,
                `<span style="color: #1565c0;">"${row.name}"</span> has been deleted successfully.`,
            );
            refetch();
        } catch (error: any) {
            Swal.close();
            const errorMessage = error?.data?.message || 'An unknown error occurred';
            await showDeleteErrorAlert(
                undefined,
                `<div style="text-align: center;">
                    <div style="margin-bottom: 8px;">
                        Unable to delete <span style="color: #1565c0; font-weight: 500;">"${row.name}"</span>
                    </div>
                    <div style="color: #d32f2f; font-size: 0.9em; margin-top: 4px;">
                        ${errorMessage}
                    </div>
                </div>`
            );
        }
    }
}; 