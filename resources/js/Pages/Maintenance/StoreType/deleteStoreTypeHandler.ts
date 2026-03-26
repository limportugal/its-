import { deleteStoreTypeData } from "@/Reuseable/api/maintenance/storeTypeApi";
import {
    showDeleteConfirmationAlert,
    showDeletedSuccessAlert,
    showDeleteErrorAlert,
} from "@/Reuseable/helpers/deleteComfirmationAlerts";

export const handleDeleteStoreType = async (row: any, refetch: () => void) => {
    const confirmed = await showDeleteConfirmationAlert(
        undefined,
        `Do you really want to delete this <span style="color: #1565c0;">"${row.store_type_name}"</span>?<br/> 
        <span style="font-weight: 500;">This action cannot be undone.</span>`
    );

    if (!confirmed) return;

    try {
        await deleteStoreTypeData(row.id);
        await showDeletedSuccessAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.store_type_name}"</span> has been deleted successfully.`
        );
        refetch();
    } catch (error) {
        await showDeleteErrorAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.store_type_name}"</span> could not be deleted. 
            <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`
        );
    }
};
