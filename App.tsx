import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Questionnaire from './components/Questionnaire';
import PublicDashboard from './components/PublicDashboard';
import LoginAdmin from './components/LoginAdmin';
import AdminDashboard from './components/AdminDashboard';
import ThankYou from './components/ThankYou';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Questionnaire />} />
        <Route path="/obrigado" element={<ThankYou />} />
        
        {/* 
           Mantivemos o /resultado acessível caso você queira 
           abrir em uma TV separada no evento, mas o usuário 
           do celular não será mais redirecionado para cá.
        */}
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