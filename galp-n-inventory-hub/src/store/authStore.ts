import { create } from 'zustand';
import authService, { User } from '@/services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  abilities: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmail: string | null;

  // Acciones
  setPendingEmail: (email: string | null) => void;
  solicitarCodigo: (email: string) => Promise<{ success: boolean; message: string }>;
  verificarCodigo: (email: string, codigo: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;

  // Helpers para permisos
  hasAbility: (ability: string) => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  abilities: [],
  isAuthenticated: false,
  isLoading: false,
  pendingEmail: null,

  setPendingEmail: (email) => set({ pendingEmail: email }),

  solicitarCodigo: async (email) => {
    set({ isLoading: true });
    try {
      const response = await authService.solicitarCodigo(email);
      set({ pendingEmail: email, isLoading: false });
      return { success: true, message: response.message || 'Código enviado al correo' };
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || error.message || 'Error al enviar el código';
      return { success: false, message };
    }
  },

  verificarCodigo: async (email, codigo) => {
    set({ isLoading: true });
    try {
      const response = await authService.verificarCodigo(email, codigo);

      if (!response.success) {
        throw new Error(response.message || 'Error al verificar código');
      }

      const { user, token, abilities } = response.data;

      if (!token) {
        throw new Error('No se recibió el token del servidor');
      }

      // Guardar token en localStorage
      localStorage.setItem('auth_token', token);

      set({
        user,
        token,
        abilities,
        isAuthenticated: true,
        pendingEmail: null,
        isLoading: false,
      });

      return { success: true, message: 'Inicio de sesión exitoso' };
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || error.message || 'Código inválido o expirado';
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Continuar con el logout aunque falle el servidor
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('auth_token');
      set({
        user: null,
        token: null,
        abilities: [],
        isAuthenticated: false,
        pendingEmail: null,
      });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null, abilities: [] });
      return;
    }

    try {
      const response = await authService.me();
      // response = { success, message, data: { user, abilities } }
      if (response.success && response.data) {
        set({
          user: response.data.user,
          abilities: response.data.abilities,
          isAuthenticated: true,
          token,
        });
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      localStorage.removeItem('auth_token');
      set({
        user: null,
        token: null,
        abilities: [],
        isAuthenticated: false,
      });
    }
  },

  hasAbility: (ability) => {
    const { abilities } = get();
    return abilities.includes(ability) || abilities.includes('*');
  },

  isAdmin: () => {
    const { user } = get();
    return user?.rol === 'admin';
  },
}));
