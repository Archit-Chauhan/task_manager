// src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';

import { LoginPage } from './pages/Auth/LoginPage';
import Home from './pages/Home';
import { NotFound } from './pages/NotFound';

// Manager/Admin
import { SchedulePage } from './pages/Manager/SchedulePage';
import SwapRequest from './pages/Manager/SwapRequests';

// Admin
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import AuditLogs from "./pages/Admin/AuditLogs";

// Employee
import { MySchedule } from './pages/Employee/MySchedule';
import { TaskBoard } from './pages/Tasks/TaskBoard';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/404" element={<NotFound />} />

      <Route path="/" element={<AppLayout />}>
        {/* Redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />

        {/* Employee */}
        <Route
          path="/my-schedule"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
              <MySchedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
              <TaskBoard />
            </ProtectedRoute>
          }
        />

        {/* Manager */}
        <Route
          path="/schedule"
          element={
            <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
              <SchedulePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/swaps"
          element={
            <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
              <SwapRequest />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* AUDIT LOGS ROUTE */}
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
