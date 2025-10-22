import Swal, { SweetAlertOptions } from "sweetalert2";
import "@css/sweetalert2-backdrop.css";

const closeSwalSafely = () => {
    try {
        // First try the standard way
        Swal.close();
        
        // If that doesn't work, try to find and remove the container
        const container = document.querySelector('.swal2-container');
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
        
        // Remove any backdrop
        const backdrop = document.querySelector('.swal2-backdrop-show');
        if (backdrop && backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
        }
    } catch (error) {
        // Error closing Swal
    }
};

export const showSuccessAlert = (
    text?: string,
    html?: string,
): Promise<boolean> => {
    return new Promise((resolve) => {
        const swalInstance = Swal.fire({
            title: "Success!",
            text: html ? undefined : text,
            html: html || undefined,
            icon: "success",
            confirmButtonText: "OK",
            showConfirmButton: true,
            padding: "2rem",
            width: "700px",
            allowOutsideClick: false,
            didOpen: () => {
                // Alert opened
            },
            willClose: () => {
                // Alert will close
            }
        });

        // Add click handler to the confirm button
        const confirmButton = document.querySelector('.swal2-confirm');
        if (confirmButton) {
            confirmButton.addEventListener('click', () => {
                closeSwalSafely();
                resolve(true);
            });
        }

        // Fallback in case the button click doesn't work
        swalInstance.then(() => {
            closeSwalSafely();
            resolve(true);
        }).catch(() => {
            closeSwalSafely();
            resolve(false);
        });
    });
};

export const showConfirmationAlert = async (
    text?: string,
    html?: string,
): Promise<boolean> => {
    return new Promise((resolve) => {
        const swalInstance = Swal.fire({
            title: "Confirm Ticket Submission",
            text: html ? undefined : text,
            html: html || undefined,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Create it!",
            cancelButtonText: "Cancel",
            allowOutsideClick: false,
            width: '640px',
            didOpen: () => {
                // Confirmation alert opened
            },
            willClose: () => {
                // Confirmation alert will close
            }
        });

        // Add click handlers to both buttons
        const confirmButton = document.querySelector('.swal2-confirm');
        const cancelButton = document.querySelector('.swal2-cancel');

        if (confirmButton) {
            confirmButton.addEventListener('click', () => {
                closeSwalSafely();
                resolve(true);
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                closeSwalSafely();
                resolve(false);
            });
        }

        // Fallback
        swalInstance.then((result) => {
            closeSwalSafely();
            resolve(result.isConfirmed);
        }).catch(() => {
            closeSwalSafely();
            resolve(false);
        });
    });
};
