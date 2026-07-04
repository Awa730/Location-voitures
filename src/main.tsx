
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";

// Pour activer Google OAuth, configurez votre Client ID Google Cloud
// 1. Allez sur https://console.cloud.google.com
// 2. Créez un projet → APIs & Services → Credentials
// 3. Créez un OAuth 2.0 Client ID (Web application)
// 4. Ajoutez http://localhost:5173 comme origine JavaScript autorisée
// 5. Collez votre Client ID ci-dessous:

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);