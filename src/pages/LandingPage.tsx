import Navbar from "../landing/Navbar";
import Hero from "../landing/Hero";
import MarqueeStrip from "../landing/MarqueeStrip";
import VehiculesSection from "../landing/VehiculesSection";
import HowItWorks from "../landing/HowItWorks";
import Temoignages from "../landing/Temoignages";
import Offres from "../landing/Offres";
import AgentsIA from "../landing/AgentsIA";
import Footer from "../landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <MarqueeStrip/>
      <VehiculesSection/>
      <HowItWorks/>
      <AgentsIA/>
      <Temoignages/>
      <Offres/>
      <Footer/>
    </div>
  );
}