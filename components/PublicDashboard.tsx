import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { InterestArea, SurveyResponse } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';

const COLORS = ['#8c6b45', '#0ea5e9', '#10b981'];

interface ChartData {
  name: string;
  value: number;
  percentage: string;
}

const PublicDashboard: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "respostas"));
    
    // Real-time listener using onSnapshot
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const responses: SurveyResponse[] = [];
      snapshot.forEach((doc) => {
        responses.push(doc.data() as SurveyResponse);
      });

      const total = responses.length;
      setTotalVotes(total);

      // Aggregate counts
      const counts: Record<string, number> = {
        [InterestArea.EMPLOYEE]: 0,
        [InterestArea.PUBLIC_SERVICE]: 0,
        [InterestArea.OWN_BUSINESS]: 0,
      };

      responses.forEach(r => {
        if (counts[r.areaInteresse] !== undefined) {
          counts[r.areaInteresse]++;
        }
      });

      // Transform to chart data
      const chartData = Object.keys(counts).map((key) => {
        const count = counts[key];
        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
        return {
          name: key,
          value: count,
          percentage: percentage
        };
      });

      setData(chartData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <header className="w-full max-w-6xl mb-8 flex items-center justify-between border-b border-gray-700 pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-500">Café Rede</h1>
          <p className="text-gray-400 text-lg">Mapeamento de Interesses em Tempo Real</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
          <BarChart3 className="text-coffee-500" />
          <span className="font-mono text-xl">{totalVotes} Votos</span>
        </div>
      </header>

      <main className="w-full max-w-6xl flex-1 flex flex-col md:flex-row gap-8 items-center justify-center">
        
        {/* Left Side: Big Percentage Cards */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {data.map((item, index) => (
            <div 
              key={item.name} 
              className="bg-gray-800 p-6 rounded-2xl border-l-8 shadow-lg transform transition-all hover:scale-105"
              style={{ borderLeftColor: COLORS[index % COLORS.length] }}
            >
              <h2 className="text-xl text-gray-300 font-medium mb-1">{item.name}</h2>
              <div className="flex justify-between items-end">
                <span className="text-5xl md:text-6xl font-bold text-white">
                  {item.percentage}%
                </span>
                <span className="text-gray-500 text-sm mb-2 opacity-50 hidden">
                  {/* Hidden in public dashboard as per request, keeping logic just in case needed later, effectively removing absolute counts visually */}
                  ({item.value} votos)
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                <div 
                  className="h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${item.percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Pie Chart */}
        <div className="w-full md:w-1/2 h-[400px] bg-gray-800/50 rounded-2xl p-4">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                formatter={(value: number, name: string, props: any) => [`${props.payload.percentage}%`, name]}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </main>
      
      <footer className="mt-12 text-gray-600 text-sm">
        Café Rede © {new Date().getFullYear()} — Atualização Automática
      </footer>
    </div>
  );
};

export default PublicDashboard;