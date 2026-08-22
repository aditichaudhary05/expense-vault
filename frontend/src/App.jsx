import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={
              <PublicRoute><Login /></PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute><Signup /></PublicRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>
            } />
            <Route path="/expenses" element={
              <ProtectedRoute><MainLayout><Expenses /></MainLayout></ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute><MainLayout><Analytics /></MainLayout></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
