import { activateUserData } from "@/Reuseable/api/User/activate-user.api";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";

export const handleActivateUser = async (row: any, refetch: () => void, queryClient?: any) => {
    try {
        const result = await Swal.fire({
            title: "Activate User",
            html: `Are you sure you want to activate user <span style="color: #1976d2;">${row.name}</span>?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, activate",
            cancelButtonText: "Cancel",
            allowOutsideClick: false,
            width: "640px",
            backdrop: true,
            customClass: {
                confirmButton: "swal2-activate",
                cancelButton: "swal2-cancel",
            },
        });

        if (result.isConfirmed) {
            try {
                await activateUserData(row.uuid, { user_id: row.id.toString() });
                
                await Swal.fire({
                    title: "Activated!",
                    html: `User <span style="color: #1976d2;">${row.name}</span> has been activated successfully.`,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    width: "640px",
                    backdrop: true,
                });
                
                // Invalidate getActiveUsersData query to update the active users list immediately
                if (queryClient) {
                    queryClient.invalidateQueries({ queryKey: ["getActiveUsersData"] });
                }
                
                refetch();
            } catch (error: any) {
                const errorMessage = error?.data?.message || 'An unknown error occurred';
                
                await Swal.fire({
                    title: "Oops! An error occurred",
                    html: `<div style="text-align: center;">
                        <div style="margin-bottom: 8px;">
                            Unable to activate <span style="color: #1976d2; font-weight: 500;">"${row.name}"</span>
                        </div>
                        <div style="color: #d32f2f; font-size: 0.9em; margin-top: 4px;">
                            ${errorMessage}
                        </div>
                    </div>`,
                    icon: "error",
                    allowOutsideClick: false,
                    backdrop: true,
                    width: "640px",
                });
            }
        }
    } finally {
        // Clean up any remaining SweetAlert elements to prevent UI getting stuck
        Swal.getPopup()?.remove();
        Swal.getContainer()?.remove();
    }
}; 