export const cache: Record<string, boolean> = {};

export const checkCache = (company_name: string): boolean | undefined => {
    return cache[company_name];
};

export const setCache = (company_name: string, exists: boolean): void => {
    cache[company_name] = exists;
};
