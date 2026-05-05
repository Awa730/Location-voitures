import React, { useState } from "react";

interface LoginFormProps {
  onLogin: () => void;
  onSwitchToSignUp: () => void;
  onSwitchToForgot: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignUp, onSwitchToForgot }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    
    setTimeout(() => {
      setLoading(false); 
      onLogin(); 
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">Email Client</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">✉️</span>
          <input 
            type="email" 
            placeholder="votre@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[60px] pl-12 bg-[#F8FAFC] border-2 border-transparent rounded-[18px] focus:border-[#F97316]/20 outline-none transition-all font-semibold" 
            required 
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">Mot de passe</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">🔒</span>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[60px] pl-12 pr-12 bg-[#F8FAFC] border-2 border-transparent rounded-[18px] focus:border-[#F97316]/20 outline-none transition-all font-semibold" 
            required 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg">
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={onSwitchToForgot} className="text-sm font-black text-[#F97316] uppercase tracking-tighter">Oublié ?</button>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full h-[64px] bg-[#0F172A] text-white font-black rounded-[20px] shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
      >
        {loading ? <span className="inline-block animate-spin">⏳</span> : "Accéder à l'espace client"}
      </button>

      <p className="text-center text-[#94A3B8] text-sm font-medium">
        <button type="button" onClick={onSwitchToSignUp} className="text-[#F97316] font-black uppercase hover:underline">S'inscrire</button>
      </p>
    </form>
  );
};

export default LoginForm;
