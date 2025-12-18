// src/components/ui/Card.jsx

import React from 'react';

/**
 * A simple, visually appealing container for grouping UI elements.
 * Ideal for dashboard widgets, list items, or form sections.
 * * @param {string} title - Optional title displayed at the top of the card.
 */
export const Card = ({ title, children, className = '', ...props }) => {
    return (
        <div 
            className={`bg-white p-6 rounded-xl shadow-lg ${className}`}
            {...props}
        >
            {title && (
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};