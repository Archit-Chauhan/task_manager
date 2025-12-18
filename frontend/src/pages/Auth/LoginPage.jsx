// src/pages/Auth/LoginPage.jsx (UPDATED)

import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi'; 

export const LoginPage = () => {
 
  const { login, isAuthenticated, role } = useAuth();
  
  // Use a local state to manage form inputs
  const [email, setEmail] = useState('admin@company.com'); 
  const [password, setPassword] = useState('Password123'); 
  const [formError, setFormError] = useState(null);

  const { isLoading, execute: apiExecute } = useApi();
  

  if (isAuthenticated) {
    const defaultPath = 
      role === 'ADMIN' ? '/admin/dashboard' : 
      role === 'MANAGER' ? '/schedule' : 
      '/my-schedule'; 
    return <Navigate to={defaultPath} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null); 

    try {
      const user = await login({ email, password });
      console.log(`Successfully logged in as ${user.role}`);

    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      setFormError(message);
    }
  };
  const handleOAuthLogin = () => {
      alert("Redirecting for OAuth login... (BONUS Feature TBD)");
      
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-500">

    {/* Glass card */}
    <div className="relative w-full max-w-sm">

      {/* Avatar */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
        <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center shadow-lg">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl pt-16 px-8 pb-8">

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          LOGIN
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div className="flex items-center bg-gray-600 rounded-md overflow-hidden">
           {/* Icon box */}
          <div className="w-12 h-12 flex items-center justify-center bg-gray-900">
         <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
         >
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
         />
        </svg>
      </div>

  {/* Input */}
  <input
    type="email"
    required
    placeholder="Email ID"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    disabled={isLoading}
    className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-300 focus:outline-none"
  />
</div>
{/* Password */}
<div className="flex items-center bg-gray-600 rounded-md overflow-hidden">
  
  {/* Icon box */}
  <div className="w-12 h-12 flex items-center justify-center bg-gray-900">
    <svg
      className="w-5 h-5 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 11c1.657 0 3 .895 3 2v3H9v-3c0-1.105 1.343-2 3-2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 11V7a5 5 0 0110 0v4"
      />
    </svg>
  </div>

  {/* Input */}
  <input
    type="password"
    required
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    disabled={isLoading}
    className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-300 focus:outline-none"
  />
</div>


          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="bg-gray-900" />
              Remember me
            </label>
            <a href="#" className="hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Error */}
          {formError && (
            <div className="text-sm text-red-600 bg-red-100 p-2 rounded">
              {formError}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 rounded-md bg-gray-900 hover:bg-indigo-700 text-white font-semibold transition"
          >
            {isLoading ? "Signing in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  </div>
);
};