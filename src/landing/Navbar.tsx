import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface FilterState {
  category: string;
  maxPrice: string;
  transmission: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const isClientLoggedIn = localStorage.getItem("utilisateur") === "true";
  const [filters, setFilters] = useState<FilterState>({
    category: "Toutes",
    maxPrice: "Tous",
    transmission: "Tous",
  });

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Véhicules", href: "#vehicles" },
    { label: "Comment ça marche", href: "#how" },
    { label: "Offres", href: "#offers" },
    { label: "Avis", href: "#testimonials" },
  ];

  const categories = ["Toutes", "Sport", "Berline", "Luxe", "Supercar", "Hypercar"];

  const prices = [
    "Tous",
    "- 100 000",
    "100 000 - 300 000",
    "+ 300 000",
  ];

  const transmissions = ["Tous", "Boîte Manuelle", "Boîte Automatique"];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setSearch("");
    setFilters({ category: "Toutes", maxPrice: "Tous", transmission: "Tous" });
  };

  const hasActiveFilters =
    search !== "" ||
    filters.category !== "Toutes" ||
    filters.maxPrice !== "Tous" ||
    filters.transmission !== "Tous";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md border-b border-orange-100"
          : "bg-white/95 backdrop-blur-lg border-b border-orange-100"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 md:px-[5vw] md:py-4">
        <Link to="/" className="shrink-0">
          <img
            src="/images/logo mv.png"
            alt="Movia Automobile"
            className="h-10 w-auto md:h-20"
          />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-gray-500 hover:text-orange-500 text-xs tracking-widest uppercase transition-colors font-medium"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-2 rounded-sm transition-all ${
              searchOpen
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:text-orange-500 hover:bg-orange-50"
            }`}
            aria-label="Toggle search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* CTA desktop — bouton Admin supprimé */}
          <div className="hidden items-center gap-3 lg:flex">
            {isClientLoggedIn ? (
              <>
                <Link
                  to="/client/profile"
                  className="px-4 py-2.5 border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 text-xs font-bold tracking-widest uppercase rounded-sm transition-all"
                >
                  Mon espace
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("utilisateur");
                    navigate("/");
                  }}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all hover:shadow-lg"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login/client"
                  className="px-4 py-2.5 border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 text-xs font-bold tracking-widest uppercase rounded-sm transition-all"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all hover:shadow-lg"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-sm p-2 text-gray-400 transition-all hover:bg-orange-50 hover:text-orange-500 lg:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      {searchOpen && (
        <div className="border-t border-orange-100 bg-white px-6 md:px-[5vw] py-4">
          <div className="relative mb-4">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un véhicule... (ex: BMW, SUV, Diesel)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
              aria-label="Recherche véhicule"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                aria-label="Clear search"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-start gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 tracking-widest uppercase font-medium">
                Catégorie
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange("category", cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all ${
                      filters.category === cat
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 bg-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 tracking-widest uppercase font-medium">
                Prix / jour (FCFA)
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {prices.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleFilterChange("maxPrice", p)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all ${
                      filters.maxPrice === p
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 bg-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 tracking-widest uppercase font-medium">
                Boîte
              </label>
              <div className="flex gap-1.5">
                {transmissions.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleFilterChange("transmission", t)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all ${
                      filters.transmission === t
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 bg-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-semibold underline underline-offset-2 mt-6"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Réinitialiser
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">Filtres actifs :</span>
              {search && (
                <span className="px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-600 text-xs rounded-sm font-medium">
                  "{search}"
                </span>
              )}
              {filters.category !== "Toutes" && (
                <span className="px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-600 text-xs rounded-sm font-medium">
                  {filters.category}
                </span>
              )}
              {filters.maxPrice !== "Tous" && (
                <span className="px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-600 text-xs rounded-sm font-medium">
                  {filters.maxPrice} FCFA
                </span>
              )}
              {filters.transmission !== "Tous" && (
                <span className="px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-600 text-xs rounded-sm font-medium">
                  {filters.transmission}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Menu mobile — bouton Admin supprimé */}
      {menuOpen && (
        <div className="flex flex-col gap-4 border-t border-orange-100 bg-white px-4 pb-5 pt-4 sm:px-6 lg:hidden">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-gray-500 hover:text-orange-500 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          {isClientLoggedIn ? (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/client/profile");
                }}
                className="text-left text-gray-500 text-sm font-medium"
              >
                Mon espace
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  localStorage.removeItem("utilisateur");
                  navigate("/");
                }}
                className="px-4 py-2.5 bg-red-500 text-white text-xs font-bold tracking-widest uppercase rounded-sm text-center"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login/client"
                className="text-gray-500 text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="px-4 py-2.5 bg-orange-500 text-white text-xs font-bold tracking-widest uppercase rounded-sm text-center"
                onClick={() => setMenuOpen(false)}
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}