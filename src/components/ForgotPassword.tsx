import React, { useState } from "react";

// 1. Définition de l'interface indispensable pour TypeScript
interface ForgotPasswordProps {
  onBack: () => void;
}

// 2. Le composant utilisant l'interface définie
const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'envoi de mail pour la location de voiture
    setTimeout(() => {
      setLoading(false);
      alert("Un lien de récupération pour votre compte Movia a été envoyé.");
      onBack();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">
          Email de récupération
        </label>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#2563EB] transition-colors">✉️</span>
          <input 
            type="email" 
            placeholder="votre.email@exemple.com"
            className="w-full h-[60px] pl-12 bg-[#F8FAFC] border-2 border-transparent rounded-[18px] focus:bg-white focus:border-[#2563EB]/20 outline-none transition-all font-semibold"
            required
          />
        </div>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full h-[64px] bg-[#2563EB] text-white font-black rounded-[20px] shadow-xl shadow-blue-100 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
      >
        {loading ? <span className="inline-block animate-spin">⏳</span> : "Envoyer le lien"}
      </button>

      {/* Lien de retour à la connexion */}
      <button 
        type="button"
        onClick={onBack} 
        className="flex items-center justify-center gap-2 text-[#94A3B8] font-bold uppercase text-[12px] tracking-widest hover:text-[#2563EB] transition-colors"
      >
        ← Retour à la connexion
      </button>
    </form>
  );
};

export default ForgotPassword;