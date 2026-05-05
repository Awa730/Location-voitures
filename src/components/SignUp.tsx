import React, { useState } from "react";

interface SignUpProps {
  onSignUp: () => void;
  onSwitchToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onSwitchToLogin }) => {
  // Utilisation des states pour la gestion de l'interface et du chargement 
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation de création de compte pour la location de voitures
    setTimeout(() => {
      localStorage.setItem("utilisateur", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem(
        "clientProfile",
          JSON.stringify({ nom, email, telephone: "" })
      );
      setLoading(false);
      onSignUp(); // Appelle le callback du parent
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      
      {/* CHAMP NOM COMPLET */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">
          Nom Complet
        </label>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#F97316] transition-colors">👤</span>
          <input 
            type="text" 
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Jean Dupont"
            className="w-full h-[50px] pl-11 bg-[#F8FAFC] border-2 border-transparent rounded-[14px] focus:bg-white focus:border-[#F97316]/20 outline-none transition-all font-semibold"
            required
          />
        </div>
      </div>

      {/* CHAMP EMAIL */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">
          Email
        </label>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#F97316] transition-colors">✉️</span>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full h-[50px] pl-11 bg-[#F8FAFC] border-2 border-transparent rounded-[14px] focus:bg-white focus:border-[#F97316]/20 outline-none transition-all font-semibold"
            required
          />
        </div>
      </div>

      {/* CHAMP MOT DE PASSE */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">
          Mot de passe
        </label>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#F97316] transition-colors">🔒</span>
          <input 
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full h-[50px] pl-11 pr-11 bg-[#F8FAFC] border-2 border-transparent rounded-[14px] focus:bg-white focus:border-[#F97316]/20 outline-none transition-all font-semibold"
            required
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#F97316] text-lg"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </div>

      {/* BOUTON D'ACTION  */}
      <button 
        type="submit"
        disabled={loading}
        className="w-full h-[50px] bg-[#0F172A] hover:bg-black text-white font-black rounded-[15px] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase tracking-[0.18em] mt-2"
      >
        {loading ? <span className="inline-block animate-spin">⏳</span> : "Créer mon compte"}
      </button>

      {/* LIEN VERS CONNEXION */}
      <div className="text-center mt-2">
        <p className="text-[#94A3B8] text-[14px] font-medium">
          Déjà un compte ?{" "}
          <button 
            type="button"
            onClick={onSwitchToLogin}
            className="text-[#F97316] font-black uppercase hover:underline"
          >
            Se connecter
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignUp;
