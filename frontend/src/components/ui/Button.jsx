// src/components/ui/Button.jsx

import React from 'react';

/**
 * A highly reusable Button component with variant, size, and loading state support.
 * This ensures consistent styling and UX across the entire application.
 * * @param {string} variant - 'primary', 'secondary', 'danger', 'ghost'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} isLoading - Shows spinner and disables button if true
 */
export const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    className = '', 
    ...props 
}) => {
    
    // --- 1. Base Styles ---
    let baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    // --- 2. Size Styles ---
    switch (size) {
        case 'sm':
            baseStyles += ' px-3 py-1.5 text-sm';
            break;
        case 'lg':
            baseStyles += ' px-6 py-3 text-lg';
            break;
        case 'md':
        default:
            baseStyles += ' px-4 py-2 text-base';
            break;
    }

    // --- 3. Variant Styles ---
    switch (variant) {
        case 'secondary':
            baseStyles += ' bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300 focus:ring-gray-500';
            break;
        case 'danger':
            baseStyles += ' bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
            break;
        case 'ghost':
            baseStyles += ' bg-transparent text-gray-700 hover:bg-gray-100';
            break;
        case 'primary':
        default:
            baseStyles += ' bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
            break;
    }

    // --- 4. Disabled/Loading Styles ---
    if (props.disabled || isLoading) {
        // Apply different colors for disabled state
        baseStyles += ' opacity-50 cursor-not-allowed';
    }

    return (
        <button
            className={`${baseStyles} ${className}`}
            disabled={props.disabled || isLoading}
            {...props}
        >
            {isLoading && (
                // Simple Tailwind spinner (reusing the logic from LoadingSpinner)
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
};