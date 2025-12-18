// src/components/ui/Input.jsx

import React from 'react';

/**
 * A reusable input field with consistent styling and error display support.
 * * @param {string} label - The visible label for the input.
 * @param {string} error - Error message string to display below the input.
 */
export const Input = ({ label, id, error, className = '', ...props }) => {
    
    // Base styles for the input field
    const inputClasses = `w-full px-3 py-2 border rounded-md shadow-sm text-gray-900 
                          focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                          sm:text-sm transition duration-150 ease-in-out`;

    return (
        <div className={className}>
            {/* Label is crucial for accessibility and good UX */}
            {label && (
                <label htmlFor={id || props.name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            
            <input
                id={id || props.name}
                className={`${inputClasses} ${error ? 'border-red-500' : 'border-gray-300'}`}
                {...props}
            />
            
            {/* Display error message if present */}
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};