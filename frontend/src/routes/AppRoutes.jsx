import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AssetManagerLayout from '../layouts/AssetManagerLayout';

// Admin Pages
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/ResetPassword/ResetPassword';
import Dashboard from '../pages/Admin/Dashboard/Dashboard';
import Profile from '../pages/Profile/Profile';
import ChangePassword from '../pages/Profile/ChangePassword';
import Notifications from '../pages/Admin/Notifications/Notifications';
import ActivityLogs from '../pages/Admin/ActivityLogs/ActivityLogs';
import Reports from '../pages/Admin/Reports/Reports';
import Maintenance from '../pages/Admin/Maintenance/Maintenance';
import Audit from '../pages/Admin/Audit/Audit';
import Allocation from '../pages/Admin/Allocation/Allocation';
import OrganizationSetup from '../pages/Admin/OrganizationSetup/OrganizationSetup';
import Assets from '../pages/Admin/Assets/Assets';
import Bookings from '../pages/Admin/Bookings/Bookings';

// Asset Manager Pages
import AssetManagerDashboard from '../pages/AssetManager/Dashboard';
import AssetManagerAssets from '../pages/AssetManager/AssetManagerAssets';
import AssetManagerAllocation from '../pages/AssetManager/AMAllocation';
import AssetManagerMaintenance from '../pages/AssetManager/AMMaintenance';
import AssetManagerAudit from '../pages/AssetManager/AMAudit';
import AssetManagerReports from '../pages/AssetManager/AMReports';
import AssetManagerNotifications from '../pages/AssetManager/AMNotifications';
import AssetManagerActivityLogs from '../pages/AssetManager/AMActivityLogs';

// Dept Head Pages
import DeptHeadLayout from '../layouts/DeptHeadLayout';
import DHDashboard from '../pages/DeptHead/DHDashboard';
import DHAssets from '../pages/DeptHead/DHAssets';
import DHAllocation from '../pages/DeptHead/DHAllocation';
import DHTransfers from '../pages/DeptHead/DHTransfers';
import DHBookings from '../pages/DeptHead/DHBookings';
import DHCalendar from '../pages/DeptHead/DHCalendar';
import DHEmployees from '../pages/DeptHead/DHEmployees';
import DHReports from '../pages/DeptHead/DHReports';
import DHNotifications from '../pages/DeptHead/DHNotifications';
import DHActivityLogs from '../pages/DeptHead/DHActivityLogs';
import DHProfile from '../pages/DeptHead/DHProfile';

// Employee Pages
import EmployeeLayout from '../layouts/EmployeeLayout';
import EmpDashboard from '../pages/Employee/EmpDashboard';
import EmpAssets from '../pages/Employee/EmpAssets';
import EmpBookings from '../pages/Employee/EmpBookings';
import EmpMyBookings from '../pages/Employee/EmpMyBookings';
import EmpMaintenance from '../pages/Employee/EmpMaintenance';
import EmpReturns from '../pages/Employee/EmpReturns';
import EmpTransfers from '../pages/Employee/EmpTransfers';
import EmpNotifications from '../pages/Employee/EmpNotifications';
import EmpActivityLogs from '../pages/Employee/EmpActivityLogs';
import EmpProfile from '../pages/Employee/EmpProfile';

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
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/activity-logs" element={<ActivityLogs />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* Asset Manager Routes */}
      <Route element={<AssetManagerLayout />}>
        <Route path="/asset-manager" element={<Navigate to="/asset-manager/dashboard" replace />} />
        <Route path="/asset-manager/dashboard" element={<AssetManagerDashboard />} />
        <Route path="/asset-manager/assets" element={<AssetManagerAssets />} />
        <Route path="/asset-manager/allocation" element={<AssetManagerAllocation />} />
        <Route path="/asset-manager/maintenance" element={<AssetManagerMaintenance />} />
        <Route path="/asset-manager/audit" element={<AssetManagerAudit />} />
        <Route path="/asset-manager/reports" element={<AssetManagerReports />} />
        <Route path="/asset-manager/notifications" element={<AssetManagerNotifications />} />
        <Route path="/asset-manager/activity-logs" element={<AssetManagerActivityLogs />} />
        <Route path="/asset-manager/profile" element={<Profile />} />
        <Route path="/asset-manager/edit-profile" element={<EditProfile />} />
      </Route>

      {/* Dept Head Routes */}
      <Route element={<DeptHeadLayout />}>
        <Route path="/dept-head" element={<Navigate to="/dept-head/dashboard" replace />} />
        <Route path="/dept-head/dashboard" element={<DHDashboard />} />
        <Route path="/dept-head/assets" element={<DHAssets />} />
        <Route path="/dept-head/allocation" element={<DHAllocation />} />
        <Route path="/dept-head/transfers" element={<DHTransfers />} />
        <Route path="/dept-head/bookings" element={<DHBookings />} />
        <Route path="/dept-head/calendar" element={<DHCalendar />} />
        <Route path="/dept-head/employees" element={<DHEmployees />} />
        <Route path="/dept-head/reports" element={<DHReports />} />
        <Route path="/dept-head/notifications" element={<DHNotifications />} />
        <Route path="/dept-head/activity-logs" element={<DHActivityLogs />} />
        <Route path="/dept-head/profile" element={<DHProfile />} />
      </Route>

      {/* Employee Routes */}
      <Route element={<EmployeeLayout />}>
        <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="/employee/dashboard" element={<EmpDashboard />} />
        <Route path="/employee/assets" element={<EmpAssets />} />
        <Route path="/employee/bookings" element={<EmpBookings />} />
        <Route path="/employee/my-bookings" element={<EmpMyBookings />} />
        <Route path="/employee/maintenance" element={<EmpMaintenance />} />
        <Route path="/employee/returns" element={<EmpReturns />} />
        <Route path="/employee/transfers" element={<EmpTransfers />} />
        <Route path="/employee/notifications" element={<EmpNotifications />} />
        <Route path="/employee/activity" element={<EmpActivityLogs />} />
        <Route path="/employee/profile" element={<EmpProfile />} />
      </Route>

      {/* Error & Public Routes */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/403" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
