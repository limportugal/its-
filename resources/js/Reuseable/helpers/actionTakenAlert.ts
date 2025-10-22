import Swal from "sweetalert2";
import "../../../css/sweetalert2-backdrop.css";

export const showActionTakenAlert = async (
    text?: string,
    html?: string
): Promise<boolean> => {
    const result = await Swal.fire({
        title: "Success!",
        text: html ? undefined : text,
        html: html || undefined,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        padding: "2rem",
        width: "640px",
        showConfirmButton: false,
        allowOutsideClick: false,
        willClose: () => {
            Swal.getPopup()?.remove();
            Swal.getContainer()?.remove();
        }
    });

    return true;
};

export const showActionTakenErrorAlert = async (
    text?: string,
    html?: string
): Promise<void> => {
    await Swal.fire({
        title: "Action Failed",
        text: html ? undefined : text,
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
        willClose: () => {
            Swal.getPopup()?.remove();
            Swal.getContainer()?.remove();
        }
    });
};
