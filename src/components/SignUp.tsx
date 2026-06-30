import React, { useState } from "react";
import { register } from "../services/api";

interface SignUpProps {
  onSignUp: () => void;
  onSwitchToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onSwitchToLogin }) => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Appel API pour créer le compte
      const data = await register(nom, email, password);

      // Sauvegarder le token JWT
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.nom);
      localStorage.setItem("userEmail", data.user.email);

      // Compatibilité avec l'ancien code frontend
      localStorage.setItem("utilisateur", "true");
      localStorage.setItem("clientProfile", JSON.stringify({
        nom: data.user.nom,
        email: data.user.email,
        telephone: "",
      }));

      onSignUp(); // Redirige vers /client/dashboard
    } catch (err) {
      setError("Email déjà utilisé ou erreur serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

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
            placeholder="Ex: Amadou Diallo"
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
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#F97316] text-lg"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <p className="text-xs text-gray-400 ml-1">Minimum 6 caractères</p>
      </div>

      {/* BOUTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-[50px] bg-[#0F172A] hover:bg-black text-white font-black rounded-[15px] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase tracking-[0.18em] mt-2"
      >
        {loading ? <span className="inline-block animate-spin">⏳</span> : "Créer mon compte"}
      </button>

      {/* LIEN CONNEXION */}
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