import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CandidateList from './pages/CandidateList';
import CandidateForm from './pages/CandidateForm';
import CandidateDetail from './pages/CandidateDetail';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/candidates" element={<CandidateList />} />
            <Route path="/candidates/new" element={<CandidateForm />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />
            <Route path="/candidates/:id/edit" element={<CandidateForm />} />
        </Routes>
    );
};

export default AppRoutes; 