import Swal, { SweetAlertOptions } from "sweetalert2";
import "../../../css/sweetalert2-backdrop.css";

// SUCCESS ALERT
export const showDeletedSuccessAlert = async (
    text?: string,
    html?: string,
): Promise<void> => {
    const options: SweetAlertOptions = {
        title: "Successfully Deleted!",
        text: html ? undefined : text,
        html: html || undefined,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        allowOutsideClick: false,
        width: "500px",
        backdrop: true,
        customClass: {
            popup: "swal2-modern-success",
            confirmButton: "swal2-confirm",
        },
        didOpen: () => {
            // Add success animation
            const popup = Swal.getPopup();
            if (popup) {
                popup.style.animation = "successBounce 0.6s ease-out";
            }
        },
        willClose: () => {
            Swal.getPopup()?.remove();
            Swal.getContainer()?.remove();
        }
    };

    await Swal.fire(options);
};

// CONFIRMATION ALERT
export const showDeleteConfirmationAlert = async (
    text?: string,
    html?: string,
): Promise<boolean> => {
    const options: SweetAlertOptions = {
        title: "Move to Trash",
        text: text || undefined,
        html: html || undefined,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Move to Trash",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        width: "520px",
        backdrop: true,
        customClass: {
            popup: "swal2-modern-confirm",
            confirmButton: "swal2-delete-modern",
            cancelButton: "swal2-cancel-modern",
            title: "swal2-title-modern",
            htmlContainer: "swal2-html-modern",
        },
        focusConfirm: false,
        focusCancel: false,
        returnFocus: false,
        didOpen: () => {
            const appContainer = document.getElementById('app');
            if (appContainer) {
                appContainer.removeAttribute('aria-hidden');
            }

            const popup = Swal.getPopup();
            if (popup) {
                popup.style.animation = "slideInUp 0.4s ease-out";

                setTimeout(() => {
                    const confirmBtn = popup.querySelector('.swal2-confirm') as HTMLElement;
                    if (confirmBtn) {
                        confirmBtn.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                        confirmBtn.style.color = '#ffffff';
                        confirmBtn.style.border = 'none';
                        confirmBtn.style.borderRadius = '12px';
                        confirmBtn.style.padding = '12px 28px';
                        confirmBtn.style.fontWeight = '600';
                        confirmBtn.style.fontSize = '14px';
                        confirmBtn.style.boxShadow = '0 4px 14px rgba(220, 38, 38, 0.25), 0 2px 4px rgba(220, 38, 38, 0.15)';
                        confirmBtn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                        confirmBtn.style.cursor = 'pointer';

                        // ADD HOVER EFFECT
                        confirmBtn.addEventListener('mouseenter', () => {
                            confirmBtn.style.background = 'linear-gradient(135deg, #b91c1c, #991b1b)';
                            confirmBtn.style.transform = 'translateY(-2px)';
                            confirmBtn.style.boxShadow = '0 8px 20px rgba(220, 38, 38, 0.35), 0 4px 8px rgba(220, 38, 38, 0.2)';
                        });

                        confirmBtn.addEventListener('mouseleave', () => {
                            confirmBtn.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                            confirmBtn.style.transform = 'translateY(0)';
                            confirmBtn.style.boxShadow = '0 4px 14px rgba(220, 38, 38, 0.25), 0 2px 4px rgba(220, 38, 38, 0.15)';
                        });
                    }
                }, 100);
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
export const showDeleteErrorAlert = async (
    text?: string,
    html?: string,
): Promise<void> => {
    await Swal.fire({
        title: "Deletion Failed",
        text: text || undefined,
        html: html || undefined,
        icon: "error",
        allowOutsideClick: false,
        backdrop: true,
        width: "500px",
        customClass: {
            popup: "swal2-modern-error",
            confirmButton: "swal2-confirm",
            title: "swal2-title-modern",
        },
        didOpen: () => {
            // Add error shake animation
            const popup = Swal.getPopup();
            if (popup) {
                popup.style.animation = "errorShake 0.5s ease-in-out";
            }
        },
    }).then(() => {
        Swal.getPopup()?.remove();
        Swal.getContainer()?.remove();
    });
};
