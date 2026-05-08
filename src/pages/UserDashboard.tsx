import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ── Types ──
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
  numerotransaction?: string;
  paiementValide?: boolean;
}

interface ClientProfileData {
  nom: string;
  email: string;
  telephone: string;
}

// ── Modes de paiement mobile money / carte ──
const MODES_PAIEMENT = [
  { value: "wave",         label: "Wave",           icon: "🌊", numero: "+221 77 100 20 30", couleur: "bg-blue-50 border-blue-300 text-blue-700" },
  { value: "orange-money", label: "Orange Money",   icon: "🟠", numero: "+221 77 800 90 10", couleur: "bg-orange-50 border-orange-300 text-orange-700" },
  { value: "free-money",   label: "Free Money",     icon: "💚", numero: "+221 76 200 30 40", couleur: "bg-green-50 border-green-300 text-green-700" },
  { value: "carte",        label: "Carte bancaire", icon: "💳", numero: null,                couleur: "bg-slate-50 border-slate-300 text-slate-700" },
];

const getModePaiement = (value?: string) =>
  MODES_PAIEMENT.find((m) => m.value === value);

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

// ── Génère un numéro de transaction unique ──
const genererNumeroTransaction = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MVA-TXN-${ts}-${rand}`;
};

// ── Modal de paiement ──
const ModalPaiement = ({
  reservation,
  onClose,
  onConfirm,
}: {
  reservation: Reservation;
  onClose: () => void;
  onConfirm: (modePaiement: string, numeroTransaction: string) => void;
}) => {
  const [etape, setEtape] = useState<"choix" | "instructions" | "saisie" | "succes">("choix");
  const [modeChoisi, setModeChoisi] = useState<string | null>(null);
  const [numeroSaisi, setNumeroSaisi] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionGeneree, setTransactionGeneree] = useState("");

  const duree = calcDuree(reservation.dateDebut, reservation.dateFin);
  const montant = reservation.type === "location" ? reservation.prix * duree : reservation.prix;
  const mode = getModePaiement(modeChoisi || undefined);
  const ref = `MVA-${String(reservation.id).padStart(5, "0")}`;

  const handleChoisirMode = (value: string) => {
    setModeChoisi(value);
    setEtape("instructions");
  };

  const handleContinuer = () => {
    const txn = genererNumeroTransaction();
    setTransactionGeneree(txn);
    setEtape("saisie");
  };

  const handleValiderPaiement = () => {
    if (!numeroSaisi.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEtape("succes");
      onConfirm(modeChoisi!, transactionGeneree);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-orange-300 uppercase tracking-widest font-semibold">Paiement</p>
            <h2 className="text-xl font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {reservation.vehicule}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-orange-400" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {montant.toLocaleString("fr-FR")}
            </p>
            <p className="text-xs text-gray-400">FCFA · Réf. {ref}</p>
          </div>
        </div>

        <div className="p-6">
          {/* ÉTAPE 1 — Choisir le mode */}
          {etape === "choix" && (
            <div>
              <p className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest">
                Choisissez votre mode de paiement
              </p>
              <div className="grid grid-cols-2 gap-3">
                {MODES_PAIEMENT.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => handleChoisirMode(m.value)}
                    className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl font-bold transition-all hover:scale-105 ${m.couleur}`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-xs uppercase tracking-widest">{m.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={onClose}
                className="mt-4 w-full text-xs text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          )}

          {/* ÉTAPE 2 — Instructions de paiement */}
          {etape === "instructions" && mode && (
            <div>
              <div className={`rounded-xl border-2 p-4 mb-4 ${mode.couleur}`}>
                <p className="text-lg font-black mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {mode.icon} {mode.label}
                </p>
                {mode.numero ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-70">
                      Envoyez le montant au numéro suivant :
                    </p>
                    <p className="text-2xl font-black tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {mode.numero}
                    </p>
                    <p className="text-xs mt-2 opacity-70">
                      Montant exact : <strong>{montant.toLocaleString("fr-FR")} FCFA</strong>
                    </p>
                    <p className="text-xs opacity-70">
                      Référence à indiquer : <strong>{ref}</strong>
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-semibold mt-1 opacity-80">
                    Vous recevrez un lien de paiement sécurisé par email après validation.
                  </p>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 mb-4">
                ⚠️ Effectuez d'abord le paiement, puis cliquez sur "J'ai payé" pour saisir votre numéro de transaction.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEtape("choix")}
                  className="flex-1 py-3 border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-50 transition-all"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleContinuer}
                  className="flex-1 py-3 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-orange-600 transition-all"
                >
                  J'ai payé →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — Saisie numéro de transaction */}
          {etape === "saisie" && mode && (
            <div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Votre numéro de transaction généré</p>
                <p className="font-black text-lg text-gray-900 tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {transactionGeneree}
                </p>
                <p className="text-xs text-gray-400 mt-1">Conservez ce numéro comme preuve de paiement.</p>
              </div>

              <div className="mb-4">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">
                  {mode.numero
                    ? "Numéro de transaction reçu par SMS (ex: TX12345678)"
                    : "Référence de paiement carte bancaire"}
                </label>
                <input
                  type="text"
                  value={numeroSaisi}
                  onChange={(e) => setNumeroSaisi(e.target.value)}
                  placeholder={mode.numero ? "Entrez le numéro reçu par SMS..." : "Référence carte..."}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-orange-400 outline-none text-sm font-semibold transition-colors"
                />
              </div>

              <button
                onClick={handleValiderPaiement}
                disabled={!numeroSaisi.trim() || loading}
                className="w-full py-4 bg-gray-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? <span className="animate-spin inline-block">⏳</span> : "✅ Confirmer mon paiement"}
              </button>
            </div>
          )}

          {/* ÉTAPE 4 — Succès */}
          {etape === "succes" && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Paiement soumis !
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Votre paiement a été transmis à l'équipe Movia Automobile pour validation.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-[10px] uppercase tracking-widest text-green-600 font-bold mb-1">Numéro de transaction</p>
                <p className="font-black text-green-800 tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {transactionGeneree}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  📩 L'admin recevra une notification. Vous serez confirmé par WhatsApp.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-all"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Carte reservation ──
const CarteReservation = ({
  r,
  onPayer,
}: {
  r: Reservation;
  onPayer: (id: number) => void;
}) => {
  const duree = calcDuree(r.dateDebut, r.dateFin);
  const montant = r.type === "location" ? r.prix * duree : r.prix;
  const enAttenteValidation = r.statut === "En attente";
  const peutPayer = enAttenteValidation && !r.paiementValide;
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
      peutPayer ? "border-orange-300 shadow-md shadow-orange-50" : "border-gray-100"
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
              <h3 className="text-lg font-black text-gray-900 leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {r.vehicule}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
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
                {r.paiementValide && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 border rounded-sm bg-green-50 text-green-700 border-green-200">
                    ✅ Paiement soumis
                  </span>
                )}
                {paiement && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 border rounded-sm bg-slate-50 text-slate-600 border-slate-200">
                    {paiement.icon} {paiement.label}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-orange-500 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
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

        {/* Bouton payer ou statut */}
        {peutPayer ? (
          <button
            onClick={() => onPayer(r.id)}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all shadow-sm animate-pulse"
          >
            💳 Payer maintenant
          </button>
        ) : r.paiementValide ? (
          <div className="text-right">
            <span className="block text-xs text-green-600 uppercase tracking-widest font-semibold">
              Paiement en cours de validation
            </span>
            {r.numerotransaction && (
              <span className="block text-[10px] text-gray-400 font-mono mt-1">
                Réf : {r.numerotransaction}
              </span>
            )}
          </div>
        ) : (
          <div className="text-right">
            <span className="block text-xs text-gray-400 uppercase tracking-widest font-semibold">
              {r.statut === "Confirmée" ? "✅ Confirmée" : r.statut}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Dashboard principal ──
export default function UserDashboard() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    return JSON.parse(localStorage.getItem("reservations") || "[]") as Reservation[];
  });
  const [profile, setProfile] = useState<ClientProfileData>(() => {
    const stored = localStorage.getItem("clientProfile");
    const userEmail = localStorage.getItem("userEmail") || "";
    return stored ? JSON.parse(stored) : { nom: "", email: userEmail, telephone: "" };
  });
  const [message, setMessage] = useState("");
  const [onglet, setOnglet] = useState<"tous" | "location" | "achat">("tous");
  const [reservationAPayer, setReservationAPayer] = useState<Reservation | null>(null);

  const activeEmail = (profile.email || localStorage.getItem("userEmail") || "").trim().toLowerCase();
  const clientReservations = reservations.filter((r) => {
    if (!activeEmail) return true;
    return !r.email || r.email.trim().toLowerCase() === activeEmail;
  });

  const filtered = clientReservations.filter((r) =>
    onglet === "tous" ? true : r.type === onglet
  );

  const enAttente  = clientReservations.filter((r) => r.statut === "En attente").length;
  const confirmees = clientReservations.filter((r) => r.statut === "Confirmée").length;
  const nbLocations= clientReservations.filter((r) => r.type === "location").length;
  const nbAchats   = clientReservations.filter((r) => r.type === "achat").length;

  const handleLogout = () => {
    localStorage.removeItem("utilisateur");
    localStorage.removeItem("userEmail");
    navigate("/login/client");
  };

  const handleSaveProfile = () => {
    localStorage.setItem("clientProfile", JSON.stringify(profile));
    setMessage("✅ Profil mis à jour !");
    setTimeout(() => setMessage(""), 3000);
  };

  // ── Ouvrir le modal de paiement ──
  const handleOuvrirPaiement = (id: number) => {
    const r = reservations.find((res) => res.id === id) || null;
    setReservationAPayer(r);
  };

  // ── Enregistrer le paiement + notifier l'admin dans localStorage ──
  const handleConfirmerPaiement = (modePaiement: string, numeroTransaction: string) => {
    const updated = reservations.map((r) => {
      if (r.id === reservationAPayer?.id) {
        return {
          ...r,
          modePaiement,
          numerotransaction: numeroTransaction,
          paiementValide: true,
        };
      }
      return r;
    });
    setReservations(updated);
    localStorage.setItem("reservations", JSON.stringify(updated));

    // ── Notification admin dans localStorage ──
    const notifications: object[] = JSON.parse(
      localStorage.getItem("adminNotifications") || "[]"
    );
    notifications.push({
      id: Date.now(),
      lu: false,
      date: new Date().toLocaleString("fr-FR"),
      message: `💳 Nouveau paiement soumis`,
      details: {
        client: reservationAPayer?.nom || profile.nom || activeEmail,
        vehicule: reservationAPayer?.vehicule,
        montant: reservationAPayer
          ? (reservationAPayer.type === "location"
              ? reservationAPayer.prix * calcDuree(reservationAPayer.dateDebut, reservationAPayer.dateFin)
              : reservationAPayer.prix
            ).toLocaleString("fr-FR") + " FCFA"
          : "—",
        modePaiement,
        numeroTransaction,
        reservationId: `MVA-${String(reservationAPayer?.id).padStart(5, "0")}`,
      },
    });
    localStorage.setItem("adminNotifications", JSON.stringify(notifications));

    setReservationAPayer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal de paiement */}
      {reservationAPayer && (
        <ModalPaiement
          reservation={reservationAPayer}
          onClose={() => setReservationAPayer(null)}
          onConfirm={handleConfirmerPaiement}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-lg font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>M</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase">Movia Automobile</p>
              <h1 className="text-base font-black text-gray-900 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
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
        {/* Profil + carte */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm">
            <p className="text-xs tracking-widest uppercase text-orange-500 font-semibold mb-2">Mon profil</p>
            <h2 className="text-2xl font-black text-gray-900 mb-5" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Personnaliser mes informations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Nom complet",   field: "nom",       type: "text",  placeholder: "Votre nom" },
                { label: "Email",          field: "email",     type: "email", placeholder: "votre@email.com" },
                { label: "Téléphone",      field: "telephone", type: "tel",   placeholder: "+221 77 000 00 00" },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{label}</label>
                  <input
                    type={type}
                    value={profile[field as keyof ClientProfileData]}
                    onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 focus:border-orange-300 outline-none"
                  />
                </div>
              ))}
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
            <p className="text-xs tracking-widest uppercase text-orange-300 font-semibold mb-2">Espace client</p>
            <h2 className="text-3xl font-black leading-none mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
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

        {/* Bannière paiement en attente */}
        {clientReservations.some((r) => r.statut === "En attente" && !r.paiementValide) && (
          <div className="bg-orange-500 text-white rounded-sm px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs tracking-widest uppercase font-semibold opacity-80 mb-0.5">Action requise</p>
              <p className="font-black text-lg" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Réservation(s) en attente de paiement — cliquez sur "Payer maintenant"
              </p>
            </div>
            <span className="text-4xl">💳</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "En attente",  value: enAttente,   color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
            { label: "Confirmées",  value: confirmees,  color: "text-green-600",  bg: "bg-green-50 border-green-100"   },
            { label: "Locations",   value: nbLocations, color: "text-orange-500", bg: "bg-orange-50 border-orange-100" },
            { label: "Achats",      value: nbAchats,    color: "text-blue-600",   bg: "bg-blue-50 border-blue-100"     },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-sm px-4 py-3`}>
              <p className={`text-3xl font-black ${s.color}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {s.value}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Onglets */}
        <div className="flex gap-2">
          {([
            { key: "tous",     label: "Tout voir"    },
            { key: "location", label: "🔑 Locations"  },
            { key: "achat",    label: "💰 Achats"     },
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

        {/* Liste réservations */}
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
                onPayer={handleOuvrirPaiement}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}