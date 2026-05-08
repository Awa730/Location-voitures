import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// --- SECTIONS DE LA LANDING PAGE ---
import Navbar from "./landing/Navbar";
import Hero from "./landing/Hero";
import MarqueeStrip from "./landing/MarqueeStrip";
import VehiculesSection from "./landing/VehiculesSection";
import HowItWorks from "./landing/HowItWorks";
import Temoignages from "./landing/Temoignages";
import Offres from "./landing/Offres";
import Footer from "./landing/Footer";

// --- AUTHENTIFICATION ---
// Un seul composant de login : l'email admin redirige vers /admin/dashboard automatiquement
import ClientLoginPage from "./components/UserLoginPage";

// --- DASHBOARDS ---
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ClientProfile from "./pages/ClientProfile";

/**
 * Protection route Admin
 * Si non connecté en tant qu'admin → redirige vers /login/client (plus de page /login/admin)
 */
const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    if (!isAdminAuthenticated) {
      navigate("/login/client");
    }
  }, [navigate]);

  const isAdminAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
  return isAdminAuthenticated ? <>{children}</> : null;
};

/**
 * Protection route Client
 * Si non connecté → redirige vers /login/client
 */
const ClientProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const isClientAuthenticated = localStorage.getItem("utilisateur") === "true";
    if (!isClientAuthenticated) {
      navigate("/login/client");
    }
  }, [navigate]);

  const isClientAuthenticated = localStorage.getItem("utilisateur") === "true";
  return isClientAuthenticated ? <>{children}</> : null;
};

/**
 * Landing Page
 */
const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main>
      <Hero />
      <MarqueeStrip />
      <VehiculesSection />
      <HowItWorks />
      <Offres />
      <Temoignages />
    </main>
    <Footer />
  </div>
);

/**
 * Routes d'authentification
 * Plus de route /login/admin — tout passe par /login/client
 * L'email movia@automobile.com est détecté dans UserLoginPage et redirige vers /admin/dashboard
 */
const AuthRoutes = () => {
  return (
    <Routes>
      {/* Route principale de connexion (clients + admin via détection d'email) */}
      <Route path="/login/client" element={<ClientLoginPage />} />

      {/* Ancienne route admin → redirige vers login client */}
      <Route path="/login/admin" element={<Navigate to="/login/client" replace />} />

      {/* Route générique */}
      <Route path="login" element={<ClientLoginPage />} />

      {/* Inscription */}
      <Route path="register" element={<ClientLoginPage initialView="signup" />} />

      {/* Mot de passe oublié */}
      <Route path="forgot-password" element={<ClientLoginPage initialView="forgot" />} />
    </Routes>
  );
};

/**
 * App principal
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 1. Accueil */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Authentification */}
        <Route path="/*" element={<AuthRoutes />} />

        {/* 3. Dashboard client */}
        <Route
          path="/dashboard"
          element={
            <ClientProtectedRoute>
              <UserDashboard />
            </ClientProtectedRoute>
          }
        />
        <Route
          path="/client/dashboard"
          element={
            <ClientProtectedRoute>
              <UserDashboard />
            </ClientProtectedRoute>
          }
        />
        <Route
          path="/client/profile"
          element={
            <ClientProtectedRoute>
              <ClientProfile />
            </ClientProtectedRoute>
          }
        />

        {/* 4. Dashboard admin — protégé, accès uniquement si adminAuthenticated = true */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
