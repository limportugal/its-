import React from 'react';
import Swal from 'sweetalert2';

interface FileSizeAlertProps {
    fileName: string;
    fileSize: number;
    maxSize: number;
}

const FileSizeAlert = ({ fileName, fileSize, maxSize }: FileSizeAlertProps) => {
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const maxSizeFormatted = formatFileSize(maxSize);
    const fileSizeFormatted = formatFileSize(fileSize);

    return Swal.fire({
        icon: 'warning',
        title: 'File Size Exceeded',
        html: `
            <div style="text-align: left; padding: 20px 0;">
                <div style="margin-bottom: 15px;">
                    <strong style="color: #d32f2f; font-size: 16px;">⚠️ File: ${fileName}</strong>
                </div>
                <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800; margin-bottom: 15px;">
                    <div style="margin-bottom: 8px;">
                        <span style="font-weight: 600; color: #e65100;">Current Size:</span>
                        <span style="color: #d32f2f; font-weight: 700; margin-left: 8px;">${fileSizeFormatted}</span>
                    </div>
                    <div>
                        <span style="font-weight: 600; color: #2e7d32;">Maximum Allowed:</span>
                        <span style="color: #2e7d32; font-weight: 700; margin-left: 8px;">${maxSizeFormatted}</span>
                    </div>
                </div>
                <div style="color: #666; font-size: 14px; line-height: 1.5;">
                    <p style="margin: 0;">💡 <strong>Tip:</strong> Try compressing your file or choose a smaller one to continue.</p>
                </div>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#1976d2',
        width: '500px',
        customClass: {
            popup: 'file-size-alert-popup',
            confirmButton: 'file-size-alert-btn'
        },
        willClose: () => {
            Swal.getPopup()?.remove();
            Swal.getContainer()?.remove();
        },
        didOpen: () => {
            // FORCE HIGH Z-INDEX TO APPEAR ABOVE ALL DIALOGS
            setTimeout(() => {
                const container = document.querySelector('.swal2-container') as HTMLElement;
                const popup = document.querySelector('.swal2-popup') as HTMLElement;
                const backdrop = document.querySelector('.swal2-backdrop') as HTMLElement;
                
                if (container) {
                    container.style.zIndex = '999999';
                    container.style.position = 'fixed';
                }
                if (popup) {
                    popup.style.zIndex = '999999';
                    popup.style.position = 'relative';
                }
                if (backdrop) {
                    backdrop.style.zIndex = '999998';
                    backdrop.style.position = 'fixed';
                }
            }, 100);
        }
    });
};

export default FileSizeAlert;
