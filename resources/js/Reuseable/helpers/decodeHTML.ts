/**
 * Utility function to decode HTML entities and fix UTF-8 encoding corruption
 * Handles common HTML entities like &amp;, &#x20B1;, &quot;, etc.
 * Also fixes common UTF-8 corruption like â‚± → ₱
 *
 * @param text - The text containing HTML entities or corrupted UTF-8 to decode
 * @returns The decoded text with HTML entities and UTF-8 corruption fixed
 */
export const decodeHTML = (text: string): string => {
    if (!text || typeof text !== 'string') return '';

    try {
        // First, create a temporary DOM element to handle HTML entity decoding
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        let decoded = textarea.value;

        // Fix common UTF-8 corruption issues
        const utf8Fixes: { [key: string]: string } = {
            'â‚±': '₱',     // Philippine Peso
            'â‚¬': '€',     // Euro
            'â„¢': '™',     // Trademark
            'â€': '"',     // Right double quotation mark
            'â€š': ',',     // Single low-9 quotation mark
            'â€ž': '"',     // Double low-9 quotation mark
            'â€¦': '…',     // Horizontal ellipsis
            'â€¡': '‡',     // Double dagger
            'â€°': '‰',     // Per mille sign
            'â€¹': '‹',     // Single left-pointing angle quotation mark
            'â€º': '›',     // Single right-pointing angle quotation mark
            'â€”': '—',     // Em dash
        };

        // Apply UTF-8 corruption fixes
        for (const [corrupted, correct] of Object.entries(utf8Fixes)) {
            decoded = decoded.replace(new RegExp(corrupted, 'g'), correct);
        }

        return decoded;
    } catch (error) {
        // Fallback: try basic decodeURIComponent if DOM method fails
        try {
            return decodeURIComponent(escape(text));
        } catch (fallbackError) {
            // Return original text if all decoding methods fail
            return text;
        }
    }
};

/**
 * React hook version for decoding HTML entities
 * Useful when you need to decode HTML in React components
 *
 * @param text - The text containing HTML entities to decode
 * @returns The decoded text
 */
export const useDecodeHTML = (text: string): string => {
    return decodeHTML(text);
};

export default decodeHTML;