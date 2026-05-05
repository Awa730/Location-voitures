import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ── Types (cohérents avec VehiculesSection) ──
interface Reservation {
  id: number;
  vehicule: string;
  image: string;
  categorie: string;
  type: "location" | "achat";
  nom: string;
  telephone: string;
  email: string;
  dateDebut?: string;
  dateFin?: string;
  adresse?: string;
  prix: number;
  date: string;
  statut: "En attente" | "Confirmée" | "En cours" | "Terminée" | "Annulée";
  modePaiement?: string;
  whatsappEnvoye?: boolean;
  dateValidation?: string;
}

interface ClientProfileData {
  nom: string;
  email: string;
  telephone: string;
}

const MODES_PAIEMENT = [
  { value: "wave",         label: "Wave",           icon: "🌊" },
  { value: "orange-money", label: "Orange Money",   icon: "🟠" },
  { value: "free-money",   label: "Free Money",     icon: "💚" },
  { value: "carte",        label: "Carte bancaire", icon: "💳" },
  { value: "virement",     label: "Virement",       icon: "🏦" },
  { value: "especes",      label: "Espèces",        icon: "💵" },
];

const getModePaiement = (value?: string) => {
  return MODES_PAIEMENT.find((mode) => mode.value === value);
};

const calcDuree = (debut?: string, fin?: string): number => {
  if (!debut || !fin) return 0;
  const diff = Math.ceil(
    (new Date(fin).getTime() - new Date(debut).getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff > 0 ? diff : 0;
};

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

// ── Carte reservation ──
const CarteReservation = ({ r }: { r: Reservation }) => {
  const duree = calcDuree(r.dateDebut, r.dateFin);
  const montant = r.type === "location" ? r.prix * duree : r.prix;
  const enAttenteValidation = r.statut === "En attente";
  const paiement = getModePaiement(r.modePaiement);

  const statutStyle: Record<string, string> = {
    "En attente": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Confirmée":  "bg-green-50 text-green-700 border-green-200",
    "En cours":   "bg-orange-50 text-orange-700 border-orange-200",
    "Terminée":   "bg-gray-50 text-gray-500 border-gray-200",
    "Annulée":    "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className={`bg-white border rounded-sm overflow-hidden transition-all ${
      enAttenteValidation ? "border-orange-200 shadow-sm shadow-orange-50" : "border-gray-100"
    }`}>
      <div className="flex items-center gap-4 p-5">
        {/* Image */}
        <div className="w-20 h-14 rounded-sm overflow-hidden bg-gray-100 flex-shrink-0">
          <img src={r.image} alt={r.vehicule} className="w-full h-full object-cover" />
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3
                className="text-lg font-black text-gray-900 leading-tight"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {r.vehicule}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded-sm ${
                  r.type === "location"
                    ? "bg-orange-50 text-orange-600 border-orange-200"
                    : "bg-blue-50 text-blue-600 border-blue-200"
                }`}>
                  {r.type === "location" ? "🔑 Location" : "💰 Achat"}
                </span>
                <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 border rounded-sm ${statutStyle[r.statut]}`}>
                  {r.statut}
                </span>
                {paiement && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 border rounded-sm bg-slate-50 text-slate-600 border-slate-200">
                    {paiement.icon} {paiement.label}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p
                className="text-xl font-black text-orange-500 leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {montant.toLocaleString("fr-FR")}
              </p>
              <p className="text-xs text-gray-400">FCFA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Détails bas */}
      <div className="border-t border-gray-50 bg-gray-50 px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {r.type === "location" && r.dateDebut && r.dateFin ? (
            <>
              <span>📅 {formatDate(r.dateDebut)} → {formatDate(r.dateFin)}</span>
              <span className="text-orange-500 font-semibold">{duree} j</span>
            </>
          ) : (
            <span>🗓️ Commandé le {r.date}</span>
          )}
          <span className="hidden sm:inline">👤 {r.nom}</span>
        </div>

        {enAttenteValidation ? (
          <div className="text-right">
            <span className="block text-xs text-orange-600 uppercase tracking-widest font-semibold">
              Validation admin en cours
            </span>
            <span className="block text-[10px] text-gray-400 uppercase tracking-widest mt-1">
              Vous recevrez un message WhatsApp après validation
            </span>
          </div>
        ) : (
          <div className="text-right">
            <span className="block text-xs text-gray-400 uppercase tracking-widest font-semibold">
              {r.statut === "Confirmée" ? "✅ Confirmée" : r.statut}
            </span>
            {r.whatsappEnvoye && (
              <span className="block text-[10px] text-green-600 uppercase tracking-widest mt-1">
                WhatsApp préparé
              </span>
            )}
            {!r.whatsappEnvoye && paiement && (
              <span className="block text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                Paiement : {paiement.label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Dashboard utilisateur principal ──
export default function UserDashboard() {
  const navigate = useNavigate();
  const [reservations] = useState<Reservation[]>(() => {
    return JSON.parse(localStorage.getItem("reservations") || "[]") as Reservation[];
  });
  const [profile, setProfile] = useState<ClientProfileData>(() => {
    const stored = localStorage.getItem("clientProfile");
    const userEmail = localStorage.getItem("userEmail") || "";
    return stored ? JSON.parse(stored) : { nom: "", email: userEmail, telephone: "" };
  });
  const [message, setMessage] = useState("");
  const [onglet, setOnglet] = useState<"tous" | "location" | "achat">("tous");
  const activeEmail = (profile.email || localStorage.getItem("userEmail") || "").trim().toLowerCase();
  const clientReservations = reservations.filter((r) => {
    if (!activeEmail) return true;
    return !r.email || r.email.trim().toLowerCase() === activeEmail;
  });

  const handleSaveProfile = () => {
    localStorage.setItem("clientProfile", JSON.stringify(profile));
    localStorage.setItem("userEmail", profile.email);
    setMessage("Profil mis à jour avec succès.");
    window.setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("utilisateur");
    navigate("/");
  };

  const filtered = clientReservations.filter(
    (r) => onglet === "tous" || r.type === onglet
  );

  const enAttente = clientReservations.filter((r) => r.statut === "En attente").length;
  const confirmees = clientReservations.filter((r) => r.statut === "Confirmée").length;
  const nbLocations = clientReservations.filter((r) => r.type === "location").length;
  const nbAchats = clientReservations.filter((r) => r.type === "achat").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-lg font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>M</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase">Movia Automobile</p>
              <h1
                className="text-base font-black text-gray-900 leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Tableau de bord client
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs tracking-widest uppercase text-gray-400 hover:text-orange-500 border-b border-transparent hover:border-orange-400 transition-all pb-0.5"
            >
              Accueil
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <section className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm">
            <p className="text-xs tracking-widest uppercase text-orange-500 font-semibold mb-2">
              Mon profil
            </p>
            <h2
              className="text-2xl font-black text-gray-900 mb-5"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Personnaliser mes informations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={profile.nom}
                  onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                  placeholder="Votre nom"
                  className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 focus:border-orange-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="votre@email.com"
                  className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 focus:border-orange-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={profile.telephone}
                  onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
                  placeholder="+221 77 000 00 00"
                  className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 focus:border-orange-300 outline-none"
                />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-4 flex-wrap">
              <button
                onClick={handleSaveProfile}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all"
              >
                Mettre à jour mon profil
              </button>
              {message && <p className="text-sm text-green-700">{message}</p>}
            </div>
          </div>

          <aside className="bg-gray-900 text-white rounded-sm p-6 shadow-sm">
            <p className="text-xs tracking-widest uppercase text-orange-300 font-semibold mb-2">
              Espace client
            </p>
            <h2
              className="text-3xl font-black leading-none mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {profile.nom || "Bienvenue chez Movia"}
            </h2>
            <div className="space-y-3 text-sm text-gray-300">
              <p>{profile.email || "Email non renseigné"}</p>
              <p>{profile.telephone || "Téléphone non renseigné"}</p>
              <p className="text-orange-300 font-semibold">
                {clientReservations.length} réservation{clientReservations.length > 1 ? "s" : ""} liée{clientReservations.length > 1 ? "s" : ""} à ce compte
              </p>
            </div>
          </aside>
        </section>

        {/* Bannière si réservations en attente */}
        {enAttente > 0 && (
          <div className="bg-orange-500 text-white rounded-sm px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs tracking-widest uppercase font-semibold opacity-80 mb-0.5">Action requise</p>
              <p className="font-black text-lg" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {enAttente} réservation{enAttente > 1 ? "s" : ""} en attente de confirmation
              </p>
            </div>
            <span className="text-4xl">⏳</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "En attente",  value: enAttente,          color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100"  },
            { label: "Confirmées",  value: confirmees,          color: "text-green-600",  bg: "bg-green-50 border-green-100"    },
            { label: "Locations",   value: nbLocations,         color: "text-orange-500", bg: "bg-orange-50 border-orange-100"  },
            { label: "Achats",      value: nbAchats,            color: "text-blue-600",   bg: "bg-blue-50 border-blue-100"      },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-sm px-4 py-3`}>
              <p className={`text-3xl font-black ${s.color}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {s.value}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Onglets filtre */}
        <div className="flex gap-2">
          {([
            { key: "tous",     label: "Tout voir"   },
            { key: "location", label: "🔑 Locations" },
            { key: "achat",    label: "💰 Achats"    },
          ] as const).map((o) => (
            <button
              key={o.key}
              onClick={() => setOnglet(o.key)}
              className={`px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-sm border transition-all ${
                onglet === o.key
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 bg-white"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Liste */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white border border-gray-100 rounded-sm">
            <p className="text-5xl mb-4">🚗</p>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Aucune réservation</p>
            <p className="text-sm text-gray-500 mb-6">Parcourez notre flotte et faites votre choix.</p>
            <a
              href="/#vehicles"
              className="px-6 py-3 bg-orange-500 text-white text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-orange-600 transition-all"
            >
              Voir les véhicules →
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            </p>
            {filtered.map((r) => (
              <CarteReservation
                key={r.id}
                r={r}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
