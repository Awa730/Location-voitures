import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import ForgotPassword from "./ForgotPassword";
import SignUp from "./SignUp";

// Identifiants admin (centralisés ici, pas de page admin séparée)
const ADMIN_EMAIL = "movia@automobile.com";
const ADMIN_PASSWORD = "Admins2026";

interface UserLoginPageProps {
  initialView?: "login" | "signup" | "forgot";
}

const UserLoginPage: React.FC<UserLoginPageProps> = ({ initialView = "login" }) => {
  const [view, setView] = useState<"login" | "signup" | "forgot">(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const authCopy = {
    login: {
      title: "Accès Client",
      subtitle: "Retrouvez vos contrats de location et d'achat",
    },
    signup: {
      title: "Inscription Client",
      subtitle: "Créez votre compte pour réserver vos véhicules",
    },
    forgot: {
      title: "Récupération",
      subtitle: "Réinitialisez votre mot de passe client",
    },
  }[view];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      // ── Vérification admin en priorité ──
      if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        if (password === ADMIN_PASSWORD) {
          localStorage.setItem("adminAuthenticated", "true");
          localStorage.setItem("adminEmail", email);
          navigate("/admin/dashboard");
        } else {
          setError("Mot de passe administrateur incorrect.");
        }
        setLoading(false);
        return;
      }

      // ── Connexion client normal ──
      const storedProfile = JSON.parse(localStorage.getItem("clientProfile") || "{}");
      localStorage.setItem("utilisateur", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem(
        "clientProfile",
        JSON.stringify({
          nom: storedProfile.nom || "",
          email,
          telephone: storedProfile.telephone || "",
        })
      );
      setLoading(false);
      navigate("/client/dashboard");
    }, 1500);
  };

  // Redirection déconnexion vers /login/client (cohérent avec App.tsx)

  return (
    <AuthLayout
      title={authCopy.title}
      subtitle={authCopy.subtitle}
      isReserved={true}
    >
      {view === "login" ? (
        <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">✉️</span>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[50px] pl-11 bg-[#F8FAFC] border-2 border-transparent rounded-[14px] focus:border-[#F97316]/20 outline-none transition-all font-semibold"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">
              Mot de passe
            </label>
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
            {loading ? <span className="inline-block animate-spin">⏳</span> : "Se connecter"}
          </button>

          <div className="text-center">
            <p className="text-[#94A3B8] text-sm font-medium mb-3">
              Nouveau ?{" "}
              <button
                type="button"
                onClick={() => setView("signup")}
                className="text-[#F97316] font-black uppercase hover:underline"
              >
                S'inscrire
              </button>
            </p>
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
      ) : view === "signup" ? (
        <SignUp
          onSignUp={() => navigate("/client/dashboard")}
          onSwitchToLogin={() => setView("login")}
        />
      ) : (
        <ForgotPassword onBack={() => setView("login")} />
      )}
    </AuthLayout>
  );
};

export default UserLoginPage;