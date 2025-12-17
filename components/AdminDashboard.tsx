import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebaseConfig';
import { InterestArea, SurveyResponse } from '../types';
import { Download, LogOut, LayoutDashboard, Search } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin');
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  // Real-time data listener
  useEffect(() => {
    // Note: 'orderBy' might require a composite index in Firestore. 
    // Check browser console for a link to create it if it fails.
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

  const handleLogout = () => {
    signOut(auth);
  };

  const exportCSV = () => {
    const headers = ["Nome de Guerra", "Bateria", "WhatsApp", "Área de Interesse", "Data"];
    const csvContent = [
      headers.join(','),
      ...responses.map(r => {
        const date = r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : '';
        return `"${r.nomeGuerra}","${r.bateria}","${r.whatsapp}","${r.areaInteresse}","${date}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cafe_rede_respostas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const filteredResponses = responses.filter(r => 
    r.nomeGuerra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.bateria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-coffee-600 p-2 rounded-lg">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={exportCSV} 
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <Download size={18} /> Exportar CSV
          </button>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium uppercase">Total de Respostas</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{total}</p>
          </div>
          {Object.entries(counts).map(([key, value]) => (
            <div key={key} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium uppercase truncate" title={key}>{key}</p>
              <div className="flex justify-between items-end mt-2">
                 <p className="text-3xl font-bold text-gray-900">{value}</p>
                 <p className="text-sm text-gray-400 font-mono">
                   {total > 0 ? ((value / total) * 100).toFixed(0) : 0}%
                 </p>
              </div>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="font-bold text-lg text-gray-800">Respostas Recebidas</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Buscar por nome ou bateria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 text-sm"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Data/Hora</th>
                  <th className="px-6 py-4 font-semibold">Nome de Guerra</th>
                  <th className="px-6 py-4 font-semibold">Bateria</th>
                  <th className="px-6 py-4 font-semibold">WhatsApp</th>
                  <th className="px-6 py-4 font-semibold">Área de Interesse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredResponses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Nenhuma resposta encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredResponses.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                        {r.createdAt?.toDate 
                          ? r.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + r.createdAt.toDate().toLocaleDateString()
                          : 'Pendente...'}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{r.nomeGuerra}</td>
                      <td className="px-6 py-4 text-gray-700">{r.bateria}</td>
                      <td className="px-6 py-4 text-gray-700 font-mono text-sm">{r.whatsapp}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          r.areaInteresse === InterestArea.EMPLOYEE ? 'bg-amber-100 text-amber-800' :
                          r.areaInteresse === InterestArea.PUBLIC_SERVICE ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {r.areaInteresse}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;