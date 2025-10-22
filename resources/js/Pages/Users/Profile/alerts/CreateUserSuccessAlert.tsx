import Swal from 'sweetalert2';

interface UserRole {
    id: number;
    name: string;
}

interface UserApprover {
    id: number;
    approver_id: number;
    approver_name: string;
}

interface UserDetails {
    full_name: string;
    company: string;
    service_center: string;
    service_center_area: string;
    roles: UserRole[];
    approvers: UserApprover[];
}

interface CreateUserSuccessAlertProps {
    title?: string;
    userDetails: UserDetails;
    confirmButtonText?: string;
}

export const showCreateUserSuccessAlert = (props: CreateUserSuccessAlertProps) => {
    const { 
        title = 'User Created Successfully!', 
        userDetails,
        confirmButtonText = 'OK' 
    } = props;

    const rolesText = userDetails.roles.map(role => role.name).join(', ');
    const approversText = userDetails.approvers.map(approver => approver.approver_name).join(', ');

    return Swal.fire({
        icon: 'success',
        title: title,
        html: `<div style="text-align: center; padding: 0 8px;">
            <div style="
                background: white;
                border-radius: 8px;
                padding: 15px;
                border: 1px solid #e5e7eb;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            ">
                    <h4 style="
                        margin: 0 0 10px 0;
                        color: #374151;
                        font-size: 13px;
                        font-weight: 600;
                        text-align: left;
                    ">User Details:</h4>
                    
                    <div style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 8px 12px;
                        text-align: left;
                    ">
                                                 <div style="
                             display: flex;
                             flex-direction: column;
                             gap: 6px;
                         ">
                             <div style="
                                 display: flex;
                                 flex-direction: column;
                                 gap: 4px;
                             ">
                                 <span style="
                                     color: #6b7280;
                                     font-size: 12px;
                                     font-weight: 500;
                                 ">Full Name:</span>
                                 <span style="
                                     color: #111827;
                                     font-size: 13px;
                                     font-weight: 600;
                                     padding: 4px 8px;
                                     background: #f9fafb;
                                     border-radius: 4px;
                                     border: 1px solid #e5e7eb;
                                 ">${userDetails.full_name}</span>
                             </div>
                             
                             <div style="
                                 display: flex;
                                 flex-direction: column;
                                 gap: 4px;
                             ">
                                 <span style="
                                     color: #6b7280;
                                     font-size: 12px;
                                     font-weight: 500;
                                 ">Area:</span>
                                 <span style="
                                     color: #111827;
                                     font-size: 13px;
                                     font-weight: 600;
                                     padding: 4px 8px;
                                     background: #f9fafb;
                                     border-radius: 4px;
                                     border: 1px solid #e5e7eb;
                                 ">${userDetails.service_center_area}</span>
                             </div>
                             
                             <div style="
                                 display: flex;
                                 flex-direction: column;
                                 gap: 4px;
                             ">
                                 <span style="
                                     color: #6b7280;
                                     font-size: 12px;
                                     font-weight: 500;
                                 ">Roles:</span>
                                 <span style="
                                     color: #111827;
                                     font-size: 13px;
                                     font-weight: 600;
                                     padding: 4px 8px;
                                     background: #f9fafb;
                                     border-radius: 4px;
                                     border: 1px solid #e5e7eb;
                                 ">${rolesText}</span>
                             </div>
                         </div>
                         
                         <div style="
                             display: flex;
                             flex-direction: column;
                             gap: 6px;
                         ">
                             <div style="
                                 display: flex;
                                 flex-direction: column;
                                 gap: 4px;
                             ">
                                 <span style="
                                     color: #6b7280;
                                     font-size: 12px;
                                     font-weight: 500;
                                 ">Company:</span>
                                 <span style="
                                     color: #111827;
                                     font-size: 13px;
                                     font-weight: 600;
                                     padding: 4px 8px;
                                     background: #f9fafb;
                                     border-radius: 4px;
                                     border: 1px solid #e5e7eb;
                                 ">${userDetails.company}</span>
                             </div>
                             
                             <div style="
                                 display: flex;
                                 flex-direction: column;
                                 gap: 4px;
                             ">
                                 <span style="
                                     color: #6b7280;
                                     font-size: 12px;
                                     font-weight: 500;
                                 ">Service Center:</span>
                                 <span style="
                                     color: #111827;
                                     font-size: 13px;
                                     font-weight: 600;
                                     padding: 4px 8px;
                                     background: #f9fafb;
                                     border-radius: 4px;
                                     border: 1px solid #e5e7eb;
                                 ">${userDetails.service_center}</span>
                             </div>
                             
                             <div style="
                                 display: flex;
                                 flex-direction: column;
                                 gap: 4px;
                             ">
                                 <span style="
                                     color: #6b7280;
                                     font-size: 12px;
                                     font-weight: 500;
                                 ">Approvers:</span>
                                 <span style="
                                     color: #111827;
                                     font-size: 13px;
                                     font-weight: 600;
                                     padding: 4px 8px;
                                     background: #f9fafb;
                                     border-radius: 4px;
                                     border: 1px solid #e5e7eb;
                                 ">${approversText}</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>`,
        confirmButtonColor: '#28a745',
        confirmButtonText: confirmButtonText,
        width: "500px",
        allowOutsideClick: false,
        allowEscapeKey: true,
        customClass: {
            popup: 'animated fadeInUp',
            title: 'swal2-title-success',
            confirmButton: 'swal2-confirm-success'
        },
        showClass: {
            popup: 'animate__animated animate__fadeInUp'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutDown'
        },
        willClose: () => {
            Swal.getPopup()?.remove();
            Swal.getContainer()?.remove();
        }
    });
};
