import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// --- SECTIONS DE LA LANDING PAGE (Dossier /landing) ---
import Navbar from "./landing/Navbar";
import Hero from "./landing/Hero";
import MarqueeStrip from "./landing/MarqueeStrip";
import VehiculesSection from "./landing/VehiculesSection";
import HowItWorks from "./landing/HowItWorks"; 
import Temoignages from "./landing/Temoignages";
import Offres from "./landing/Offres";
import Footer from "./landing/Footer";

// --- AUTHENTIFICATION (Dossier /assets/components) ---
import ClientLoginPage from "./components/UserLoginPage";
import AdminLoginPage from "./components/AdminLoginPage";

// --- DASHBOARD (Dossier /pages) ---
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ClientProfile from "./pages/ClientProfile";

/**
 * COMPOSANT DE PROTECTION POUR LES ROUTES ADMIN
 */
const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    if (!isAdminAuthenticated) {
      navigate("/login/admin");
    }
  }, [navigate]);

  const isAdminAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
  return isAdminAuthenticated ? <>{children}</> : null;
};

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
 * COMPOSANT LANDING PAGE
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
 * COMPOSANT DE ROUTAGE POUR L'AUTHENTIFICATION
 */
const AuthRoutes = () => {
  return (
    <Routes>
      {/* Connexions séparées Admin et Client */}
      <Route path="/login/admin" element={<AdminLoginPage />} />
      <Route path="/login/client" element={<ClientLoginPage />} />

      {/* Connexion générique */}
      <Route path="login" element={<ClientLoginPage />} />
      
      {/* Inscription */}
      <Route path="register" element={<ClientLoginPage initialView="signup" />} />

      {/* Mot de passe oublié */}
      <Route path="forgot-password" element={<ClientLoginPage initialView="forgot" />} />
    </Routes>
  );
};

/**
 * COMPOSANT APP PRINCIPAL
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 1. Accueil */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Authentification */}
        <Route path="/*" element={<AuthRoutes />} />

        {/* 3. Dashboards */}
        <Route path="/dashboard" element={
          <ClientProtectedRoute>
            <UserDashboard />
          </ClientProtectedRoute>
        } />
        <Route path="/client/dashboard" element={
          <ClientProtectedRoute>
            <UserDashboard />
          </ClientProtectedRoute>
        } />
        <Route path="/client/profile" element={
          <ClientProtectedRoute>
            <ClientProfile />
          </ClientProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
