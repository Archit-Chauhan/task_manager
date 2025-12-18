// src/layouts/AppLayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';

export const AppLayout = () => {
    const { isAuthenticated, role, user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Control sidebar toggle

    
    if (!isAuthenticated) {
        return <Outlet />; 
    }

    const navItems = [
        { name: 'Home', path: '/home', icon: '🏠', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
       
        { name: 'Full Schedule', path: '/schedule', icon: '🗓️', roles: ['ADMIN', 'MANAGER'] },
       
        { name: 'My Shifts', path: '/my-schedule', icon: '👤', roles: ['EMPLOYEE'] },
       
        { name: 'Task Board', path: '/tasks', icon: '✅', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
        
        { name: 'Admin Dashboard', path: '/admin/dashboard', icon: '⚙️', roles: ['ADMIN'] },
        
        { name: 'Audit Logs', path: '/admin/audit-logs', icon: '📝', roles: ['ADMIN'] },
    ];

   
    const filteredNavItems = navItems.filter(item => item.roles.includes(role));
    

    const getLinkClass = ({ isActive }) =>
        `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 
         ${isActive 
            ? 'bg-indigo-700 text-white font-semibold' 
            : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
         }`;


    return (
        <div className="flex h-screen bg-gray-100">
            
            {/* --- Sidebar Navigation (Static for now, but role-based content) --- */}
            <nav 
                className={`flex flex-col bg-indigo-900 text-white transition-width duration-300 
                ${isSidebarOpen ? 'w-64' : 'w-20'} overflow-x-hidden p-4 sticky top-0 h-full`}
            >
                <div className="text-2xl font-bold mb-8 text-center border-b border-indigo-700 pb-4">
                    {/* Display the app name and the user's role for visual confirmation */}
                    {isSidebarOpen ? 'WorkSync Pro' : 'WSP'}
                    <div className="text-sm font-light mt-1 opacity-75">
                         {isSidebarOpen ? `(${role})` : ''}
                    </div>
                </div>

                <div className="flex flex-col space-y-2 flex-grow">
                    {filteredNavItems.map(item => (
                        <NavLink key={item.path} to={item.path} className={getLinkClass}>
                            <span className="text-xl mr-3">{item.icon}</span>
                            <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
                                {item.name}
                            </span>
                        </NavLink>
                    ))}
                </div>

                {/* Logout Button at the bottom of the sidebar */}
                <div className="mt-auto pt-4 border-t border-indigo-700">
                     <button 
                        onClick={logout} 
                        className="w-full text-left p-3 rounded-lg text-indigo-200 hover:bg-indigo-600 hover:text-white transition-colors duration-200"
                    >
                        <span className="text-xl mr-3">🚪</span>
                        <span className={`${isSidebarOpen ? 'inline' : 'hidden'}`}>Logout</span>
                    </button>
                </div>

            </nav>

            {/* --- Main Content Area --- */}
            <div className="flex flex-col flex-1 overflow-y-auto">
                
                {/* --- Header/Navbar (Top Bar) --- */}
                <header className="sticky top-0 z-10 p-4 bg-white shadow-md flex justify-between items-center">
                    
                    {/* Sidebar Toggle */}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="text-gray-500 hover:text-gray-800"
                        aria-label="Toggle Sidebar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>

                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 font-medium">
                            
                            Welcome, {user?.name || 'User'}!
                        </span>
                        
                        <span className="text-xl text-yellow-500 cursor-pointer">🔔</span> 
                    </div>
                </header>

               
                <main className="p-6 flex-1">
                    {/* The content of the current route (e.g., /schedule, /tasks) goes here */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};