import React from 'react';
import Swal from 'sweetalert2';

interface FileTypeAlertProps {
    fileName: string;
    fileType: string;
    allowedTypes: string[];
}

const FileTypeAlert = ({ fileName, fileType, allowedTypes }: FileTypeAlertProps) => {
    const formatFileType = (type: string): string => {
        const typeMap: { [key: string]: string } = {
            'application/pdf': 'PDF Document',
            'image/jpeg': 'JPEG Image',
            'image/jpg': 'JPG Image',
            'image/png': 'PNG Image',
            'image/gif': 'GIF Image',
            'image/webp': 'WebP Image',
            'text/plain': 'Text File',
            'application/msword': 'Word Document',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
            'application/vnd.ms-excel': 'Excel Spreadsheet',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
        };
        
        return typeMap[type] || type || 'Unknown File Type';
    };

    const formatAllowedTypes = (types: string[]): string => {
        const typeMap: { [key: string]: string } = {
            'application/pdf': 'PDF',
            'image/jpeg': 'JPEG',
            'image/jpg': 'JPG',
            'image/png': 'PNG',
        };
        
        return types.map(type => typeMap[type] || type).join(', ');
    };

    const fileTypeFormatted = formatFileType(fileType);
    const allowedTypesFormatted = formatAllowedTypes(allowedTypes);

    return Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        html: `
            <div style="text-align: left; padding: 20px 0;">
                <div style="margin-bottom: 15px;">
                    <strong style="color: #d32f2f; font-size: 16px;">❌ File: ${fileName}</strong>
                </div>
                <div style="background: #ffebee; padding: 15px; border-radius: 8px; border-left: 4px solid #f44336; margin-bottom: 15px;">
                    <div style="margin-bottom: 8px;">
                        <span style="font-weight: 600; color: #c62828;">Current Type:</span>
                        <span style="color: #d32f2f; font-weight: 700; margin-left: 8px;">${fileTypeFormatted}</span>
                    </div>
                    <div>
                        <span style="font-weight: 600; color: #2e7d32;">Allowed Types:</span>
                        <span style="color: #2e7d32; font-weight: 700; margin-left: 8px;">${allowedTypesFormatted}</span>
                    </div>
                </div>
                <div style="color: #666; font-size: 14px; line-height: 1.5;">
                    <p style="margin: 0;">💡 <strong>Tip:</strong> Please select a file with one of the allowed formats to continue.</p>
                </div>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#1976d2',
        width: '500px',
        customClass: {
            popup: 'file-type-alert-popup',
            confirmButton: 'file-type-alert-btn'
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

export default FileTypeAlert;
