import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import ForgotPassword from "./ForgotPassword";

const AdminLoginPage: React.FC = () => {
  const [view, setView] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Identifiants admin spécifiques
  const ADMIN_CREDENTIALS = {
    email: "movia@automobile.com",
    password: "Admins2026"
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulation de vérification des identifiants
    setTimeout(() => {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Stocker le statut admin dans localStorage pour la protection des routes
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminEmail", email);
        navigate("/admin/dashboard");
      } else {
        setError("Identifiants administrateur incorrects");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <AuthLayout
      title="Accès Administrateur"
      subtitle="Gestion de la flotte et suivi des transactions"
      isReserved={true}
    >
      {view === "login" ? (
        <form onSubmit={handleAdminLogin} className="flex flex-col gap-3.5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">Email Administrateur</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">✉️</span>
              <input
                type="email"
                placeholder="movia@automobile.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[50px] pl-11 bg-[#F8FAFC] border-2 border-transparent rounded-[14px] focus:border-[#F97316]/20 outline-none transition-all font-semibold"
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
                className="w-full h-[50px] pl-11 pr-11 bg-[#F8FAFC] border-2 border-transparent rounded-[14px] focus:border-[#F97316]/20 outline-none transition-all font-semibold"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setView("forgot")}
              className="text-sm font-black text-[#F97316] uppercase tracking-tighter"
            >
              Oublié ?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] bg-[#0F172A] text-white font-black rounded-[15px] shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.18em]"
          >
            {loading ? <span className="inline-block animate-spin">⏳</span> : "Accéder au panneau admin"}
          </button>

          <div className="text-center">
            <p className="text-[#94A3B8] text-sm font-medium">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-[#F97316] font-black uppercase hover:underline"
              >
                Retour à l'accueil
              </button>
            </p>
          </div>
        </form>
      ) : (
        <ForgotPassword onBack={() => setView("login")} />
      )}
    </AuthLayout>
  );
};

export default AdminLoginPage;
