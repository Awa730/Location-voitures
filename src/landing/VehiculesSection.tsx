import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVehicules, creerReservation, convertirPrix } from "../services/api";

type Tab = "location" | "achat";
type Status = "available" | "limited" | "unavailable";

interface Vehicule {
  id: number;
  nom: string;
  categorie: string;
  places: number;
  carburant: string;
  boite: string;
  annee: number;
  moteur: string;
  vitesseMax: string;
  puissance: string;
  acceleration: string;
  usageIdeal: string;
  pointsForts: string[];
  statut: Status;
  prixLocation: number;
  prixAchat: number;
  image: string;
}

const statutConfig: Record<Status, { label: string; cls: string }> = {
  available:   { label: "Disponible",     cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  limited:     { label: "Dernière dispo", cls: "text-yellow-600 bg-yellow-50 border-yellow-200"   },
  unavailable: { label: "Indisponible",   cls: "text-red-600 bg-red-50 border-red-200"             },
};

const BadgeStatut = ({ statut }: { statut: Status }) => (
  <span className={`text-xs font-semibold tracking-widest uppercase px-2.5 py-1 border rounded-sm ${statutConfig[statut].cls}`}>
    {statutConfig[statut].label}
  </span>
);

// ── Modal Réservation ──
const ModalReservation = ({
  vehicule,
  onglet,
  onFermer,
}: {
  vehicule: Vehicule;
  onglet: Tab;
  onFermer: () => void;
}) => {
  const [etape, setEtape] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversion, setConversion] = useState<{ EUR: number; USD: number } | null>(null);
  const [formulaire, setFormulaire] = useState(() => {
    const profile = JSON.parse(localStorage.getItem("clientProfile") || "{}");
    return {
      nom: profile.nom || "",
      telephone: profile.telephone || "",
      email: profile.email || localStorage.getItem("userEmail") || "",
      dateDebut: "",
      dateFin: "",
      adresse: "",
    };
  });
  const [confirme, setConfirme] = useState(false);

  // Charger la conversion au montage
  useEffect(() => {
    const prix = onglet === "location" ? vehicule.prixLocation : vehicule.prixAchat;
    convertirPrix(prix)
      .then((data) => setConversion(data.conversions))
      .catch(() => {}); // Silencieux si pas de connexion
  }, [vehicule, onglet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSuivant = async () => {
    if (etape < 3) {
      setEtape(etape + 1);
    } else {
      setLoading(true);
      setError("");
      try {
        // Appel API pour créer la réservation
        const data = await creerReservation({
          type: onglet,
          vehiculeId: vehicule.id,
          nomClient: formulaire.nom,
          telephone: formulaire.telephone,
          email: formulaire.email,
          dateDebut: formulaire.dateDebut || undefined,
          dateFin: formulaire.dateFin || undefined,
          adresse: formulaire.adresse || undefined,
        });

        // Garder aussi dans localStorage pour compatibilité frontend
        const nouvelleReservation = {
          id: data.id,
          reference: data.reference,
          vehicule: vehicule.nom,
          image: vehicule.image,
          categorie: vehicule.categorie,
          type: onglet,
          nom: formulaire.nom,
          telephone: formulaire.telephone,
          email: formulaire.email,
          dateDebut: formulaire.dateDebut,
          dateFin: formulaire.dateFin,
          adresse: formulaire.adresse,
          prix: onglet === "location" ? vehicule.prixLocation : vehicule.prixAchat,
          date: new Date().toLocaleDateString("fr-FR"),
          statut: "En attente",
        };
        const existantes = JSON.parse(localStorage.getItem("reservations") || "[]");
        localStorage.setItem("reservations", JSON.stringify([...existantes, nouvelleReservation]));
        setConfirme(true);
      } catch (err) {
        setError("Erreur lors de la réservation. Vérifiez votre connexion.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
      onClick={onFermer}
    >
      <div
        className="bg-white rounded-sm max-w-lg w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onFermer} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>

        <p className="text-xs tracking-widest uppercase text-orange-500 mb-1 font-semibold">
          {onglet === "location" ? "Réservation" : "Achat"}
        </p>
        <h3 className="text-2xl text-gray-900 mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          {vehicule.nom}
        </h3>

        {!confirme ? (
          <>
            {/* Indicateur étapes */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${etape >= n ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {n}
                  </div>
                  {n < 3 && <div className={`h-px w-12 ${etape > n ? "bg-orange-500" : "bg-gray-200"}`} />}
                </div>
              ))}
              <p className="ml-2 text-xs text-gray-400">
                {etape === 1 && "Vos informations"}
                {etape === 2 && (onglet === "location" ? "Dates de location" : "Livraison")}
                {etape === 3 && "Confirmation"}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm mb-4">
                {error}
              </div>
            )}

            {/* Étape 1 */}
            {etape === 1 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Nom complet *</label>
                  <input type="text" name="nom" value={formulaire.nom} onChange={handleChange} placeholder="Ex: Amadou Diallo" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Téléphone *</label>
                  <input type="tel" name="telephone" value={formulaire.telephone} onChange={handleChange} placeholder="Ex: +221 77 000 00 00" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Email</label>
                  <input type="email" name="email" value={formulaire.email} onChange={handleChange} placeholder="Ex: amadou@gmail.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors" />
                </div>
              </div>
            )}

            {/* Étape 2 */}
            {etape === 2 && (
              <div className="flex flex-col gap-4">
                {onglet === "location" ? (
                  <>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Date de début *</label>
                      <input type="date" name="dateDebut" value={formulaire.dateDebut} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Date de fin *</label>
                      <input type="date" name="dateFin" value={formulaire.dateFin} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors" />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Adresse de livraison *</label>
                    <input type="text" name="adresse" value={formulaire.adresse} onChange={handleChange} placeholder="Ex: Rue 10, Dakar" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors" />
                  </div>
                )}
              </div>
            )}

            {/* Étape 3 — Récapitulatif */}
            {etape === 3 && (
              <div className="bg-gray-50 rounded-sm p-5 flex flex-col gap-3">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Récapitulatif</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Véhicule</span>
                  <span className="font-semibold text-gray-900">{vehicule.nom}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Client</span>
                  <span className="font-semibold text-gray-900">{formulaire.nom}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Téléphone</span>
                  <span className="font-semibold text-gray-900">{formulaire.telephone}</span>
                </div>
                {onglet === "location" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Début</span>
                      <span className="font-semibold text-gray-900">{formulaire.dateDebut}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Fin</span>
                      <span className="font-semibold text-gray-900">{formulaire.dateFin}</span>
                    </div>
                  </>
                )}
                {onglet === "achat" && formulaire.adresse && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Livraison</span>
                    <span className="font-semibold text-gray-900">{formulaire.adresse}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-gray-200 pt-3 mt-2">
                  <span className="text-gray-500">Prix FCFA</span>
                  <span className="font-bold text-orange-500 text-lg">
                    {onglet === "location"
                      ? `${vehicule.prixLocation.toLocaleString("fr-FR")} FCFA/j`
                      : `${vehicule.prixAchat.toLocaleString("fr-FR")} FCFA`}
                  </span>
                </div>
                {/* Conversion devises — ExchangeRate API */}
                {conversion && (
                  <div className="bg-blue-50 border border-blue-100 rounded-sm p-3 mt-1">
                    <p className="text-xs text-blue-400 uppercase tracking-widest mb-2">
                      Équivalent en devises
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Euro (€)</span>
                      <span className="font-semibold text-blue-600">
                        {conversion.EUR.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">Dollar ($)</span>
                      <span className="font-semibold text-blue-600">
                        {conversion.USD.toLocaleString("fr-FR")} $
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Boutons */}
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex gap-3">
                {etape > 1 && (
                  <button onClick={() => setEtape(etape - 1)} className="flex-1 py-3 border border-gray-200 text-gray-500 text-xs font-bold tracking-widest uppercase rounded-sm hover:border-orange-300 hover:text-orange-500 transition-all">
                    ← Retour
                  </button>
                )}
                <button
                  onClick={handleSuivant}
                  disabled={loading || (etape === 3 && localStorage.getItem("utilisateur") === null)}
                  className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase rounded-sm transition-all ${
                    etape === 3 && localStorage.getItem("utilisateur") === null
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {loading ? "⏳ En cours..." : etape === 3
                    ? localStorage.getItem("utilisateur") !== null
                      ? onglet === "location" ? "Réserver maintenant →" : "Acheter maintenant →"
                      : onglet === "location" ? "Envoyer la demande →" : "Soumettre la commande →"
                    : "Suivant →"}
                </button>
              </div>

              {etape === 3 && localStorage.getItem("utilisateur") === null && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                  <span className="text-xl">🔒</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Connexion requise</p>
                    <p className="text-xs text-red-400 mt-0.5">Connectez-vous pour {onglet === "location" ? "réserver" : "acheter"}</p>
                  </div>
                  <Link to="/login/client" onClick={onFermer} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all whitespace-nowrap">
                    Se connecter
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <h4 className="text-2xl text-gray-900 mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {onglet === "location" ? "Demande envoyée !" : "Commande soumise !"}
            </h4>
            <p className="text-gray-500 text-sm mb-2">
              Votre {onglet === "location" ? "demande de réservation" : "commande"} est en attente de validation.
              Nous vous contacterons au <strong>{formulaire.telephone}</strong> sous 24h.
            </p>
            <div className="flex gap-3 justify-center">
              <a href="/client/dashboard" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all">
                Voir l'historique
              </a>
              <button onClick={onFermer} className="px-6 py-3 border border-gray-200 text-gray-500 text-xs font-bold tracking-widest uppercase rounded-sm hover:border-orange-300 transition-all">
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Carte Véhicule ──
const CarteVehicule = ({ vehicule, onglet }: { vehicule: Vehicule; onglet: Tab }) => {
  const [modalOuvert, setModalOuvert] = useState(false);

  return (
    <>
      <div className="bg-white border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all group cursor-pointer rounded-sm">
        <div className="relative h-48 bg-gray-50 rounded-t-sm overflow-hidden">
          <img src={vehicule.image} alt={vehicule.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 left-3"><BadgeStatut statut={vehicule.statut} /></div>
          <div className="absolute top-3 right-3">
            <span className="text-xs text-gray-500 bg-white/90 border border-gray-100 px-2 py-0.5 rounded-sm">{vehicule.categorie}</span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors mb-1">{vehicule.nom}</h3>
          <p className="text-xs text-gray-400 mb-4">{vehicule.boite} · {vehicule.carburant}</p>

          <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 mb-5">
            <div className="text-center">
              <p className="text-sm font-bold text-gray-800">{vehicule.places}</p>
              <p className="text-xs text-gray-400">Places</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-xs font-bold text-gray-800">{vehicule.carburant}</p>
              <p className="text-xs text-gray-400">Carburant</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-800">{vehicule.boite === "Manuelle" ? "Man." : "Auto."}</p>
              <p className="text-xs text-gray-400">Boîte</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-gray-50 border border-gray-100 rounded-sm p-3 mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Puissance</p>
              <p className="text-sm font-bold text-gray-900">{vehicule.puissance}</p>
            </div>
            <div className="border-x border-gray-200 px-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Vitesse</p>
              <p className="text-sm font-bold text-gray-900">{vehicule.vitesseMax}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">0-100</p>
              <p className="text-sm font-bold text-gray-900">{vehicule.acceleration}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
                {onglet === "location" ? "Prix / jour" : "Prix d'achat"}
              </p>
              <p className="text-2xl font-black text-orange-500" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {onglet === "location"
                  ? vehicule.prixLocation.toLocaleString("fr-FR")
                  : vehicule.prixAchat.toLocaleString("fr-FR")}
                <span className="text-xs text-gray-400 font-normal ml-1">
                  {onglet === "location" ? "FCFA/j" : "FCFA"}
                </span>
              </p>
            </div>
            <button
              disabled={vehicule.statut === "unavailable"}
              onClick={() => setModalOuvert(true)}
              className={`px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-sm transition-all ${
                vehicule.statut !== "unavailable"
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-100"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {onglet === "location" ? "Réserver" : "Acheter"}
            </button>
          </div>
        </div>
      </div>

      {modalOuvert && (
        <ModalReservation vehicule={vehicule} onglet={onglet} onFermer={() => setModalOuvert(false)} />
      )}
    </>
  );
};

// ── Section Principale ──
export default function VehiclesSection() {
  const [ongletActif, setOngletActif] = useState<Tab>("location");
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les véhicules depuis l'API
  useEffect(() => {
    getVehicules()
      .then(setVehicules)
      .catch(() => console.error("Impossible de charger les véhicules"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="vehicles" className="px-6 md:px-[5vw] py-24 bg-white">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-3 font-semibold">Notre flotte</p>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] text-gray-900 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Véhicules<br />disponibles
          </h2>
        </div>
        <a href="#" className="text-gray-400 hover:text-orange-500 text-xs tracking-widest uppercase border-b border-gray-200 hover:border-orange-400 pb-0.5 transition-all mt-4 md:mt-0">
          Voir tous les véhicules →
        </a>
      </div>

      <div className="flex gap-2 mb-10">
        {(["location", "achat"] as Tab[]).map((tab) => (
          <button key={tab} onClick={() => setOngletActif(tab)} className={`px-8 py-3 text-sm font-bold tracking-widest uppercase rounded-sm border transition-all ${ongletActif === tab ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100" : "border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 bg-white"}`}>
            {tab === "location" ? "🔑 Location" : "💰 Achat"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-sm uppercase tracking-widest">Chargement des véhicules...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicules.map((v) => (
            <CarteVehicule key={v.id} vehicule={v} onglet={ongletActif} />
          ))}
        </div>
      )}
    </section>
  );
}