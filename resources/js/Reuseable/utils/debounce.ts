let debounceTimer: ReturnType<typeof setTimeout>;

export const debounce = (callback: () => void, delay: number): void => {
    clearTimeout(debounceTimer); // CLEAR PREVIOUS DEBOUNCE TIMER
    debounceTimer = setTimeout(callback, delay);
};
