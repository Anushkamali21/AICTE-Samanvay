import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterComplaintPage from './pages/RegisterComplaintPage';
import TrackComplaintsPage from './pages/TrackComplaintsPage';
import ComplaintDetailPage from './pages/ComplaintDetailPage';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import InstitutionalStatsPage from './pages/InstitutionalStatsPage';
import FeedbackPage from './pages/FeedbackPage';
import NotificationsPage from './pages/NotificationsPage';
import HelpSupportPage from './pages/HelpSupportPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

import { ROLES } from './utils/constants';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-700 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/complaints/new" element={<RegisterComplaintPage />} />
            <Route path="/complaints" element={<TrackComplaintsPage />} />
            <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
            <Route
              path="/admin/complaints"
              element={
                <ProtectedRoute allowedRoles={[ROLES.INSTITUTION_NODAL, ROLES.AICTE_ADMIN]}>
                  <AdminComplaintsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/statistics" element={<InstitutionalStatsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/help" element={<HelpSupportPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
