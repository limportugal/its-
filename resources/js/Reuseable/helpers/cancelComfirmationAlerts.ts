import Swal, { SweetAlertOptions } from "sweetalert2";
import "../../../css/sweetalert2-backdrop.css";

// SUCCESS ALERT
export const showCancelSuccessAlert = async (
    text?: string,
    html?: string,
): Promise<void> => {
    const options: SweetAlertOptions = {
        title: "Canceled!",
        text: html ? undefined : text,
        html: html || undefined,
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        allowOutsideClick: false,
        width: "640px",
        backdrop: true,
        customClass: {
            confirmButton: "swal2-confirm",
        },
    };

    await Swal.fire(options);
};

// CONFIRMATION ALERT
export const showCancelConfirmationAlert = async (
    text?: string,
    html?: string,
): Promise<boolean> => {
    const options: SweetAlertOptions = {
        title: "Confirm Cancellation",
        text: text || undefined,
        html: html || undefined,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, confirm it!",
        cancelButtonText: "No, cancel",
        allowOutsideClick: false,
        width: "640px",
        backdrop: true,
        customClass: {
            confirmButton: "swal2-confirm",
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
export const showCancelErrorAlert = async (
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
        showConfirmButton: true,
        confirmButtonText: "OK",
        customClass: {
            confirmButton: "swal2-confirm",
        },
    });
};
