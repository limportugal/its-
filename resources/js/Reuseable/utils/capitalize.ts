export const toTitleCase = (str: string) => {
    const exceptions = ["and", "or", "the", "of", "in", "for", "to", "a", "an"];
    const isAcronym = (word: string) => /^[A-Z]+$/.test(word); // CHECK IF THE WORD IS AN ACRONYM (ALL UPPERCASE)

    return (
        str
            .trim()
            .replace(/\s+/g, " ")
            .split(" ") // SPLIT THE STRING INTO WORDS
            .map((word, index) => {
                if (index === 0 || !exceptions.includes(word.toLowerCase())) {
                    if (isAcronym(word)) {
                        // IF THE WORD IS AN ACRONYM, KEEP IT AS IS (UPPERCASE)
                        return word;
                    }
                    // CAPITALIZE FIRST LETTER OF EACH WORD
                    return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    );
                }
                // KEEP EXCEPTIONS IN LOWERCASE
                return word.toLowerCase();
            })
            // REJOIN THE WORDS INTO A STRING
            .join(" ")
    );
};

// CAPITALIZE NAMES - SPECIFICALLY FOR PERSON NAMES (NO ACRONYM DETECTION)
export const toCapitalizeName = (str: string) => {
    const exceptions = ["and", "or", "the", "of", "in", "for", "to", "a", "an", "de", "da", "do", "das", "dos", "del", "la", "le", "van", "von"];

    return (
        str
            .trim()
            .replace(/\s+/g, " ")
            .split(" ") // SPLIT THE STRING INTO WORDS
            .map((word, index) => {
                // ALWAYS CAPITALIZE FIRST WORD, SKIP EXCEPTIONS FOR OTHER WORDS
                if (index === 0 || !exceptions.includes(word.toLowerCase())) {
                    // CAPITALIZE FIRST LETTER OF EACH WORD (NO ACRONYM CHECK)
                    return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    );
                }
                // KEEP EXCEPTIONS IN LOWERCASE
                return word.toLowerCase();
            })
            // REJOIN THE WORDS INTO A STRING
            .join(" ")
    );
};

// CONVERT STRING TO SNAKE CASE
export const toSnakeCase = (str: string): string =>
    str.trim().toLowerCase().replace(/\s+/g, "_");

// CONVERT SNAKE CASE TO TITLE CASE
export const snakeCaseToTitleCase = (permission: string | undefined | null): string => {
    if (!permission) return "Unknown";
    return permission
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

// CONVERT DASH SEPARATED STRING TO TITLE CASE (FOR SYSTEM NAMES)
export const dashToTitleCase = (str: string): string => {
    const exceptions = ["and", "or", "the", "of", "in", "for", "to", "a", "an"];
    const isAcronym = (word: string) => /^[A-Z]+$/.test(word);

    return str
        .trim()
        .replace(/[-_]/g, " ") // REPLACE DASHES AND UNDERSCORES WITH SPACES
        .replace(/\s+/g, " ") // NORMALIZE MULTIPLE SPACES
        .split(" ")
        .map((word, index) => {
            if (index === 0 || !exceptions.includes(word.toLowerCase())) {
                if (isAcronym(word)) {
                    return word; // KEEP ACRONYMS AS IS
                }
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
            return word.toLowerCase(); // KEEP EXCEPTIONS IN LOWERCASE
        })
        .join(" ");
};
