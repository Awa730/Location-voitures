import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthLayout from "./AuthLayout";
import ForgotPassword from "./ForgotPassword";
import SignUp from "./SignUp";
import { login, googleAuth } from "../services/api";

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

  // Google OAuth success handler → appel API
  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    setLoading(true);
    setError("");
    if (!credentialResponse.credential) return;

    try {
      const data = await googleAuth(credentialResponse.credential);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.nom);
      localStorage.setItem("userEmail", data.user.email);

      // Compatibilité avec l'ancien code du frontend
      if (data.user.role === "admin") {
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminEmail", data.user.email);
        navigate("/admin/dashboard");
      } else {
        localStorage.setItem("utilisateur", "true");
        localStorage.setItem("clientProfile", JSON.stringify({
          nom: data.user.nom,
          email: data.user.email,
          telephone: data.user.telephone || "",
        }));
        navigate("/client/dashboard");
      }
    } catch {
      setError("Erreur lors de la connexion Google");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Échec de la connexion Google");
    setLoading(false);
  };

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

  // Handle email/password login → appel API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.nom);
      localStorage.setItem("userEmail", data.user.email);

      // Compatibilité avec l'ancien code du frontend
      if (data.user.role === "admin") {
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminEmail", data.user.email);
        navigate("/admin/dashboard");
      } else {
        localStorage.setItem("utilisateur", "true");
        localStorage.setItem("clientProfile", JSON.stringify({
          nom: data.user.nom,
          email: data.user.email,
          telephone: data.user.telephone || "",
        }));
        navigate("/client/dashboard");
      }
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={authCopy.title}
      subtitle={authCopy.subtitle}
      isReserved={true}
    >
      {view === "login" ? (
        <div className="flex flex-col items-center">
          <div className="flex flex-col w-full space-y-4">
            <form onSubmit={handleLogin} className="w-full space-y-3">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="flex flex-col">
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

              {/* Password Field */}
              <div className="flex flex-col">
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

              {/* Submit Buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[50px] bg-[#0F172A] text-white font-black rounded-[15px] shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.18em]"
                >
                  {loading ? (
                    <span className="inline-block animate-spin">⏳</span>
                  ) : (
                    "Se connecter"
                  )}
                </button>

                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    shape="rectangular"
                    size="large"
                    text="signin_with"
                    containerProps={{
                      className: "w-full !justify-center",
                      style: { width: "100%" },
                    }}
                  />
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-sm font-black text-[#F97316] uppercase tracking-tighter"
                >
                  Oublié ?
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
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
          </div>
        </div>
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