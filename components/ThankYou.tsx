import React from 'react';
import { CheckCircle } from 'lucide-react';

const ThankYou: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full transform transition-all hover:scale-105 duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="text-green-600 w-16 h-16" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Obrigado!</h1>
        
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Sua resposta foi registrada com sucesso.<br/>
          Agradecemos sua participação no mapeamento do Café Rede.
        </p>
        
        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-400">
            Você já pode fechar esta janela.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;