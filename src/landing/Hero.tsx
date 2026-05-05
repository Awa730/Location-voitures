

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-white px-4 pb-10 pt-28 sm:px-6 sm:pb-12 md:px-[5vw] md:pb-[8vh] md:pt-32">

      {/* Image de fond */}
      <div className="absolute inset-0">
        <img
          src="/images/logo.png"
          alt="Hero car"
          className="h-full w-full object-cover object-center opacity-80"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent md:from-white/90 md:via-transparent" />
        <div className="absolute right-[-160px] top-1/4 h-[280px] w-[280px] rounded-full bg-orange-400/10 blur-[80px] sm:right-[-80px] sm:h-[380px] sm:w-[380px] md:right-1/4 md:h-[500px] md:w-[500px] md:blur-[100px]" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 w-full">

        {/* Label */}
        <p className="mb-3 max-w-[18rem] text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-orange-500 sm:mb-4 sm:max-w-none sm:text-xs sm:tracking-[0.3em]">
          Location & Vente de véhicules premium
        </p>

        {/* Titre */}
        <h2
          className="mb-6 text-[clamp(3.2rem,18vw,10rem)] leading-[0.9] text-gray-900 sm:mb-8 sm:text-[clamp(4.5rem,14vw,10rem)] md:text-[clamp(5rem,12vw,10rem)]"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.01em" }}
        >
          <span
            className="mb-2 block max-w-[9ch] text-[0.34em] text-gray-400 sm:max-w-none sm:text-[0.38em]"
            style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}
          >
            La route en toute confiance
          </span>
          MOVIA<span className="text-orange-500">.</span>
        </h2>

        {/* Description + boutons */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
            <strong className="text-gray-800">Plus de 200 véhicules disponibles.</strong>{" "} <br />
            Location à la journée ou achat, trouvez le véhicule de vos rêves.
            Livraison à domicile, assurance incluse.
          </p>
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:flex-wrap">
            <a
              href="#vehicles"
              className="w-full rounded-sm bg-orange-500 px-6 py-3.5 text-center text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 sm:w-auto sm:px-7"
            >
              Explorer les véhicules
            </a>
            <a
              href="#how"
              className="flex items-center justify-center gap-2 border-b border-gray-300 pb-0.5 text-xs uppercase tracking-widest text-gray-400 transition-all hover:border-orange-400 hover:text-orange-500 sm:justify-start"
            >
              Comment ça marche
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 border-t border-gray-200 pt-6 sm:mt-10 sm:grid-cols-4 sm:gap-8 sm:pt-8 lg:gap-10">
          {[
            { value: "200+", label: "Véhicules disponibles" },
            { value: "50K+", label: "Clients satisfaits" },
            { value: "15",   label: "Villes couvertes" },
            { value: "4.9★", label: "Note moyenne" },
          ].map((s) => (
            <div key={s.label} className="min-w-0">
              <p
                className="text-2xl leading-none text-orange-500 sm:text-3xl"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {s.value}
              </p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-widest text-gray-400 sm:text-xs">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
