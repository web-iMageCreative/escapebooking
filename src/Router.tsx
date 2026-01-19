import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from './auth/AuthService';
import { ROUTES } from './routes';

// Components (lazy load mejor para producción)
import LoginForm from './auth/login/LoginController';
import Dashboard from './owners/dashboard/Dashboard';
//import AdminUsers from './admin/Users/AdminUsers';
//import OwnerEscapeRooms from './owner/EscapeRooms/OwnerEscapeRooms';
//import CustomerBrowse from './customer/Browse/CustomerBrowse';

// Protected Route component
interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'owner' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    if (!AuthService.isAuthenticated()) {
        return <Navigate to={ROUTES.LOGIN} />;
    }
    
    const user = AuthService.getCurrentUser();
    
    if (requiredRole && user?.role_name !== requiredRole) {
        return <Navigate to={ROUTES.DASHBOARD} />;
    }
    
    return <>{children}</>;
};

// Public Route (redirect if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (AuthService.isAuthenticated()) {
        return <Navigate to={ROUTES.DASHBOARD} />;
    }
    return <>{children}</>;
};

const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.LOGIN} element={
                <PublicRoute>
                    <LoginForm />
                </PublicRoute>
            } />
            
            {/* Protected Routes */}
            <Route path={ROUTES.DASHBOARD} element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            {/* <Route path={ROUTES.ADMIN_USERS} element={
                <ProtectedRoute requiredRole="admin">
                    <AdminUsers />
                </ProtectedRoute>
            } /> */}
            
            {/* Owner Routes */}
            {/* <Route path={ROUTES.OWNER_ESCAPE_ROOMS} element={
                <ProtectedRoute requiredRole="owner">
                    <OwnerEscapeRooms />
                </ProtectedRoute>
            } /> */}
            
            {/* Customer Routes */}
            {/* <Route path={ROUTES.CUSTOMER_BROWSE} element={
                <ProtectedRoute requiredRole="customer">
                    <CustomerBrowse />
                </ProtectedRoute>
            } /> */}
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} />} />
            
            {/* 404 Route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
    );
};

export default AppRouter;