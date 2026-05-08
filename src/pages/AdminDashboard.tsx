import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

interface AdminNotification {
  id: number;
  lu: boolean;
  date: string;
  message: string;
  details: {
    client: string;
    vehicule: string;
    montant: string;
    modePaiement: string;
    numeroTransaction: string;
    reservationId: string;
  };
}

type Filtre = "tous" | "location" | "achat";
type FiltreStatut = "tous" | "En attente" | "Confirmée" | "En cours" | "Terminée" | "Annulée";

const STATUTS: Reservation["statut"][] = ["En attente", "Confirmée", "En cours", "Terminée", "Annulée"];

const MODES_PAIEMENT = [
  { value: "wave",         label: "Wave",           icon: "🌊" },
  { value: "orange-money", label: "Orange Money",   icon: "🟠" },
  { value: "free-money",   label: "Free Money",     icon: "💚" },
  { value: "carte",        label: "Carte bancaire", icon: "💳" },
  { value: "virement",     label: "Virement",       icon: "🏦" },
  { value: "especes",      label: "Espèces",        icon: "💵" },
];

const getModePaiement = (value?: string) =>
  MODES_PAIEMENT.find((mode) => mode.value === value);

const statutColor: Record<string, string> = {
  "En attente": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Confirmée":  "bg-blue-50 text-blue-700 border-blue-200",
  "En cours":   "bg-orange-50 text-orange-700 border-orange-200",
  "Terminée":   "bg-green-50 text-green-700 border-green-200",
  "Annulée":    "bg-red-50 text-red-700 border-red-200",
};

const calcDuree = (debut?: string, fin?: string): number => {
  if (!debut || !fin) return 0;
  const diff = Math.ceil((new Date(fin).getTime() - new Date(debut).getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const nettoyerTelephoneWhatsApp = (telephone: string) => {
  const chiffres = telephone.replace(/\D/g, "");
  if (chiffres.startsWith("00")) return chiffres.slice(2);
  if (chiffres.startsWith("221")) return chiffres;
  return `221${chiffres}`;
};

const creerMessageWhatsApp = (reservation: Reservation) => {
  const duree = calcDuree(reservation.dateDebut, reservation.dateFin);
  const montant = reservation.type === "location" ? reservation.prix * duree : reservation.prix;
  const reference = `MVA-${String(reservation.id).padStart(5, "0")}`;
  const detail =
    reservation.type === "location"
      ? `du ${reservation.dateDebut || "-"} au ${reservation.dateFin || "-"}`
      : `avec livraison a ${reservation.adresse || "votre adresse"}`;

  return [
    `Bonjour ${reservation.nom},`,
    `Votre ${reservation.type === "location" ? "reservation" : "commande"} ${reference} pour ${reservation.vehicule} a ete validee par Movia Automobile.`,
    `Details: ${detail}.`,
    `Montant: ${montant.toLocaleString("fr-FR")} FCFA.`,
    "Notre equipe vous contactera pour finaliser les prochaines etapes.",
  ].join("\n");
};

const ouvrirWhatsAppClient = (reservation: Reservation) => {
  const phone = nettoyerTelephoneWhatsApp(reservation.telephone);
  const message = encodeURIComponent(creerMessageWhatsApp(reservation));
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
};

// ── Données démo ──
const DEMO_DATA: Reservation[] = [
  { id: 1, vehicule: "BMW X3",           image: "/images/BMW X3.jpeg",              categorie: "SUV",      type: "location", nom: "Amadou Diallo",   telephone: "+221 77 123 45 67", email: "amadou@gmail.com",  dateDebut: "2025-07-01", dateFin: "2025-07-05", prix: 65000,    date: "28/06/2025", statut: "En cours"   },
  { id: 2, vehicule: "Mercedes GLE",     image: "/images/Mercedes GLE coupé.jpeg",  categorie: "Luxe",     type: "achat",    nom: "Fatou Ndiaye",    telephone: "+221 76 987 65 43", email: "fatou@gmail.com",   adresse: "Almadies, Dakar",              prix: 55000000, date: "25/06/2025", statut: "Confirmée"  },
  { id: 3, vehicule: "Hyundai Santa Fe", image: "/images/Hyundai Santa Fe.jpeg",    categorie: "SUV",      type: "location", nom: "Moussa Sow",      telephone: "+221 78 456 78 90", email: "moussa@yahoo.fr",   dateDebut: "2025-06-20", dateFin: "2025-06-25", prix: 50000,    date: "19/06/2025", statut: "Terminée"   },
  { id: 4, vehicule: "Ferrari 488",      image: "/images/Ferrari.jpg",              categorie: "Supercar", type: "location", nom: "Cheikh Ba",       telephone: "+221 77 321 09 87", email: "cheikh@gmail.com",  dateDebut: "2025-07-10", dateFin: "2025-07-12", prix: 350000,   date: "01/07/2025", statut: "En attente" },
  { id: 5, vehicule: "Peugeot 3008",     image: "/images/Peugeot 3008.jpeg",        categorie: "SUV",      type: "achat",    nom: "Mariama Fall",    telephone: "+221 76 654 32 10", email: "mariama@gmail.com", adresse: "Thiès",                        prix: 16000000, date: "30/06/2025", statut: "En attente" },
  { id: 6, vehicule: "BMW M4",           image: "/images/bmw.jpg",                  categorie: "Sport",    type: "location", nom: "Ibrahima Gaye",   telephone: "+221 78 111 22 33", email: "ibrahima@gmail.com",dateDebut: "2025-06-15", dateFin: "2025-06-18", prix: 80000,    date: "14/06/2025", statut: "Annulée"    },
  { id: 7, vehicule: "Haval H6",         image: "/images/Haval H6.jpeg",            categorie: "SUV",      type: "achat",    nom: "Aissatou Diop",   telephone: "+221 77 444 55 66", email: "aissatou@gmail.com",adresse: "Mermoz, Dakar",                prix: 15000000, date: "27/06/2025", statut: "En cours"   },
  { id: 8, vehicule: "Mercedes CLA",     image: "/images/mercedes.jpg",             categorie: "Berline",  type: "location", nom: "Oumar Faye",      telephone: "+221 76 777 88 99", email: "oumar@gmail.com",   dateDebut: "2025-07-05", dateFin: "2025-07-08", prix: 70000,    date: "03/07/2025", statut: "Confirmée"  },
];

// ── Panneau notifications paiement ──
const PanneauNotifications = ({
  notifications,
  onMarquerLu,
  onFermer,
}: {
  notifications: AdminNotification[];
  onMarquerLu: (id: number) => void;
  onFermer: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={onFermer}>
    <div
      className="bg-white h-full w-full max-w-md shadow-2xl overflow-y-auto flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0">
        <div>
          <p className="text-[10px] text-orange-300 uppercase tracking-widest font-semibold">Admin</p>
          <h2 className="text-2xl font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Notifications paiement
          </h2>
        </div>
        <button onClick={onFermer} className="text-gray-400 hover:text-white text-2xl">✕</button>
      </div>

      {notifications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
          <p className="text-5xl mb-3">🔔</p>
          <p className="text-xs uppercase tracking-widest">Aucune notification</p>
        </div>
      ) : (
        <div className="flex-1 divide-y divide-gray-100">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 transition-colors ${n.lu ? "bg-white" : "bg-orange-50 border-l-4 border-orange-400"}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-black text-gray-900 text-sm" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {n.message}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{n.date}</p>
                </div>
                {!n.lu && (
                  <button
                    onClick={() => onMarquerLu(n.id)}
                    className="px-3 py-1 text-[10px] bg-orange-100 text-orange-700 uppercase tracking-widest font-bold rounded-sm hover:bg-orange-200 transition-colors whitespace-nowrap"
                  >
                    Marquer lu
                  </button>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase tracking-widest">Client</span>
                  <span className="font-semibold text-gray-800">{n.details.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase tracking-widest">Véhicule</span>
                  <span className="font-semibold text-gray-800">{n.details.vehicule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase tracking-widest">Montant</span>
                  <span className="font-black text-orange-600">{n.details.montant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase tracking-widest">Mode</span>
                  <span className="font-semibold text-gray-800">{n.details.modePaiement}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 uppercase tracking-widest">N° Transaction</span>
                  <span className="font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded text-[10px]">
                    {n.details.numeroTransaction}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase tracking-widest">Réf. Réservation</span>
                  <span className="font-semibold text-gray-800">{n.details.reservationId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ── Ligne tableau ──
const LigneReservation = ({
  r,
  onStatutChange,
  onValider,
}: {
  r: Reservation;
  onStatutChange: (id: number, statut: Reservation["statut"]) => void;
  onValider: (id: number) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const duree = calcDuree(r.dateDebut, r.dateFin);
  const montant = r.type === "location" ? r.prix * duree : r.prix;
  const paiement = getModePaiement(r.modePaiement);

  return (
    <>
      <tr
        className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Type */}
        <td className="px-4 py-3">
          <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 border rounded-sm ${
            r.type === "location" ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-blue-50 text-blue-600 border-blue-200"
          }`}>
            {r.type === "location" ? "🔑 Location" : "💰 Achat"}
          </span>
        </td>

        {/* Véhicule */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-8 rounded-sm overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={r.image} alt={r.vehicule} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{r.vehicule}</p>
              <p className="text-xs text-gray-400">{r.categorie}</p>
            </div>
          </div>
        </td>

        {/* Client */}
        <td className="px-4 py-3 hidden sm:table-cell">
          <p className="text-sm font-semibold text-gray-800">{r.nom}</p>
          <p className="text-xs text-gray-400">{r.telephone}</p>
        </td>

        {/* Date */}
        <td className="px-4 py-3 hidden md:table-cell">
          <p className="text-xs text-gray-600">{r.date}</p>
          {r.type === "location" && r.dateDebut && r.dateFin && (
            <p className="text-xs text-gray-400">{r.dateDebut} → {r.dateFin}</p>
          )}
        </td>

        {/* Montant */}
        <td className="px-4 py-3">
          <p className="text-sm font-black text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {montant.toLocaleString("fr-FR")}
          </p>
          <p className="text-xs text-gray-400">FCFA</p>
        </td>

        {/* Paiement */}
        <td className="px-4 py-3 hidden lg:table-cell">
          <div className="space-y-1">
            {paiement ? (
              <span className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 border rounded-sm bg-slate-50 text-slate-600 border-slate-200 block w-fit">
                {paiement.icon} {paiement.label}
              </span>
            ) : (
              <span className="text-xs text-gray-400">—</span>
            )}
            {r.paiementValide && r.numerotransaction && (
              <span className="text-[10px] font-mono text-green-700 bg-green-50 px-2 py-0.5 rounded block w-fit">
                ✅ {r.numerotransaction}
              </span>
            )}
          </div>
        </td>

        {/* Statut */}
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <select
              value={r.statut}
              onChange={(e) => onStatutChange(r.id, e.target.value as Reservation["statut"])}
              className={`text-xs font-semibold px-2.5 py-1.5 border rounded-sm uppercase tracking-widest cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 ${statutColor[r.statut]}`}
            >
              {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {r.statut === "En attente" && (
              <button
                onClick={() => onValider(r.id)}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all whitespace-nowrap"
              >
                Valider
              </button>
            )}
          </div>
        </td>

        {/* Expand */}
        <td className="px-4 py-3 text-center">
          <span className={`text-gray-400 text-xs transition-transform inline-block ${expanded ? "rotate-180" : ""}`}>▼</span>
        </td>
      </tr>

      {/* Détail expandé */}
      {expanded && (
        <tr className="bg-orange-50/30 border-b border-orange-100">
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Email</p>
                <p className="font-medium text-gray-800">{r.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                  {r.type === "location" ? "Durée" : "Adresse livraison"}
                </p>
                <p className="font-medium text-gray-800">
                  {r.type === "location" ? `${duree} jour${duree > 1 ? "s" : ""}` : r.adresse || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Prix unitaire</p>
                <p className="font-medium text-gray-800">{r.prix.toLocaleString("fr-FR")} FCFA{r.type === "location" ? "/j" : ""}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Mode paiement</p>
                <p className="font-medium text-gray-800">
                  {paiement ? `${paiement.icon} ${paiement.label}` : "Non renseigné"}
                </p>
              </div>
              {r.numerotransaction && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">N° Transaction</p>
                  <p className="font-mono font-bold text-green-700 text-xs">{r.numerotransaction}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Réf.</p>
                <p className="font-medium text-gray-800 font-mono text-xs">MVA-{String(r.id).padStart(5, "0")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">WhatsApp</p>
                <p className="font-medium text-gray-800">
                  {r.whatsappEnvoye ? "Message préparé" : "En attente de validation"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Paiement client</p>
                <p className={`font-semibold text-xs ${r.paiementValide ? "text-green-600" : "text-gray-400"}`}>
                  {r.paiementValide ? "✅ Soumis par le client" : "En attente"}
                </p>
              </div>
            </div>
            {r.statut === "En attente" && (
              <div className="mt-4">
                <button
                  onClick={() => ouvrirWhatsAppClient(r)}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all"
                >
                  📱 Contacter via WhatsApp
                </button>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

// ── Dashboard Admin ──
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const stored = JSON.parse(localStorage.getItem("reservations") || "[]") as Reservation[];
    return stored.length > 0 ? stored : DEMO_DATA;
  });
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    return JSON.parse(localStorage.getItem("adminNotifications") || "[]") as AdminNotification[];
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [filtre, setFiltre] = useState<Filtre>("tous");
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>("tous");
  const [search, setSearch] = useState("");

  const notifNonLues = notifications.filter((n) => !n.lu).length;

  const handleMarquerLu = (id: number) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, lu: true } : n));
    setNotifications(updated);
    localStorage.setItem("adminNotifications", JSON.stringify(updated));
  };

  const handleStatutChange = (id: number, statut: Reservation["statut"]) => {
    const reservation = reservations.find((r) => r.id === id);
    const validation = statut === "Confirmée";
    const updated = reservations.map((r) =>
      r.id === id
        ? {
            ...r,
            statut,
            whatsappEnvoye: validation ? true : r.whatsappEnvoye,
            dateValidation: validation ? new Date().toLocaleString("fr-FR") : r.dateValidation,
          }
        : r
    );
    setReservations(updated);
    localStorage.setItem("reservations", JSON.stringify(updated));
    if (validation && reservation) {
      ouvrirWhatsAppClient({ ...reservation, statut, whatsappEnvoye: true });
    }
  };

  const handleValider = (id: number) => handleStatutChange(id, "Confirmée");

  const filtered = reservations
    .filter((r) => filtre === "tous" || r.type === filtre)
    .filter((r) => filtreStatut === "tous" || r.statut === filtreStatut)
    .filter(
      (r) =>
        !search ||
        r.nom.toLowerCase().includes(search.toLowerCase()) ||
        r.vehicule.toLowerCase().includes(search.toLowerCase()) ||
        r.telephone.includes(search)
    );

  const totalCA = reservations.reduce((sum, r) => {
    const duree = calcDuree(r.dateDebut, r.dateFin);
    return sum + (r.type === "location" ? r.prix * duree : r.prix);
  }, 0);
  const nbLocations = reservations.filter((r) => r.type === "location").length;
  const nbAchats    = reservations.filter((r) => r.type === "achat").length;
  const enAttente   = reservations.filter((r) => r.statut === "En attente").length;

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminEmail");
    navigate("/login/client");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Panneau notifications */}
      {showNotifications && (
        <PanneauNotifications
          notifications={notifications}
          onMarquerLu={handleMarquerLu}
          onFermer={() => setShowNotifications(false)}
        />
      )}

      {/* Header */}
      <header className="bg-gray-900 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/images/logo-movia.jpeg"
              alt="Movia Automobile"
              className="w-11 h-11 rounded-sm object-cover border border-white/10"
            />
            <div>
              <p className="text-xs text-gray-400 tracking-widest uppercase">Movia Automobile</p>
              <h1 className="text-2xl font-black leading-none text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Administration
              </h1>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-orange-300">
                Historique des réservations et achats
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Cloche notifications */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all flex items-center gap-2"
            >
              🔔 Paiements
              {notifNonLues > 0 && (
                <span className="bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {notifNonLues}
                </span>
              )}
            </button>

            {enAttente > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest animate-pulse">
                {enAttente} en attente
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-xs tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors pb-0.5 border-b border-transparent hover:border-red-300"
            >
              Déconnexion
            </button>
            <a
              href="/"
              className="text-xs tracking-widest uppercase text-gray-400 hover:text-orange-400 transition-colors pb-0.5 border-b border-transparent hover:border-orange-400"
            >
              ← Accueil
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Chiffre d'affaires", value: `${(totalCA / 1_000_000).toFixed(1)}M`, unit: "FCFA", color: "text-orange-500", bg: "bg-white border-gray-100" },
            { label: "Locations",          value: nbLocations, unit: "", color: "text-orange-500", bg: "bg-white border-gray-100" },
            { label: "Achats",             value: nbAchats,    unit: "", color: "text-blue-600",   bg: "bg-white border-gray-100" },
            { label: "En attente",         value: enAttente,   unit: "", color: "text-yellow-600", bg: enAttente > 0 ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-100" },
          ].map((k) => (
            <div key={k.label} className={`${k.bg} border rounded-sm px-5 py-4`}>
              <p className={`text-3xl font-black ${k.color}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {k.value}{k.unit && <span className="text-sm font-normal text-gray-400 ml-1">{k.unit}</span>}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="bg-white border border-gray-100 rounded-sm p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="text"
            placeholder="Rechercher un client, véhicule, téléphone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors"
          />
          <div className="flex gap-2">
            {(["tous", "location", "achat"] as Filtre[]).map((f) => (
              <button
                key={f}
                onClick={() => setFiltre(f)}
                className={`px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-sm border transition-all ${
                  filtre === f
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 bg-white"
                }`}
              >
                {f === "tous" ? "Tous" : f === "location" ? "🔑 Loc." : "💰 Achats"}
              </button>
            ))}
          </div>
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value as FiltreStatut)}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-orange-400 text-gray-600 uppercase tracking-widest font-semibold"
          >
            <option value="tous">Tous statuts</option>
            {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </p>
          <p className="text-xs text-gray-400">
            Total filtré :{" "}
            <span className="font-bold text-gray-700">
              {filtered
                .reduce((s, r) => s + (r.type === "location" ? r.prix * calcDuree(r.dateDebut, r.dateFin) : r.prix), 0)
                .toLocaleString("fr-FR")}{" "}
              FCFA
            </span>
          </p>
        </div>

        {/* Tableau */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-sm">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-xs uppercase tracking-widest text-gray-400">Aucun résultat</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    {["Type", "Véhicule", "Client", "Dates", "Montant", "Paiement", "Statut", ""].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest ${
                          h === "Paiement" ? "hidden lg:table-cell" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <LigneReservation
                      key={r.id}
                      r={r}
                      onStatutChange={handleStatutChange}
                      onValider={handleValider}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}