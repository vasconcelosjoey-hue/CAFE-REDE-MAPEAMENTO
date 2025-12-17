import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Lock, User, AlertCircle } from 'lucide-react';

const LoginAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      
      // Verificação de segurança adicional conforme instrução
      if (cred.user.isAnonymous) {
        throw new Error("Não autorizado: Usuários anônimos não podem acessar o admin.");
      }

      navigate('/admin/dashboard');

    } catch (err: any) {
      console.error("Erro Firebase:", err);
      
      const errorCode = err.code;
      
      if (errorCode === 'auth/invalid-email') {
        setError('O e-mail digitado não é válido.');
      } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        setError('E-mail ou senha incorretos.');
      } else if (errorCode === 'auth/too-many-requests') {
        setError('Muitas tentativas falhas. Tente novamente mais tarde.');
      } else {
        setError(err.message || 'Erro ao entrar. Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
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
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-4 border border-red-200 flex gap-2 items-start">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-coffee-500 focus:border-coffee-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
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
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;