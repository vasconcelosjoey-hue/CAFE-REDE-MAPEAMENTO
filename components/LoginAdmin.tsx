import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Lock, User } from 'lucide-react';

const LoginAdmin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check specific hardcoded credentials
    if (username === 'caferede' && password === 'redecafe') {
      setLoading(true);
      try {
        // Use anonymous authentication to satisfy Firebase Auth requirement in Dashboard
        // Ensure "Anonymous" provider is enabled in Firebase Console -> Authentication -> Sign-in method
        await signInAnonymously(auth);
        navigate('/admin/dashboard');
      } catch (err: any) {
        console.error(err);
        setError('Erro de autenticação. Verifique se o login anônimo está ativado no Firebase.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Acesso Administrativo</h2>
          <p className="text-gray-500 text-sm">Entre para ver os dados detalhados</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-coffee-500 focus:border-coffee-500 outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Usuário"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-coffee-500 focus:border-coffee-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;