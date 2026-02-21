import api, { ApiResponse } from '@/lib/api';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'empleado';
  activo: boolean;
  ultimo_acceso: string | null;
  created_at: string;
  updated_at: string;
}

export interface SolicitarCodigoRequest {
  email: string;
}

export interface VerificarCodigoRequest {
  email: string;
  codigo: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  abilities: string[];
}

const authService = {
  // Solicitar código de verificación al email
  solicitarCodigo: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/solicitar-codigo', { email });
    return response.data;
  },

  // Verificar código y obtener token
  verificarCodigo: async (email: string, codigo: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/verificar-codigo', { email, codigo });
    return response.data;
  },

  // Obtener usuario actual
  me: async (): Promise<ApiResponse<{ user: User; abilities: string[] }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Cerrar sesión
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Cerrar todas las sesiones
  logoutAll: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/logout-all');
    return response.data;
  },
};

export default authService;

