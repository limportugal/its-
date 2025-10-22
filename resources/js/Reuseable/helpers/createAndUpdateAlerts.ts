import Swal, { SweetAlertOptions } from "sweetalert2";
import "../../../css/sweetalert2-backdrop.css";

export const showSuccessAlert = (
    text?: string,
    html?: string,
    timer: number = 2000,
): Promise<boolean> => {
    return Swal.fire({
        title: "Success!",
        text: html ? undefined : text,
        html: html || undefined,
        icon: "success",
        confirmButtonText: "OK",
        timer: timer,
        showConfirmButton: false,
        timerProgressBar: true,
        padding: "2rem",
        allowOutsideClick: false,
        willClose: () => {
            Swal.getPopup()?.remove();
            Swal.getContainer()?.remove();
        }
    }).then(() => true)
        .catch(() => false);
};

export const showConfirmationAlert = async (
    text?: string,
    html?: string,
): Promise<boolean> => {
    const options: SweetAlertOptions = {
        title: "Confirm Save",
        text: html ? undefined : text,
        html: html || undefined,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Save it!",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        width: "640px",
        willClose: () => {
            Swal.getPopup()?.remove();
            Swal.getContainer()?.remove();
        }
    };

    try {
        const result = await Swal.fire(options);
        return result.isConfirmed || false;
    } catch (error) {
        // Cleanup on error
        Swal.getPopup()?.remove();
        Swal.getContainer()?.remove();
        return false;
    }
};
