import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import Dashboard from './pages/Dashboard';
import CandidateList from './pages/CandidateList';
import CandidateForm from './pages/CandidateForm';
import CandidateDetail from './pages/CandidateDetail';
import { theme } from './styles/theme';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />
            <Route path="/register" element={
                <PublicRoute>
                    <Register />
                </PublicRoute>
            } />
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            } />
            <Route path="/candidates" element={
                <PrivateRoute>
                    <CandidateList />
                </PrivateRoute>
            } />
            <Route path="/candidates/new" element={
                <PrivateRoute>
                    <CandidateForm />
                </PrivateRoute>
            } />
            <Route path="/candidates/:id" element={
                <PrivateRoute>
                    <CandidateDetail />
                </PrivateRoute>
            } />
            <Route path="/candidates/:id/edit" element={
                <PrivateRoute>
                    <CandidateForm />
                </PrivateRoute>
            } />
            <Route path="/" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            } />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App; 