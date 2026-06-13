import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyEmail from '../pages/VerifyEmail';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPasswordConfirm from '../pages/ResetPasswordConfirm';
import Dashboard from '../pages/Dashboard';
import WorkspaceDetail from '../pages/WorkspaceDetail';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';

import WorkspaceRedirect from '../components/auth/WorkspaceRedirect';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPasswordConfirm />} />

      {/* Protected Root redirector */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <WorkspaceRedirect />
          </ProtectedRoute>
        } 
      />

      {/* Protected Workspace routes */}
      <Route 
        path="/workspace/:workspaceId" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/workspace/:workspaceId/project/:projectId" 
        element={
          <ProtectedRoute>
            <WorkspaceDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Protected Dashboard */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Base redirection fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
