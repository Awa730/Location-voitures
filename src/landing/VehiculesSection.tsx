
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

const vehicules: Vehicule[] = [
  {
    id: 1,
    nom: "BMW X3",
    categorie: "SUV",
    places: 5,
    carburant: "Diesel",
    boite: "Automatique",
    annee: 2022,
    moteur: "2.0L TwinPower",
    vitesseMax: "230 km/h",
    puissance: "190 ch",
    acceleration: "8,0 s",
    usageIdeal: "Voyage, famille et rendez-vous pro",
    pointsForts: ["Confort premium", "Tenue de route", "Grand coffre"],
    statut: "available",
    prixLocation: 65000,
    prixAchat: 22000000,
    image: "/images/BMW X3.jpeg",
  },
  {
    id: 2,
    nom: "Haval H6",
    categorie: "SUV",
    places: 5,
    carburant: "Essence",
    boite: "Automatique",
    annee: 2023,
    moteur: "1.5L Turbo",
    vitesseMax: "180 km/h",
    puissance: "150 ch",
    acceleration: "9,8 s",
    usageIdeal: "Déplacements urbains et longs trajets",
    pointsForts: ["Très spacieux", "Caméra 360", "Bon rapport prix"],
    statut: "available",
    prixLocation: 40000,
    prixAchat: 15000000,
    image: "/images/Haval H6.jpeg",
  },
  {
    id: 3,
    nom: "Mercedes GLE Coupé",
    categorie: "Luxe",
    places: 5,
    carburant: "Diesel",
    boite: "Automatique",
    annee: 2021,
    moteur: "3.0L 6 cylindres",
    vitesseMax: "250 km/h",
    puissance: "330 ch",
    acceleration: "5,7 s",
    usageIdeal: "Événements, business et confort haut de gamme",
    pointsForts: ["Intérieur luxe", "Puissance", "Silhouette coupé"],
    statut: "available",
    prixLocation: 120000,
    prixAchat: 55000000,
    image: "/images/Mercedes GLE coupé.jpeg",
  },
  {
    id: 4,
    nom: "Hyundai Santa Fe",
    categorie: "SUV",
    places: 7,
    carburant: "Diesel",
    boite: "Automatique",
    annee: 2020,
    moteur: "2.2L CRDi",
    vitesseMax: "205 km/h",
    puissance: "200 ch",
    acceleration: "9,2 s",
    usageIdeal: "Familles nombreuses et voyages interurbains",
    pointsForts: ["7 places", "Climatisation arrière", "Très confortable"],
    statut: "available",
    prixLocation: 50000,
    prixAchat: 18000000,
    image: "/images/Hyundai Santa Fe.jpeg",
  },
  {
    id: 5,
    nom: "Hyundai Creta",
    categorie: "Citadine",
    places: 5,
    carburant: "Essence",
    boite: "Manuelle",
    annee: 2022,
    moteur: "1.5L",
    vitesseMax: "170 km/h",
    puissance: "115 ch",
    acceleration: "11,8 s",
    usageIdeal: "Ville, petits budgets et trajets quotidiens",
    pointsForts: ["Économique", "Facile à conduire", "Compacte"],
    statut: "available",
    prixLocation: 25000,
    prixAchat: 10000000,
    image: "/images/Hyundai Creta.jpeg",
  },
  {
    id: 6,
    nom: "Peugeot 3008",
    categorie: "SUV",
    places: 5,
    carburant: "Diesel",
    boite: "Automatique",
    annee: 2021,
    moteur: "1.5L BlueHDi",
    vitesseMax: "192 km/h",
    puissance: "130 ch",
    acceleration: "10,8 s",
    usageIdeal: "Conduite confortable avec faible consommation",
    pointsForts: ["Économe", "Design moderne", "Aide à la conduite"],
    statut: "available",
    prixLocation: 45000,
    prixAchat: 16000000,
    image: "/images/Peugeot 3008.jpeg",
  },
  {
    id: 7,
    nom: "BMW M4",
    categorie: "Sport",
    places: 4,
    carburant: "Essence",
    boite: "Manuelle",
    annee: 2020,
    moteur: "3.0L Bi-turbo",
    vitesseMax: "280 km/h",
    puissance: "431 ch",
    acceleration: "4,3 s",
    usageIdeal: "Plaisir de conduite et occasions spéciales",
    pointsForts: ["Sportive", "Accélération forte", "Look exclusif"],
    statut: "limited",
    prixLocation: 80000,
    prixAchat: 35000000,
    image: "/images/bmw.jpg",
  },
  {
    id: 8,
    nom: "Mercedes CLA",
    categorie: "Berline",
    places: 5,
    carburant: "Diesel",
    boite: "Automatique",
    annee: 2021,
    moteur: "2.0L CDI",
    vitesseMax: "235 km/h",
    puissance: "190 ch",
    acceleration: "7,3 s",
    usageIdeal: "Business, ville et sorties élégantes",
    pointsForts: ["Élégante", "Confortable", "Faible consommation"],
    statut: "available",
    prixLocation: 70000,
    prixAchat: 28000000,
    image: "/images/mercedes.jpg",
  },
  {
    id: 9,
    nom: "Ferrari 488",
    categorie: "Supercar",
    places: 2,
    carburant: "Essence",
    boite: "Automatique",
    annee: 2019,
    moteur: "3.9L V8 Bi-turbo",
    vitesseMax: "330 km/h",
    puissance: "670 ch",
    acceleration: "3,0 s",
    usageIdeal: "Mariage, shooting et expérience prestige",
    pointsForts: ["Très rare", "Performance extrême", "Image prestige"],
    statut: "limited",
    prixLocation: 350000,
    prixAchat: 250000000,
    image: "/images/Ferrari.jpg",
  },
];
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSuivant = () => {
    if (etape < 3) {
      setEtape(etape + 1);
    } else {
      const nouvelleReservation = {
        id: Date.now(),
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
        {/* Fermer */}
        <button
          onClick={onFermer}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        {/* Titre */}
        <p className="text-xs tracking-widest uppercase text-orange-500 mb-1 font-semibold">
          {onglet === "location" ? "Réservation" : "Achat"}
        </p>
        <h3
          className="text-2xl text-gray-900 mb-6"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {vehicule.nom}
        </h3>

        {!confirme ? (
          <>
            {/* Indicateur étapes */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      etape >= n
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {n}
                  </div>
                  {n < 3 && (
                    <div className={`h-px w-12 ${etape > n ? "bg-orange-500" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
              <p className="ml-2 text-xs text-gray-400">
                {etape === 1 && "Vos informations"}
                {etape === 2 && (onglet === "location" ? "Dates de location" : "Livraison")}
                {etape === 3 && "Confirmation"}
              </p>
            </div>

            {/* Étape 1 */}
            {etape === 1 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formulaire.nom}
                    onChange={handleChange}
                    placeholder="Ex: Amadou Diallo"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formulaire.telephone}
                    onChange={handleChange}
                    placeholder="Ex: +221 77 000 00 00"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formulaire.email}
                    onChange={handleChange}
                    placeholder="Ex: amadou@gmail.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Étape 2 */}
            {etape === 2 && (
              <div className="flex flex-col gap-4">
                {onglet === "location" ? (
                  <>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
                        Date de début *
                      </label>
                      <input
                        type="date"
                        name="dateDebut"
                        value={formulaire.dateDebut}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
                        Date de fin *
                      </label>
                      <input
                        type="date"
                        name="dateFin"
                        value={formulaire.dateFin}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
                      Adresse de livraison *
                    </label>
                    <input
                      type="text"
                      name="adresse"
                      value={formulaire.adresse}
                      onChange={handleChange}
                      placeholder="Ex: Rue 10, Dakar"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-orange-400 transition-colors"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Étape 3 — Récapitulatif */}
            {etape === 3 && (
              <div className="bg-gray-50 rounded-sm p-5 flex flex-col gap-3">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                  Récapitulatif
                </p>
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
                  <span className="text-gray-500">Prix</span>
                  <span className="font-bold text-orange-500 text-lg">
                    {onglet === "location"
                      ? `${vehicule.prixLocation.toLocaleString("fr-FR")} FCFA/j`
                      : `${vehicule.prixAchat.toLocaleString("fr-FR")} FCFA`}
                  </span>
                </div>
              </div>
            )}

            {/* Boutons */}
<div className="flex flex-col gap-3 mt-6">
  <div className="flex gap-3">
    {etape > 1 && (
      <button
        onClick={() => setEtape(etape - 1)}
        className="flex-1 py-3 border border-gray-200 text-gray-500 text-xs font-bold tracking-widest uppercase rounded-sm hover:border-orange-300 hover:text-orange-500 transition-all"
      >
        ← Retour
      </button>
    )}
    <button
      onClick={handleSuivant}
      disabled={etape === 3 && localStorage.getItem("utilisateur") === null}
      className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase rounded-sm transition-all ${
        etape === 3 && localStorage.getItem("utilisateur") === null
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-orange-500 hover:bg-orange-600 text-white"
      }`}
    >
      {etape === 3
        ? localStorage.getItem("utilisateur") !== null
          ? onglet === "location"
            ? "Réserver maintenant →"
            : "Acheter maintenant →"
          : onglet === "location"
            ? "Envoyer la demande →"
            : "Soumettre la commande →"
        : "Suivant →"}
    </button>
  </div>

  {/* Message si pas connecté */}
  {etape === 3 && localStorage.getItem("utilisateur") === null && (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
      <span className="text-xl">🔒</span>
      <div className="flex-1">
        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">
          Reserver
        </p>
        <p className="text-xs text-red-400 mt-0.5">
          Connectez-vous pour {onglet === "location" ? "réserver" : "acheter"}
        </p>
      </div>
      <Link
        to="/login/client"
        onClick={onFermer}
        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all whitespace-nowrap"
      >
        Se connecter
      </Link>
    </div>
  )}
</div>
          </>
        ) : (
          /* Confirmation */
          <div className="text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <h4
  className="text-2xl text-gray-900 mb-2"
  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
>
  {onglet === "location" ? "Demande envoyée !" : "Commande soumise !"}
</h4>
<p className="text-gray-500 text-sm mb-2">
  Votre {onglet === "location" ? "demande de réservation" : "commande"} est en attente de validation.
  Nous vous contacterons au <strong>{formulaire.telephone}</strong> sous 24h.
</p>
            <div className="flex gap-3 justify-center">
              <a
                href="/client/dashboard"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all"
              >
                Voir l'historique
              </a>
              <button
                onClick={onFermer}
                className="px-6 py-3 border border-gray-200 text-gray-500 text-xs font-bold tracking-widest uppercase rounded-sm hover:border-orange-300 transition-all"
              >
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
  const navigate = useNavigate();
  const estConnecte = localStorage.getItem("utilisateur") === "true";

  return (
    <>
      <div className="bg-white border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all group cursor-pointer rounded-sm">

        {/* Image */}
        <div className="relative h-48 bg-gray-50 rounded-t-sm overflow-hidden">
          <img
            src={vehicule.image}
            alt={vehicule.nom}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <BadgeStatut statut={vehicule.statut} />
          </div>
          <div className="absolute top-3 right-3">
            <span className="text-xs text-gray-500 bg-white/90 border border-gray-100 px-2 py-0.5 rounded-sm">
              {vehicule.categorie}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors mb-1">
            {vehicule.nom}
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            {vehicule.boite} · {vehicule.carburant}
          </p>

          {/* Specs */}
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
              <p className="text-xs font-bold text-gray-800">
                {vehicule.boite === "Manuelle" ? "Man." : "Auto."}
              </p>
              <p className="text-xs text-gray-400">Boîte</p>
            </div>
          </div>

          {/* Caractéristiques essentielles avant réservation */}
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

          {/* Prix + Bouton */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
                {onglet === "location" ? "Prix / jour" : "Prix d'achat"}
              </p>
              <p
                className="text-2xl font-black text-orange-500"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
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
              onClick={() => {
                if (!estConnecte) {
                  navigate("/login/client");
                  return;
                }
                setModalOuvert(true);
              }}
              className={`px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-sm transition-all ${
                vehicule.statut !== "unavailable"
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-100"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {estConnecte
                ? onglet === "location"
                  ? "Réserver"
                  : "Acheter"
                : "Se connecter pour réserver"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOuvert && (
        <ModalReservation
          vehicule={vehicule}
          onglet={onglet}
          onFermer={() => setModalOuvert(false)}
        />
      )}
    </>
  );
};

// ── Section Principale ──
export default function VehiclesSection() {
  const [ongletActif, setOngletActif] = useState<Tab>("location");

  return (
    <section id="vehicles" className="px-6 md:px-[5vw] py-24 bg-white">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-3 font-semibold">
            Notre flotte
          </p>
          <h2
            className="text-[clamp(2.5rem,5vw,4rem)] text-gray-900 leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Véhicules<br />disponibles
          </h2>
        </div>
        <a
          href="#"
          className="text-gray-400 hover:text-orange-500 text-xs tracking-widest uppercase border-b border-gray-200 hover:border-orange-400 pb-0.5 transition-all mt-4 md:mt-0"
        >
          Voir tous les véhicules →
        </a>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-10">
        {(["location", "achat"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setOngletActif(tab)}
            className={`px-8 py-3 text-sm font-bold tracking-widest uppercase rounded-sm border transition-all ${
              ongletActif === tab
                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100"
                : "border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 bg-white"
            }`}
          >
            {tab === "location" ? "🔑 Location" : "💰 Achat"}
          </button>
        ))}
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicules.map((v) => (
          <CarteVehicule key={v.id} vehicule={v} onglet={ongletActif} />
        ))}
      </div>
    </section>
  );
}
