// src/hooks/useSwal.ts
import Swal from "sweetalert2";

export const useSwal = () => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });

    const confirmCancelRequest = async () => {
        return await swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "This action will cancel your cash advance request. You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it!",
            cancelButtonText: "No, keep it!",
            reverseButtons: true,
        });
    };

    const successAlert = (message: string) => {
        swalWithBootstrapButtons.fire({
            title: "Success!",
            text: message,
            icon: "success",
        });
    };

    const infoAlert = (message: string) => {
        swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: message,
            icon: "info",
        });
    };

    return { confirmCancelRequest, successAlert, infoAlert };
};
