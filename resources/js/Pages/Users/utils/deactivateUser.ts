import { showDeactivateConfirmationAlert, showDeactivatedSuccessAlert, showDeactivateErrorAlert } from "@/Reuseable/helpers/deactivateUserAlerts";
import { deactivateUserData } from "@/Reuseable/api/User/deactivate-user.api";
import { useQueryClient } from "@tanstack/react-query";

export const handleDeactivateUser = async (row: any, refetch: () => void, queryClient?: any) => {
    const currentUserId = document.querySelector('meta[name="user-id"]')?.getAttribute('content');
    const isSelfDeactivation = currentUserId && row.id.toString() === currentUserId;
    
    let confirmMessage = `Are you sure you want to deactivate user <span style="color: #1976d2;">${row.name}</span>?`;
    
    if (isSelfDeactivation) {
        confirmMessage = `<strong style="color: #d32f2f;">Warning:</strong> You are deactivating your own account!<br><br>
            This will immediately log you out and you won't be able to login again until an administrator reactivates your account.<br><br>
            Are you sure you want to proceed?`;
    }
    
    const confirmed = await showDeactivateConfirmationAlert(
        undefined,
        confirmMessage
    );

    if (confirmed) {
        try {
            const response = await deactivateUserData(row.uuid, { user_id: row.id.toString() });
            
            if (response.self_deactivated) {
                await showDeactivatedSuccessAlert(
                    undefined,
                    `Your account has been deactivated successfully.<br><br>You will be logged out and redirected to the login page.`
                );
                
                // Redirect to login page after a short delay to allow alert to be seen
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
                return;
            }
            
            await showDeactivatedSuccessAlert(
                undefined,
                `User <span style="color: #1976d2;">${row.name}</span> has been deactivated successfully.`
            );
            
            // Invalidate getInactiveUsersData query to update the inactive users list immediately
            if (queryClient) {
                queryClient.invalidateQueries({ queryKey: ["getInactiveUsersData"] });
            }
            
            refetch();
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'An unknown error occurred';
            await showDeactivateErrorAlert(
                undefined,
                `<div style="text-align: center;">
                    <div style="margin-bottom: 8px;">
                        Unable to deactivate <span style="color: #1976d2; font-weight: 500;">"${row.name}"</span>
                    </div>
                    <div style="color: #d32f2f; font-size: 0.9em; margin-top: 4px;">
                        ${errorMessage}
                    </div>
                </div>`
            );
        }
    }
}; 