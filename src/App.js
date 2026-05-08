import React from 'react';
import useLanguageAndRegion from './useLanguageAndRegion';

function App() {
  const { language, setLanguage, region, setRegion } = useLanguageAndRegion();

  // Exemple de formatage de devise selon la région
  const priceFormatter = new Intl.NumberFormat(region, { style: 'currency', currency: region === 'FR' ? 'EUR' : 'USD' });

  return (
    <div>
      <h1>Langue actuelle : {language}</h1>
      <h2>Région actuelle : {region}</h2>

      <div>
        <label>Changer la langue :</label>
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="fr">Français</option>
          {/* Ajoutez d’autres langues si besoin */}
        </select>
      </div>

      <div>
        <label>Changer la région :</label>
        <select value={region} onChange={e => setRegion(e.target.value)}>
          <option value="US">États-Unis</option>
          <option value="FR">France</option>
          {/* Ajoutez d’autres régions si besoin */}
        </select>
      </div>

      <p>Exemple de prix formaté : {priceFormatter.format(1234.56)}</p>
    </div>
  );
}

export default App;
