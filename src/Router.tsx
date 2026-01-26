import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from './auth/AuthService';
import { ROUTES } from './routes';

// Components (lazy load mejor para producción)
import Login from './auth/login/Login';
import Dashboard from './owners/dashboard/Dashboard';
import EscapeRoom from './owners/escaperooms/EscapeRoom';
import EscapeRoomCreate from './owners/escaperooms/EscapeRoom.Create';
import FichaEscapeRoom from './owners/escaperooms/FichaEscapeRoom';
import EscapeRoomUpdate from './owners/escaperooms/EscapeRoom.Update';
import Rooms from './owners/rooms/Rooms';
//import AdminUsers from './admin/Users/AdminUsers';
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
    
    if (requiredRole && user?.role_name === 'owner') {
        //return <Navigate to={ROUTES.OWNER_DASHBOARD} />;
    } else if (requiredRole && user?.role_name === 'admin') {

    } else {

    }
    
    return <>{children}</>;
};

// Public Route (redirect if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (AuthService.isAuthenticated()) {
        return <Navigate to={ROUTES.OWNER_DASHBOARD} />;
    }
    return <>{children}</>;
};

const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.LOGIN} element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />
            
            {/* Owner Routes */}
            <Route path={ROUTES.OWNER_DASHBOARD} element={
                <ProtectedRoute requiredRole="owner">
                    <Dashboard />
                </ProtectedRoute>
            } /> 

            <Route path={ROUTES.OWNER_ESCAPE_ROOMS} element={
                <ProtectedRoute requiredRole="owner">
                    <EscapeRoom />
                </ProtectedRoute>
            } /> 
            
            <Route path={ROUTES.OWNER_ESCAPE_ROOMS_CREATE} element={
                <ProtectedRoute requiredRole="owner">
                    <EscapeRoomCreate />
                </ProtectedRoute>
            } />

            <Route path={ROUTES.OWNER_ESCAPE_ROOM} element={
                <ProtectedRoute requiredRole="owner">
                    <FichaEscapeRoom />
                </ProtectedRoute>
            } />

            <Route path={ROUTES.OWNER_ROOMS} element={
                <ProtectedRoute requiredRole="owner">
                    <Rooms />
                </ProtectedRoute>
            } />  

            <Route path={ROUTES.OWNER_ESCAPE_ROOMS_UPDATE} element={
                <ProtectedRoute requiredRole="owner">
                    <EscapeRoomUpdate />
                </ProtectedRoute>
            } />



            {/* Default Route */}
            <Route path="/" element={<Navigate to={ROUTES.OWNER_DASHBOARD} />} />
            
            {/* 404 Route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
    );
};

export default AppRouter;