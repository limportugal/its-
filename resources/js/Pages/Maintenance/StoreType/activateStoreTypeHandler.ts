import { activateStoreTypeData } from "@/Reuseable/api/maintenance/storeTypeApi";
import {
    showConfirmationAlert,
    showErrorAlert,
    showSuccessAlert,
} from "@/Reuseable/helpers/statusChangeAlerts";

export const handleActivateStoreType = async (row: any, refetch: () => void) => {
    try {
        const confirmed = await showConfirmationAlert(
            "Activate Store Type",
            undefined,
            `Are you sure you want to activate <span style="color: #1565c0;">"${row.store_type_name}"</span>?`
        );

        if (!confirmed) return;

        await activateStoreTypeData(row.id);
        await showSuccessAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.store_type_name}"</span> has been activated successfully.`
        );
        refetch();
    } catch (error) {
        await showErrorAlert(
            undefined,
            `<span style="color: #1565c0;">"${row.store_type_name}"</span> could not be activated. 
            <br/>Please try again later. If the problem persists, <br/>contact our support team for assistance.`
        );
    }
};
