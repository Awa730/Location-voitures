import React from "react";


const cuteCar = "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  isReserved?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, isReserved }) => {
  return (
    
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] px-4 py-3">
      
      <div className="w-full max-w-3xl bg-white rounded-[22px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[420px]">
        
          {/* SECTION GAUCHE : FORMULAIRE D'AUTHENTIFICATION [1] */}
        <div className="w-full md:w-[55%] flex flex-col justify-center px-5 py-4 md:px-8 md:py-6 lg:px-9 lg:py-7">
          <div className="w-full max-w-[310px] mx-auto">
            <div className="mb-4">
              
              <img src="/images/logo-movia.jpeg" alt="Movia Logo" className="w-22 h-14 mb-2 object-contain" />
              
              <h2 className="text-xl font-black text-[#0F172A] leading-tight mb-1 tracking-tight">
                {title}
              </h2>
              <p className="text-[#94A3B8] text-xs font-medium leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Utilisation des props pour injecter dynamiquement LoginForm ou SignUp [1] */}
            <div className="w-full">
              {children}
            </div>
          </div>
        </div>

      
        <div className="hidden md:flex md:w-[45%] bg-[#F97316] relative items-center justify-center px-5 py-4 overflow-hidden">
          <div className="absolute top-[-5%] left-[-5%] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <img 
              src={cuteCar} 
              alt="Voiture Movia Automobile" 
              className={`w-full max-w-[180px] h-auto object-contain rounded-2xl drop-shadow-2xl transition-all duration-700 ${
                isReserved ? "animate-push" : "animate-float"
              }`} 
            />
            
            <div className="mt-4 text-center text-white">
              <h1 className="text-lg font-black uppercase tracking-tighter">Movia Automobile</h1>
              <p className="text-orange-100 text-[10px] mt-1 font-medium italic">
                {isReserved ? "Votre voiture arrive !" : "Location de véhicules premium"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;
