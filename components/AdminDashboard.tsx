import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { InterestArea, SurveyResponse } from '../types';
import { LayoutDashboard, ArrowLeft, BarChart2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const navigate = useNavigate();

  // Real-time data listener
  useEffect(() => {
    // Busca dados em tempo real
    const q = query(collection(db, "respostas"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: SurveyResponse[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as SurveyResponse);
      });
      setResponses(data);
    });

    return () => unsubscribe();
  }, []);

  // Stats calculation
  const total = responses.length;
  const counts: Record<string, number> = {
    [InterestArea.EMPLOYEE]: 0,
    [InterestArea.PUBLIC_SERVICE]: 0,
    [InterestArea.OWN_BUSINESS]: 0,
  };
  
  responses.forEach(r => {
    if (counts[r.areaInteresse] !== undefined) counts[r.areaInteresse]++;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-coffee-600 p-2 rounded-lg">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Painel de Resultados</h1>
            <p className="text-xs text-gray-500">Visão Geral Estatística</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-coffee-600 transition-colors font-medium"
          >
            <ArrowLeft size={18} /> Voltar ao Início
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Message */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-800 text-sm">
          <strong>Modo de Visualização Pública:</strong> Os dados pessoais (nomes e contatos) estão ocultos nesta visualização. Para acessar a lista nominal completa, utilize o Console do Firebase.
        </div>

        {/* Stats Cards - Destaque */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 font-medium uppercase text-xs tracking-wider">Total de Participantes</p>
                <p className="text-5xl font-bold mt-2">{total}</p>
              </div>
              <BarChart2 className="text-coffee-500 opacity-50" size={32} />
            </div>
          </div>

          {Object.entries(counts).map(([key, value]) => {
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            
            return (
              <div key={key} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase truncate" title={key}>{key}</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className="mt-4">
                   <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${
                          key === InterestArea.EMPLOYEE ? 'bg-amber-500' :
                          key === InterestArea.PUBLIC_SERVICE ? 'bg-blue-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                   </div>
                   <p className="text-sm text-gray-400 font-mono text-right">
                     {percentage}% do total
                   </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info adicional */}
        <div className="text-center text-gray-400 text-sm mt-12">
          As atualizações ocorrem em tempo real conforme novas respostas são enviadas.
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;