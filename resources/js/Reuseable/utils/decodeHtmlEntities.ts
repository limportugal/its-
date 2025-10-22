export const decodeHtmlEntities = (text: string): string => {
    if (!text) return '';
    
    try {
        const decodedText = decodeURIComponent(escape(text));
        
        if (decodedText.includes('Ã')) {
            const textarea = document.createElement('textarea');
            textarea.innerHTML = decodedText;
            return textarea.value;
        }
        
        return decodedText;
    } catch (e) {
        return text;
    }
}; 