const etapes = [
  {
    numero: "01",
    titre: "Choisissez votre véhicule",
    description: "Parcourez notre catalogue de plus de 200 véhicules. Filtrez par catégorie, prix ou disponibilité selon vos besoins.",
  },
  {
    numero: "02",
    titre: "Sélectionnez vos dates",
    description: "Définissez vos dates de départ et retour. Disponibilité en temps réel et devis instantané.",
  },
  {
    numero: "03",
    titre: "Confirmez et payez",
    description: "Paiement sécurisé par carte, mobile money ou virement bancaire. Confirmation immédiate par e-mail.",
  },
  {
    numero: "04",
    titre: "Prenez la route",
    description: "Récupérez votre véhicule en agence ou optez pour la livraison à domicile. Bon voyage !",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="px-6 md:px-[5vw] py-24 bg-gray-50 border-t border-b border-gray-100">

      {/* Header */}
      <div className="mb-14">
        <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-3 font-semibold">
          Processus simple
        </p>
        <h2
          className="text-[clamp(2.5rem,5vw,4rem)] text-gray-900 leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Comment ça<br />marche
        </h2>
      </div>

      {/* Étapes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {etapes.map((etape) => (
          <div key={etape.numero} className="flex flex-col gap-5">

            {/* Numéro */}
            <div className="w-12 h-12 rounded-full border-2 border-orange-500 bg-orange-50 flex items-center justify-center shrink-0">
              <span
                className="text-orange-500 font-black text-base"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
              >
                {etape.numero}
              </span>
            </div>

            {/* Ligne de connexion */}
            <div className="h-px bg-orange-100 w-full hidden lg:block" />

            {/* Texte */}
            <div>
              <h3 className="text-gray-900 font-bold text-base mb-2">
                {etape.titre}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {etape.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}