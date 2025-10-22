import Swal, { SweetAlertOptions } from "sweetalert2";
import "../../../css/sweetalert2-backdrop.css";

// GLOBAL CLEANUP FUNCTION
export const cleanupAllAlerts = (): void => {
    try {
        // Close any open SweetAlert instances
        Swal.close();
        
        // Remove all popup elements
        Swal.getPopup()?.remove();
        Swal.getContainer()?.remove();
        
        // Remove any remaining backdrop
        const backdrop = document.querySelector('.swal2-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        
        // Remove any remaining popup containers
        const containers = document.querySelectorAll('.swal2-container');
        containers.forEach(container => container.remove());
        
        // Remove any remaining popup elements
        const popups = document.querySelectorAll('.swal2-popup');
        popups.forEach(popup => popup.remove());
    } catch (error) {
        console.warn('Error during alert cleanup:', error);
    }
};

// CONFIRMATION ALERT FOR ACTIVATE/INACTIVATE
export const showConfirmationAlert = async (
    title: string,
    text?: string,
    html?: string,
): Promise<boolean> => {
    try {
        const result = await Swal.fire({
            title,
            text: html ? undefined : text,
            html: html || undefined,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, proceed",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#1976d2",
            cancelButtonColor: "#d32f2f",
            allowOutsideClick: false,
            backdrop: true,
            width: "640px",
            customClass: {
                confirmButton: "swal2-confirm",
                cancelButton: "swal2-cancel",
            },
            willClose: () => {
                Swal.getPopup()?.remove();
                Swal.getContainer()?.remove();
            }
        });

        return result.isConfirmed;
    } catch (error) {
        // Cleanup on error
        Swal.getPopup()?.remove();
        Swal.getContainer()?.remove();
        return false;
    }
};

// SUCCESS ALERT FOR ACTIVATE/INACTIVATE
export const showSuccessAlert = async (
    text?: string,
    html?: string,
): Promise<void> => {
    try {
        const options: SweetAlertOptions = {
            title: "Success!",
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
        
        // Additional cleanup after alert closes
        setTimeout(() => {
            cleanupAllAlerts();
        }, 100);
    } catch (error) {
        // Cleanup on error
        cleanupAllAlerts();
    }
};

// ERROR ALERT FOR ACTIVATE/INACTIVATE
export const showErrorAlert = async (
    text?: string,
    html?: string,
): Promise<void> => {
    try {
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
            willClose: () => {
                Swal.getPopup()?.remove();
                Swal.getContainer()?.remove();
            }
        });
    } catch (error) {
        // Cleanup on error
        cleanupAllAlerts();
    }
};
