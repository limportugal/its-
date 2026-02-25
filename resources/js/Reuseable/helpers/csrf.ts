/**
 * CSRF Token Helper
 * Provides utilities for handling CSRF tokens in the application
 */

import { usePage } from '@inertiajs/react';

// Get CSRF token from Inertia shared data or meta tag
export const getCsrfToken = (): string => {
    // First try to get from Inertia shared data
    const csrfToken =
        (window as any).page?.props?.csrf_token ||
        (window as any).initialPage?.props?.csrf_token;
    
    if (csrfToken) {
        return csrfToken;
    }
    
    // Fallback to meta tag
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    if (metaToken) {
        return metaToken;
    }
    
    console.warn('CSRF token not found in Inertia shared data or meta tag');
    return '';
};

// Refresh CSRF token by reloading the page
export const refreshCsrfToken = (): void => {
    window.location.reload();
};

// Fetch a fresh CSRF token from the server
export const fetchFreshCsrfToken = async (): Promise<string | null> => {
    try {
        const response = await fetch('/csrf-token', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.csrf_token;
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching fresh CSRF token:', error);
        return null;
    }
};

// Hook to get CSRF token in React components
export const useCsrfToken = (): string => {
    const { props } = usePage();
    return props.csrf_token || '';
};

// Create headers with CSRF token
export const createCsrfHeaders = (): Record<string, string> => {
    const token = getCsrfToken();
    
    return {
        'X-CSRF-TOKEN': token,
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    };
};

// Add CSRF token to FormData
export const addCsrfToFormData = (formData: FormData): FormData => {
    const token = getCsrfToken();
    if (token) {
        formData.append('_token', token);
    }
    return formData;
};
