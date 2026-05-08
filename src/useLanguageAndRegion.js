import { useState, useEffect } from 'react';
import i18n from 'i18next'; // Assurez-vous que i18next est bien configuré dans votre projet

function useLanguageAndRegion() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('lang') || navigator.language || 'en';
  });

  const [region, setRegion] = useState(() => {
    return localStorage.getItem('region') || 'US';
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('region', region);
  }, [region]);

  return { language, setLanguage, region, setRegion };
}

export default useLanguageAndRegion;
