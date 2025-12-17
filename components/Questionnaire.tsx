import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { InterestArea } from '../types';
import { Send, User, Phone, MapPin, CheckCircle2, LockKeyhole } from 'lucide-react';

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomeGuerra: '',
    bateria: '',
    whatsapp: '',
    areaInteresse: '' as InterestArea | ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (area: InterestArea) => {
    setFormData(prev => ({ ...prev, areaInteresse: area }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.nomeGuerra || !formData.bateria || !formData.whatsapp || !formData.areaInteresse) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Simple WhatsApp format validation (numbers only, min length)
    const phoneRegex = /^[0-9+\s()-]{10,}$/;
    if (!phoneRegex.test(formData.whatsapp)) {
      alert("Por favor, insira um número de WhatsApp válido.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "respostas"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      navigate('/resultado');
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Erro ao enviar. Verifique sua conexão ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="bg-coffee-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Café Rede</h1>
          <p className="text-coffee-100 text-sm">Mapeamento de Oportunidades</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Nome de Guerra */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User size={16} /> Nome de Guerra
            </label>
            <input
              type="text"
              name="nomeGuerra"
              value={formData.nomeGuerra}
              onChange={handleInputChange}
              placeholder="Ex: Sd Silva"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 outline-none transition-all"
              required
            />
          </div>

          {/* Bateria / Unidade */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin size={16} /> Bateria / Unidade
            </label>
            <input
              type="text"
              name="bateria"
              value={formData.bateria}
              onChange={handleInputChange}
              placeholder="Ex: 1ª Bia / 2º GAAAe"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 outline-none transition-all"
              required
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone size={16} /> WhatsApp
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="(11) 99999-9999"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 outline-none transition-all"
              required
            />
          </div>

          {/* Área de Interesse */}
          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Área de Interesse (Selecione uma)
            </label>
            <div className="space-y-3">
              {Object.values(InterestArea).map((interest) => (
                <label 
                  key={interest}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.areaInteresse === interest 
                      ? 'border-coffee-600 bg-coffee-50 ring-1 ring-coffee-600' 
                      : 'border-gray-200 hover:border-coffee-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="areaInteresse"
                    value={interest}
                    checked={formData.areaInteresse === interest}
                    onChange={() => handleInterestChange(interest)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    formData.areaInteresse === interest ? 'border-coffee-600' : 'border-gray-300'
                  }`}>
                    {formData.areaInteresse === interest && (
                      <div className="w-3 h-3 rounded-full bg-coffee-600" />
                    )}
                  </div>
                  <span className="text-gray-900 font-medium">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coffee-600 hover:bg-coffee-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <>
                Enviar Resposta <Send size={20} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Botão Admin */}
      <button
        onClick={() => navigate('/admin')}
        className="fixed bottom-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-600 p-3 rounded-full shadow-md transition-all hover:bg-gray-100"
        title="Área Administrativa"
      >
        <LockKeyhole size={20} />
      </button>
    </div>
  );
};

export default Questionnaire;