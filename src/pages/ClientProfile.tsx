import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface ClientProfileData {
  nom: string;
  email: string;
  telephone: string;
}

export default function ClientProfile() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<ClientProfileData>(() => {
    const stored = localStorage.getItem("clientProfile");
    return stored ? JSON.parse(stored) : { nom: "", email: "", telephone: "" };
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const isClientAuthenticated = localStorage.getItem("utilisateur") === "true";
    if (!isClientAuthenticated) {
      navigate("/login/client");
      return;
    }
  }, [navigate]);

  const handleSave = () => {
    localStorage.setItem("clientProfile", JSON.stringify(profile));
    setMessage("Profil mis à jour avec succès.");
    window.setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("utilisateur");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-sm bg-white shadow-sm hover:border-orange-300 transition-all"
          >
            <span className="text-base">☰</span>
            <span className="text-xs uppercase tracking-widest text-gray-600">Menu client</span>
          </button>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">Espace client</p>
            <h1 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Mon profil
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="max-w-5xl mx-auto px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/client/dashboard"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 bg-orange-50 border border-orange-100 text-orange-700 font-semibold uppercase tracking-widest rounded-sm text-center"
            >
              Mes réservations
            </Link>
            <Link
              to="/client/profile"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-semibold uppercase tracking-widest rounded-sm text-center"
            >
              Profil
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="px-4 py-3 bg-red-500 text-white font-semibold uppercase tracking-widest rounded-sm text-center"
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-8">
            <p className="text-xs uppercase tracking-widest text-orange-500 mb-4">Gestion du compte</p>
            <h2 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Modifie tes informations
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={profile.nom}
                  onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                  className="w-full h-14 px-4 border border-gray-200 rounded-sm bg-gray-50 focus:border-orange-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full h-14 px-4 border border-gray-200 rounded-sm bg-gray-50 focus:border-orange-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={profile.telephone}
                  onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
                  className="w-full h-14 px-4 border border-gray-200 rounded-sm bg-gray-50 focus:border-orange-300 outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="mt-8 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest rounded-sm transition-all"
            >
              Mettre à jour mon profil
            </button>
            {message && (
              <p className="mt-4 text-sm text-green-700">{message}</p>
            )}
          </div>

          <aside className="bg-white border border-gray-100 rounded-sm shadow-sm p-8">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Informations client</p>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-sm p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">Nom</p>
                <p className="font-semibold text-gray-900">{profile.nom || "Non renseigné"}</p>
              </div>
              <div className="bg-gray-50 rounded-sm p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{profile.email || "Non renseigné"}</p>
              </div>
              <div className="bg-gray-50 rounded-sm p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">Téléphone</p>
                <p className="font-semibold text-gray-900">{profile.telephone || "Non renseigné"}</p>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
