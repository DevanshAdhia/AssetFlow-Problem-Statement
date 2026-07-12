import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/ResetPassword/ResetPassword';
import Dashboard from '../pages/Dashboard/Dashboard';
import Profile from '../pages/Profile/Profile';
import ChangePassword from '../pages/Profile/ChangePassword';
import Notifications from '../pages/Notifications/Notifications';
import ActivityLogs from '../pages/ActivityLogs/ActivityLogs';
import Reports from '../pages/Reports/Reports';
import Maintenance from '../pages/Maintenance/Maintenance';
import Audit from '../pages/Audit/Audit';
import Allocation from '../pages/Allocation/Allocation';
import OrganizationSetup from '../pages/OrganizationSetup/OrganizationSetup';
import Assets from '../pages/Assets/Assets';
import EditProfile from '../pages/Profile/EditProfile';
import Terms from '../pages/Terms/Terms';
import Unauthorized from '../pages/Unauthorized/Unauthorized';
import NotFound from '../pages/NotFound/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes (Dashboard) */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setup" element={<OrganizationSetup />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/allocation" element={<Allocation />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/activity-logs" element={<ActivityLogs />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* Error & Public Routes */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/403" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
