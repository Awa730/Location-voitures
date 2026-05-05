export default function Footer() {
  const colonnes = [
    {
      titre: "Véhicules",
      liens: ["Citadines", "Berlines", "SUV & 4x4", "Luxe", "Hypercars"],
    },
    {
      titre: "Services",
      liens: ["Location courte durée", "Location longue durée", "Avec chauffeur", "Livraison à domicile", "Achat de véhicule"],
    },
    {
      titre: "Société",
      liens: ["À propos", "Nos agences", "Partenaires", "Carrières", "Contact"],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">

      
      <div className="px-6 md:px-[5vw] pt-16 pb-8">
        <div className="flex flex-wrap gap-10 justify-between mb-12">

          
          <div className="max-w-xs">
            <div className="mb-4 inline-flex items-center rounded-sm bg-white p-2">
              <img
                src="/images/logo-movia.jpeg"
                alt="Movia Automobile"
                className="h-14 md:h-16 ml-2 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Location et vente de voitures premium au Sénégal. Disponible dans 15 villes, 24h/24.
            </p>

            
            <div className="flex gap-3 mt-5">
              {["Facebook", "Instagram", "Twitter"].map((reseau) => (
                <button
                  key={reseau}
                  className="w-9 h-9 rounded-full border border-gray-700 hover:border-orange-500 hover:text-orange-500 text-gray-400 text-xs transition-all flex items-center justify-center"
                >
                  {reseau.slice(0, 1)}
                </button>
              ))}
            </div>
          </div>

          
          {colonnes.map((col) => (
            <div key={col.titre}>
              <h4 className="text-xs tracking-widest uppercase text-orange-500 mb-4 font-semibold">
                {col.titre}
              </h4>
              <ul className="space-y-2.5">
                {col.liens.map((lien) => (
                  <li key={lien}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {lien}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-gray-800 border-b mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 text-lg">
              📍
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Adresse</p>
              <p className="text-sm text-white">Dakar, Sénégal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 text-lg">
              📞
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Téléphone</p>
              <p className="text-sm text-white">+221 77 955 24 71/ 76 261 68 13</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 text-lg">
              ✉️
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Email</p>
              <p className="text-sm text-white">contact@movia.sn</p>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © 2026 Movia Automobile. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-xs">
            Conditions d'utilisation · Politique de confidentialité
          </p>
        </div>
      </div>
    </footer>
  );
}
