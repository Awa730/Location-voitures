const offres = [
  {
    nom: "Sport",
    prix: 80000,
    description: "Pour les amateurs de conduite sportive. BMW M4, BMW M3, Mercedes CLA.",
    fonctionnalites: [
      "BMW M4 à partir de 80 000 FCFA/j",
      "BMW M3 à partir de 90 000 FCFA/j",
      "Mercedes CLA à partir de 70 000 FCFA/j",
      "Assurance tiers incluse",
      "Kilométrage limité (300 km/j)",
      "Assistance routière 24h/24",
    ],
    premium: false,
  },
  {
    nom: "Luxe & Supercar",
    prix: 200000,
    description: "Pour les grandes occasions. Mercedes GLE, Porsche 911, Ferrari 488.",
    fonctionnalites: [
      "Mercedes GLE à partir de 100 000 FCFA/j",
      "Porsche 911 GT3 à partir de 200 000 FCFA/j",
      "Ferrari 488 à partir de 350 000 FCFA/j",
      "Assurance tous risques incluse",
      "Kilométrage illimité",
      "Livraison à domicile",
      "Chauffeur en option",
    ],
    premium: true,
  },
  {
    nom: "Hypercar",
    prix: 750000,
    description: "L'expérience ultime. Lamborghini Sián, Bugatti Chiron.",
    fonctionnalites: [
      "Lamborghini Sián à partir de 500 000 FCFA/j",
      "Bugatti Chiron à partir de 750 000 FCFA/j",
      "Assurance premium tous risques",
      "Kilométrage illimité",
      "Chauffeur privé inclus",
      "Livraison VIP à domicile",
      "Support dédié 24h/24",
    ],
    premium: false,
  },
];

export default function Offres() {
  return (
    <section id="offers" className="px-6 md:px-[5vw] py-24 bg-gray-50 border-t border-gray-100">

      
      <div className="mb-14">
        <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-3 font-semibold">
          Formules
        </p>
        <h2
          className="text-[clamp(2.5rem,5vw,4rem)] text-gray-900 leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Nos offres<br />tarifaires
        </h2>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offres.map((offre) => (
          <div
            key={offre.nom}
            className={`p-8 rounded-sm relative overflow-hidden ${
              offre.premium
                ? "bg-orange-500 text-white"
                : "bg-white border border-gray-100"
            }`}
          >
            
            <p
              className={`text-2xl mb-2 ${offre.premium ? "text-white" : "text-gray-900"}`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
            >
              {offre.nom}
            </p>


            <p className={`text-sm mb-5 ${offre.premium ? "text-white/70" : "text-gray-400"}`}>
              {offre.description}
            </p>

            
            <p
              className={`text-5xl leading-none mb-1 ${offre.premium ? "text-white" : "text-orange-500"}`}
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {offre.prix.toLocaleString("fr-FR")}
            </p>
            <p className={`text-xs mb-6 ${offre.premium ? "text-white/60" : "text-gray-400"}`}>
              FCFA / jour
            </p>

            
            <ul className={`space-y-3 mb-8 border-t pt-5 ${offre.premium ? "border-white/20" : "border-gray-100"}`}>
              {offre.fonctionnalites.map((f) => (
                <li
                  key={f}
                  className={`flex items-center gap-3 text-sm ${offre.premium ? "text-white/80" : "text-gray-500"}`}
                >
                  <span className={`${offre.premium ? "text-white" : "text-orange-500"}`}>—</span>
                  {f}
                </li>
              ))}
            </ul>

            
            <button
              className={`w-full py-3 text-xs font-bold tracking-widest uppercase rounded-sm transition-all ${
                offre.premium
                  ? "bg-white text-orange-500 hover:bg-orange-50"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              Choisir cette formule
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}