import Swal from 'sweetalert2';

interface ChangePasswordSuccessNotificationProps {
    onConfirm?: () => void;
}

export const showChangePasswordSuccess = (props?: ChangePasswordSuccessNotificationProps) => {
    return Swal.fire({
        icon: "success",
        title: '<span style="font-size: 22px">Password Changed Successfully!</span>',
        html: `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 10px 0;">
                <div style="text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 15px;">🔐</div>
                    <div style="color: #28a745; font-size: 18px; font-weight: 600; margin-bottom: 10px;">
                        Your password has been updated successfully
                    </div>
                    <div style="color: #6c757d; font-size: 14px; line-height: 1.5;">
                        Your new password is now active. Please remember to keep it secure and don't share it with anyone.
                    </div>
                </div>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#28a745',
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
