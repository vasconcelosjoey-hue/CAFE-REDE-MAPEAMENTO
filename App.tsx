import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Questionnaire from './components/Questionnaire';
import PublicDashboard from './components/PublicDashboard';
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
           Rota pública para TV/Telão (Visual focado em percentuais)
        */}
        <Route path="/resultado" element={<PublicDashboard />} />
        
        {/* 
           Rota de Dashboard Geral (Antigo Admin)
           Agora acessível publicamente, mostrando estatísticas detalhadas 
           mas sem dados pessoais.
        */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Redireciona a rota antiga de dashboard para o novo padrão */}
        <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;