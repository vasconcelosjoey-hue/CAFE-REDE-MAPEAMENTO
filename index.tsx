import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<div style="color:red; padding:20px;"><h1>Erro Fatal</h1><p>Elemento "root" não encontrado.</p></div>';
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Erro ao renderizar aplicação:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; color: #7f1d1d; background-color: #fef2f2; border: 1px solid #fecaca; margin: 20px; border-radius: 8px; font-family: sans-serif;">
      <h2 style="margin-top:0;">Erro na Aplicação</h2>
      <p>Ocorreu um erro ao carregar a interface.</p>
      <pre style="background: #fff; padding: 10px; overflow: auto; border-radius: 4px;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}