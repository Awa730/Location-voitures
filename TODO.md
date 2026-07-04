# TODO - Intégration Connexion Google

- [x] Vérifier l’existence du bouton Google sur la page de connexion
  - [x] Présent dans `src/components/UserLoginPage.tsx`
- [x] Vérifier l’initialisation OAuth GoogleOAuthProvider
  - [x] Présente dans `src/main.tsx`
- [ ] Corriger `GOOGLE_CLIENT_ID` dans `src/main.tsx` (placeholder → valeur réelle)
- [ ] Vérifier côté Google Cloud Console :
  - [ ] OAuth Consent Screen (Testing vs Production + test users)
  - [ ] OAuth client : Authorized JavaScript origins (ex: http://localhost:5173)
  - [ ] OAuth client : Authorized redirect URIs compatibles
- [ ] (Optionnel) Adapter la gestion « compte existant → login direct » selon stockage réel (backend/DB) si nécessaire
- [ ] Lancer `npm run dev` et tester le flux

