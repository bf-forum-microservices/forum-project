// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from './auth';

const PrivateRoute = ({ children, requireAdmin = false }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    if (requireAdmin && !isAdmin()) {
        return <Navigate to="/home" />;
    }
    return children;
};

export default PrivateRoute;
