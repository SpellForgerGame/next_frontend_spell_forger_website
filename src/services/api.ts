import axios from 'axios';
import { env } from 'process';


// Create axios instance with the correct base URL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredToken = () => {
  if (globalThis.window === undefined) return null;
  return globalThis.localStorage.getItem('token');
};

// Add request interceptor to include the JWT token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration (optional but good practice)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && globalThis.window !== undefined) {
      // If token is invalid, remove it and redirect to login (client-side only)
      globalThis.localStorage.removeItem('token');
      globalThis.window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- Corrected Types to match your Python Schemas ---
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Spell {
  id: number;
  name: string;
  description: string;
  mana_cost: number;
  damage?: number;
  element: string;
  user_id: number;
  vote_count: number;
  user_vote?: 'upvote' | 'downvote' | null;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// This type is for creating AND updating a spell
export interface SpellFormData {
  name: string;
  description: string;
  mana_cost: number;
  damage?: number;
  element: string;
}

// --- Corrected API functions to match your Back-End Endpoints ---
export const api = {
  // Autenticação
  login: async (data: LoginData) => {
    // The backend expects form data for the token endpoint
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await apiClient.post('/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data; // Returns { access_token: string, token_type: string }
  },

  register: async (data: RegisterData) => {
    const response = await apiClient.post('/users/register', data);
    return response.data;
  },

  // Spells (Full CRUD)
  getSpells: async (): Promise<Spell[]> => {

    const formData = new URLSearchParams();
    formData.append('username', env.USER_NAME!);
    formData.append('password', env.USER_PASSWORD!);

    const loginResponse = await apiClient.post('/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const response = await apiClient.get('/spells',
      {
        headers: {
          Authorization: `Bearer ${loginResponse.data.access_token}`
        }
      }
    );
    return response.data;
  },

  createSpell: async (data: SpellFormData): Promise<Spell> => {
    const response = await apiClient.post('/spells', data);
    return response.data;
  },

  updateSpell: async (spellId: number, data: SpellFormData): Promise<Spell> => {
    const response = await apiClient.put(`/spells/${spellId}`, data);
    return response.data;
  },

  deleteSpell: async (spellId: number): Promise<void> => {
    await apiClient.delete(`/spells/${spellId}`);
  },

  // Voting
  voteSpell: async (spellId: number, voteType: 'upvote' | 'downvote'): Promise<Spell> => {
    // MUDANÇA: O back-end agora retorna o feitiço atualizado (Promise<Spell>)
    const response = await apiClient.post(`/spells/${spellId}/vote`, {
      vote_type: voteType // Enviando o tipo de voto
    });
    return response.data;
  },

  // Perfil do usuário
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/users/me');
    return response.data;
  }
};

export default api;
