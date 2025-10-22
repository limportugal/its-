import Swal from "sweetalert2";
import "../../../css/sweetalert2-backdrop.css";

export const fetchingErrorAlert = (text?: string) => {
    Swal.fire({
        icon: "info",
        title: "No Data Found",
        html:
            text ||
            "We’re having trouble retrieving the data.<br>Please try again later,<br>or contact support if the issue persists.",
        allowOutsideClick: false,
        confirmButtonText: "OK",
    })
        .then((result) => {
            if (result.isConfirmed) {
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 500);
            } else {
                onErrorAlert("An unexpected error occurred.");
            }
        })
        .catch(() => {
            onErrorAlert(
                "An unexpected error occurred while showing the alert.",
            );
        });
};

export const onErrorAlert = async (text?: string): Promise<void> => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: text,
        allowOutsideClick: false,
        confirmButtonText: "OK",
    }).then(() => {
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 500);
    });
};
