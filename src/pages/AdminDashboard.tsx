import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReservations, changerStatut, getStats } from "../services/api";

interface Reservation {
  id: number;
  reference: string;
  vehicule: { nom: string; image: string; categorie: string };
  type: "location" | "achat";
  nomClient: string;
  telephone: string;
  email: string;
  dateDebut?: string;
  dateFin?: string;
  adresse?: string;
  prix: number;
  statut: "En attente" | "Confirmée" | "En cours" | "Terminée" | "Annulée";
  modePaiement?: string;
  whatsappEnvoye?: boolean;
  numeroTransaction?: string;
  paiementValide?: boolean;
  createdAt: string;
}

interface Stats {
  total: number;
  enAttente: number;
  confirmees: number;
  enCours: number;
  terminees: number;
  annulees: number;
  locations: number;
  achats: number;
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
  const ref = reservation.reference || `MVA-${String(reservation.id).padStart(5, "0")}`;
  const detail =
    reservation.type === "location"
      ? `du ${reservation.dateDebut || "-"} au ${reservation.dateFin || "-"}`
      : `avec livraison a ${reservation.adresse || "votre adresse"}`;

  return [
    `Bonjour ${reservation.nomClient},`,
    `Votre ${reservation.type === "location" ? "reservation" : "commande"} ${ref} pour ${reservation.vehicule?.nom} a ete validee par Movia Automobile.`,
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
  const ref = r.reference || `MVA-${String(r.id).padStart(5, "0")}`;

  return (
    <>
      <tr
        className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        <td className="px-4 py-3">
          <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 border rounded-sm ${
            r.type === "location" ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-blue-50 text-blue-600 border-blue-200"
          }`}>
            {r.type === "location" ? "🔑 Location" : "💰 Achat"}
          </span>
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-8 rounded-sm overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={r.vehicule?.image} alt={r.vehicule?.nom} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{r.vehicule?.nom}</p>
              <p className="text-xs text-gray-400">{r.vehicule?.categorie}</p>
            </div>
          </div>
        </td>

        <td className="px-4 py-3 hidden sm:table-cell">
          <p className="text-sm font-semibold text-gray-800">{r.nomClient}</p>
          <p className="text-xs text-gray-400">{r.telephone}</p>
        </td>

        <td className="px-4 py-3 hidden md:table-cell">
          <p className="text-xs text-gray-600 font-mono">{ref}</p>
          {r.type === "location" && r.dateDebut && r.dateFin && (
            <p className="text-xs text-gray-400">{r.dateDebut} → {r.dateFin}</p>
          )}
        </td>

        <td className="px-4 py-3">
          <p className="text-sm font-black text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {montant.toLocaleString("fr-FR")}
          </p>
          <p className="text-xs text-gray-400">FCFA</p>
        </td>

        <td className="px-4 py-3 hidden lg:table-cell">
          <div className="space-y-1">
            {paiement ? (
              <span className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 border rounded-sm bg-slate-50 text-slate-600 border-slate-200 block w-fit">
                {paiement.icon} {paiement.label}
              </span>
            ) : (
              <span className="text-xs text-gray-400">—</span>
            )}
            {r.paiementValide && r.numeroTransaction && (
              <span className="text-[10px] font-mono text-green-700 bg-green-50 px-2 py-0.5 rounded block w-fit">
                ✅ {r.numeroTransaction}
              </span>
            )}
          </div>
        </td>

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

        <td className="px-4 py-3 text-center">
          <span className={`text-gray-400 text-xs transition-transform inline-block ${expanded ? "rotate-180" : ""}`}>▼</span>
        </td>
      </tr>

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
              {r.numeroTransaction && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">N° Transaction</p>
                  <p className="font-mono font-bold text-green-700 text-xs">{r.numeroTransaction}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Réf.</p>
                <p className="font-medium text-gray-800 font-mono text-xs">{ref}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">WhatsApp</p>
                <p className="font-medium text-gray-800">
                  {r.whatsappEnvoye ? "✅ Message envoyé" : "En attente"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Paiement client</p>
                <p className={`font-semibold text-xs ${r.paiementValide ? "text-green-600" : "text-gray-400"}`}>
                  {r.paiementValide ? "✅ Soumis par le client" : "En attente"}
                </p>
              </div>
            </div>
            {(r.statut === "En attente" || r.statut === "Confirmée") && (
              <div className="mt-4 flex gap-3">
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
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState<Filtre>("tous");
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>("tous");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "admin") {
      navigate("/login/client");
      return;
    }

    // Charger réservations et stats depuis l'API
    Promise.all([getAllReservations(), getStats()])
      .then(([reservationsData, statsData]) => {
        setReservations(Array.isArray(reservationsData) ? reservationsData : []);
        setStats(statsData);
      })
      .catch(() => navigate("/login/client"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleStatutChange = async (id: number, statut: Reservation["statut"]) => {
    try {
      await changerStatut(id, statut);
      setReservations((prev) =>
        prev.map((r) => r.id === id ? { ...r, statut } : r)
      );
      // Si confirmée → ouvrir WhatsApp
      if (statut === "Confirmée") {
        const reservation = reservations.find((r) => r.id === id);
        if (reservation) ouvrirWhatsAppClient({ ...reservation, statut });
      }
    } catch {
      alert("Erreur lors du changement de statut");
    }
  };

  const handleValider = (id: number) => handleStatutChange(id, "Confirmée");

  const filtered = reservations
    .filter((r) => filtre === "tous" || r.type === filtre)
    .filter((r) => filtreStatut === "tous" || r.statut === filtreStatut)
    .filter((r) =>
      !search ||
      r.nomClient.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicule?.nom.toLowerCase().includes(search.toLowerCase()) ||
      r.telephone.includes(search) ||
      r.reference?.toLowerCase().includes(search.toLowerCase())
    );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/client");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-xs uppercase tracking-widest text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo-movia.jpeg" alt="Movia" className="w-11 h-11 rounded-sm object-cover border border-white/10" />
            <div>
              <p className="text-xs text-gray-400 tracking-widest uppercase">Movia Automobile</p>
              <h1 className="text-2xl font-black leading-none text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Administration</h1>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-orange-300">Gestion des réservations et achats</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {stats && stats.enAttente > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest animate-pulse">
                {stats.enAttente} en attente
              </span>
            )}
            <button onClick={handleLogout} className="text-xs tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors pb-0.5 border-b border-transparent hover:border-red-300">
              Déconnexion
            </button>
            <a href="/" className="text-xs tracking-widest uppercase text-gray-400 hover:text-orange-400 transition-colors pb-0.5 border-b border-transparent hover:border-orange-400">
              ← Accueil
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPIs depuis l'API */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total réservations", value: stats?.total || 0,       unit: "",   color: "text-orange-500", bg: "bg-white border-gray-100" },
            { label: "Locations",          value: stats?.locations || 0,   unit: "",   color: "text-orange-500", bg: "bg-white border-gray-100" },
            { label: "Achats",             value: stats?.achats || 0,      unit: "",   color: "text-blue-600",   bg: "bg-white border-gray-100" },
            { label: "En attente",         value: stats?.enAttente || 0,   unit: "",   color: "text-yellow-600", bg: (stats?.enAttente || 0) > 0 ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-100" },
          ].map((k) => (
            <div key={k.label} className={`${k.bg} border rounded-sm px-5 py-4`}>
              <p className={`text-3xl font-black ${k.color}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {k.value}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="bg-white border border-gray-100 rounded-sm p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="text"
            placeholder="Rechercher client, véhicule, référence, téléphone…"
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
                  filtre === f ? "bg-orange-500 border-orange-500 text-white" : "border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 bg-white"
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
                    {["Type", "Véhicule", "Client", "Réf / Dates", "Montant", "Paiement", "Statut", ""].map((h) => (
                      <th key={h} className={`px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest ${h === "Paiement" ? "hidden lg:table-cell" : ""}`}>
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