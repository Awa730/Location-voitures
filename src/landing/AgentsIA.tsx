const agents = [
  {
    nom: "Aïcha AI",
    role: "Agent conversationnel premium",
    mission: "Guide les visiteurs, présente les véhicules et recommande les meilleures options en temps réel.",
    accent: "Relation client fluide",
    couleur: "from-orange-500 to-amber-400",
    initiales: "AA",
  },
  {
    nom: "Mouhamed AI",
    role: "Agent réservation intelligente",
    mission: "Analyse les disponibilités, les dates et les préférences pour accélérer la réservation.",
    accent: "Décision rapide et assistée",
    couleur: "from-gray-900 to-gray-700",
    initiales: "MA",
  },
  {
    nom: "Sokhna AI",
    role: "Agent support & fidélisation",
    mission: "Accompagne les clients après réservation, répond aux questions et améliore l’expérience globale.",
    accent: "Support 24h/24, 7j/7",
    couleur: "from-orange-400 to-orange-600",
    initiales: "SA",
  },
];

export default function AgentsIA() {
  return (
    <section className="px-6 md:px-[5vw] py-24 bg-white border-t border-gray-100">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-3 font-semibold">
            Expérience augmentée
          </p>
          <h2
            className="text-[clamp(2.5rem,5vw,4rem)] text-gray-900 leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Nos agents IA<br />au service de Movia
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
            Movia peut s’appuyer sur des agents IA pour améliorer l’accueil digital, fluidifier les réservations,
            assister les clients et renforcer la qualité du service à chaque étape du parcours.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
          {[
            { valeur: "24/7", label: "Assistance continue" },
            { valeur: "3x", label: "Réponses plus rapides" },
            { valeur: "100%", label: "Suivi digitalisé" },
          ].map((item) => (
            <div key={item.label} className="rounded-sm border border-gray-100 bg-gray-50 px-5 py-4">
              <p className="text-3xl text-orange-500" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {item.valeur}
              </p>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {agents.map((agent) => (
          <article key={agent.nom} className="relative overflow-hidden rounded-sm border border-gray-100 bg-gray-50 p-8">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${agent.couleur}`} />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-orange-500 font-semibold">Agent IA</p>
                <h3 className="mt-3 text-2xl text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
                  {agent.nom}
                </h3>
                <p className="mt-1 text-sm text-gray-400">{agent.role}</p>
              </div>

              <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${agent.couleur} text-xl font-black text-white shadow-lg`}>
                {agent.initiales}
              </div>
            </div>

            <div className="mt-8 rounded-sm border border-gray-200 bg-white p-5">
              <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">Mission</p>
              <p className="text-sm leading-relaxed text-gray-600">{agent.mission}</p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-5">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400">Bénéfice clé</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{agent.accent}</p>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-orange-500">
                IA active
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}