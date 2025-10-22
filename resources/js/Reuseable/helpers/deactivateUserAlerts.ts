import Swal, { SweetAlertOptions } from "sweetalert2";
import "../../../css/sweetalert2-backdrop.css";

// SUCCESS ALERT
export const showDeactivatedSuccessAlert = async (
    text?: string,
    html?: string,
): Promise<void> => {
    const options: SweetAlertOptions = {
        title: "Deactivated!",
        text: html ? undefined : text,
        html: html || undefined,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
        allowOutsideClick: false,
        width: "640px",
        backdrop: true,
        customClass: {
            confirmButton: "swal2-confirm",
        },
        willClose: () => {
            Swal.getPopup()?.remove();
            Swal.getContainer()?.remove();
        }
    };

    await Swal.fire(options);
};

// CONFIRMATION ALERT
export const showDeactivateConfirmationAlert = async (
    text?: string,
    html?: string,
): Promise<boolean> => {
    const options: SweetAlertOptions = {
        title: "Confirm Deactivation",
        text: text || undefined,
        html: html || undefined,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, deactivate it!",
        cancelButtonText: "No, cancel",
        allowOutsideClick: false,
        width: "640px",
        backdrop: true,
        customClass: {
            confirmButton: "swal2-deactivate",
            cancelButton: "swal2-cancel",
        },
        focusConfirm: false,
        focusCancel: false,
        returnFocus: false,
        didOpen: () => {
            const appContainer = document.getElementById('app');
            if (appContainer) {
                appContainer.removeAttribute('aria-hidden');
            }
        },
        willClose: () => {
            const appContainer = document.getElementById('app');
            if (appContainer) {
                appContainer.removeAttribute('aria-hidden');
            }
        }
    };

    try {
        const result = await Swal.fire(options);
        if (result.isDismissed) {
            Swal.getPopup()?.remove();
            Swal.getContainer()?.remove();
            return false;
        }
        return result.isConfirmed;
    } catch (error) {
        Swal.getPopup()?.remove();
        Swal.getContainer()?.remove();
        return false;
    }
};

// ERROR ALERT
export const showDeactivateErrorAlert = async (
    text?: string,
    html?: string,
): Promise<void> => {
    await Swal.fire({
        title: "Oops! An error occurred",
        text: text || undefined,
        html: html || undefined,
        icon: "error",
        allowOutsideClick: false,
        backdrop: true,
        width: "640px",
        customClass: {
            confirmButton: "swal2-confirm",
        },
    }).then(() => {
        Swal.getPopup()?.remove();
        Swal.getContainer()?.remove();
    });
};
