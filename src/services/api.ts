const API_URL = 'http://localhost:3000';

const getToken = () => localStorage.getItem('access_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// ─── AUTH ────────────────────────────────────────────
export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Identifiants incorrects');
  return res.json();
};

export const register = async (nom: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, email, password }),
  });
  if (!res.ok) throw new Error('Erreur inscription');
  return res.json();
};

export const googleAuth = async (credential: string) => {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) throw new Error('Erreur Google Auth');
  return res.json();
};

// ─── VÉHICULES ───────────────────────────────────────
export const getVehicules = async () => {
  const res = await fetch(`${API_URL}/vehicules`);
  return res.json();
};

export const getVehicule = async (id: number) => {
  const res = await fetch(`${API_URL}/vehicules/${id}`);
  return res.json();
};

// ─── RÉSERVATIONS ────────────────────────────────────
export const creerReservation = async (data: any) => {
  const res = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erreur réservation');
  return res.json();
};

export const getMesReservations = async () => {
  const res = await fetch(`${API_URL}/reservations/mes-reservations`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const validerPaiement = async (id: number, modePaiement: string, numeroTransaction: string) => {
  const res = await fetch(`${API_URL}/reservations/${id}/paiement`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ modePaiement, numeroTransaction }),
  });
  return res.json();
};

// ─── ADMIN ───────────────────────────────────────────
export const getAllReservations = async () => {
  const res = await fetch(`${API_URL}/reservations`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const changerStatut = async (id: number, statut: string) => {
  const res = await fetch(`${API_URL}/reservations/${id}/statut`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ statut }),
  });
  return res.json();
};

export const getStats = async () => {
  const res = await fetch(`${API_URL}/reservations/stats`, {
    headers: authHeaders(),
  });
  return res.json();
};

// ─── PROFIL CLIENT ────────────────────────────────────
export const getProfile = async () => {
  const res = await fetch(`${API_URL}/client/profile`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const updateProfile = async (data: any) => {
  const res = await fetch(`${API_URL}/client/profile`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

// ─── CONVERSION DEVISES ───────────────────────────────
export const convertirPrix = async (montantFCFA: number) => {
  const res = await fetch(`${API_URL}/exchange/convert?montant=${montantFCFA}`);
  return res.json();
};

export const getTauxChange = async () => {
  const res = await fetch(`${API_URL}/exchange/rates`);
  return res.json();
};