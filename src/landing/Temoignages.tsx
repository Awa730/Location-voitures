import { useState } from "react";

interface Avis {
  initiales: string;
  nom: string;
  role: string;
  texte: string;
  note: number;
  vedette?: boolean;
}

export default function Temoignages() {
  const [avis, setAvis] = useState<Avis[]>([
    {
      initiales: "AM",
      nom: "Abdoulaye Mbaye",
      role: "Directeur commercial, Dakar",
      texte: "Service exceptionnel. J'ai loué une BMW pour un voyage d'affaires et tout était parfait — voiture immaculée, livraison ponctuelle, équipe très professionnelle.",
      note: 5,
      vedette: true,
    },
    {
      initiales: "FD",
      nom: "Fatou Diallo",
      role: "Entrepreneure, Saint-Louis",
      texte: "Réservation en 5 minutes, véhicule propre et en parfait état. Prix très compétitif. Je recommande vivement Movia.",
      note: 5,
    },
    {
      initiales: "OS",
      nom: "Omar Sow",
      role: "Ingénieur, Ziguinchor",
      texte: "Le Land Cruiser était parfait pour mon voyage à Ziguinchor. Route difficile mais la voiture a tout géré. Support client très réactif.",
      note: 4,
    },
  ]);

  const [formulaire, setFormulaire] = useState({
    nom: "",
    role: "",
    texte: "",
    note: 5,
  });

  const [envoye, setEnvoye] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleNote = (note: number) => {
    setFormulaire({ ...formulaire, note });
  };

  const handleSubmit = () => {
    if (!formulaire.nom || !formulaire.texte) return;

    const nouvelAvis: Avis = {
      initiales: formulaire.nom.slice(0, 2).toUpperCase(),
      nom: formulaire.nom,
      role: formulaire.role || "Client Movia",
      texte: formulaire.texte,
      note: formulaire.note,
    };

    setAvis([...avis, nouvelAvis]);
    setFormulaire({ nom: "", role: "", texte: "", note: 5 });
    setEnvoye(true);
    setTimeout(() => setEnvoye(false), 3000);
  };

  return (
    <section id="testimonials" className="px-6 md:px-[5vw] py-24 bg-white">

      
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-3 font-semibold">
            Ce qu'ils disent
          </p>
          <h2
            className="text-[clamp(2.5rem,5vw,4rem)] text-gray-900 leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Avis<br />clients
          </h2>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {avis.map((a, i) => (
          <div
            key={i}
            className={`p-8 rounded-sm ${
              a.vedette
                ? "bg-orange-500"
                : "bg-gray-50 border border-gray-100"
            }`}
          >
            <p className={`text-lg tracking-widest mb-5 ${a.vedette ? "text-white/60" : "text-orange-500"}`}>
              {"★".repeat(a.note)}{"☆".repeat(5 - a.note)}
            </p>
            <p className={`text-sm leading-relaxed italic mb-6 ${a.vedette ? "text-white/90" : "text-gray-600"}`}>
              "{a.texte}"
            </p>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  a.vedette
                    ? "bg-white/20 text-white"
                    : "bg-orange-100 text-orange-500 border border-orange-200"
                }`}
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {a.initiales}
              </div>
              <div>
                <p className={`text-sm font-semibold ${a.vedette ? "text-white" : "text-gray-900"}`}>
                  {a.nom}
                </p>
                <p className={`text-xs ${a.vedette ? "text-white/60" : "text-gray-400"}`}>
                  {a.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="border border-gray-100 rounded-sm p-8 bg-gray-50 max-w-2xl mx-auto">
        <h3
          className="text-2xl text-gray-900 mb-6"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          Laisser un avis
        </h3>

        
        <div className="mb-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
            Votre note
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => handleNote(n)}
                className={`text-2xl transition-all ${
                  n <= formulaire.note
                    ? "text-orange-500"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Nom */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
            Votre nom *
          </label>
          <input
            type="text"
            name="nom"
            value={formulaire.nom}
            onChange={handleChange}
            placeholder="Ex: Awa Fall"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
          />
        </div>

        {/* Rôle */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
            Votre profession
          </label>
          <input
            type="text"
            name="role"
            value={formulaire.role}
            onChange={handleChange}
            placeholder="Ex: Ingénieur, Dakar"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
          />
        </div>

        
        <div className="mb-6">
          <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
            Votre avis *
          </label>
          <textarea
            name="texte"
            value={formulaire.texte}
            onChange={handleChange}
            placeholder="Partagez votre expérience avec Movia..."
            rows={4}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all"
        >
          {envoye ? "✅ Avis publié !" : "Publier mon avis"}
        </button>
      </div>
    </section>
  );
}