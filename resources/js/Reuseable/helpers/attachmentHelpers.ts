/**
 * Helper functions for handling attachment URLs and operations
 */

/**
 * Construct attachment URL using UUID
 * @param uuid - The attachment UUID
 * @returns The complete attachment URL
 */
export const getAttachmentUrlByUuid = (uuid: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/attachment/${uuid}`;
};

/**
 * Construct attachment URL using file path (legacy method)
 * @param filePath - The file path from S3
 * @returns The complete attachment URL
 */
export const getAttachmentUrlByPath = (filePath: string): string => {
    if (!filePath) return "";
    
    const baseUrl = window.location.origin;
    
    // Parse the S3 path: attachments/2025/09/07/filename.ext
    const pathParts = filePath.split('/');
    
    if (pathParts.length >= 4 && pathParts[0] === 'attachments') {
        const year = pathParts[1];
        const month = pathParts[2];
        const date = pathParts[3];
        const filename = pathParts[4];
        return `${baseUrl}/attachments/${year}/${month}/${date}/${filename}`;
    } else {
        // Fallback for other file paths
        return `${baseUrl}/${encodeURIComponent(filePath)}`;
    }
};

/**
 * Get the best available attachment URL (prefer UUID, fallback to path)
 * @param attachment - The attachment object
 * @returns The complete attachment URL
 */
export const getAttachmentUrl = (attachment: any): string => {
    // Prefer UUID if available
    if (attachment?.uuid) {
        return getAttachmentUrlByUuid(attachment.uuid);
    }
    
    // Fallback to file path
    if (attachment?.file_path) {
        return getAttachmentUrlByPath(attachment.file_path);
    }
    
    return "";
};

/**
 * Get attachment filename from various sources
 * @param attachment - The attachment object
 * @returns The filename
 */
export const getAttachmentFilename = (attachment: any): string => {
    return attachment?.original_name || 
           attachment?.file_path?.split('/').pop() || 
           'Unknown file';
};
