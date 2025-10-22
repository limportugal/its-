import Swal from 'sweetalert2';

interface ChangePasswordErrorNotificationProps {
    message?: string;
    onConfirm?: () => void;
}

export const showChangePasswordError = (props?: ChangePasswordErrorNotificationProps) => {
    return Swal.fire({
        icon: "error",
        title: '<span style="font-size: 24px; font-weight: 700;">Access Denied</span>',
        html: `
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 15px 0;">
                <div style="text-align: center;">
                    <div style="color: #dc3545; font-size: 20px; font-weight: 700; margin-bottom: 15px;">
                        Permission Required
                    </div>
                    <div style="color: #495057; font-size: 16px; line-height: 1.6; font-weight: 500;">
                        ${props?.message || 'You do not have permission to perform this action.'}
                    </div>
                </div>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
        width: "500px",
        allowOutsideClick: false,
        customClass: {
            popup: 'animated fadeInUp'
        },
        willClose: () => {
            Swal.getPopup()?.remove();
            Swal.getContainer()?.remove();
            if (props?.onConfirm) {
                props.onConfirm();
            }
        }
    });
};
