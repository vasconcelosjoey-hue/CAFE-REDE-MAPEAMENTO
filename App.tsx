import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Questionnaire from './components/Questionnaire';
import PublicDashboard from './components/PublicDashboard';
import LoginAdmin from './components/LoginAdmin';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Questionnaire />} />
        <Route path="/resultado" element={<PublicDashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;