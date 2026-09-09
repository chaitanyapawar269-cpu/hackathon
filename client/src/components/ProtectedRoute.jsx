import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute({ children, allowedRole, fallback = '/business/dashboard' }) { const { user, loading } = useAuth(); const location = useLocation(); if (loading) return <div className="route-loading">Loading your secure workspace...</div>; if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />; return allowedRole && user.role !== allowedRole ? <Navigate to={fallback} replace /> : children; }
