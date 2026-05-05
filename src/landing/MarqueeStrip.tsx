export default function MarqueeStrip() {
  const items = [
    "RÉSERVATION INSTANTANÉE",
    "LIVRAISON À DOMICILE",
    "ASSURANCE TOUS RISQUES",
    "KILOMÉTRAGE ILLIMITÉ",
    "SUPPORT 24/7",
    "ANNULATION GRATUITE",
    "RÉSERVATION INSTANTANÉE",
    "LIVRAISON À DOMICILE",
    "ASSURANCE TOUS RISQUES",
    "KILOMÉTRAGE ILLIMITÉ",
    "SUPPORT 24H/24",
    "ANNULATION GRATUITE",
  ];

  return (
    <div className="bg-orange-500 py-3 overflow-hidden">
      <div className="flex gap-10 whitespace-nowrap animate-marquee">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-4 text-white font-black text-sm tracking-widest uppercase"
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}