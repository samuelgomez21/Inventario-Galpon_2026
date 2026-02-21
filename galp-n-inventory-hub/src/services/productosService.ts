import api, { ApiResponse, PaginatedResponse } from '@/lib/api';

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria_id: number;
  subcategoria_id: number | null;
  proveedor_id: number | null;
  precio_compra: number;
  precio_venta: number;
  stock: number;
  stock_minimo: number;
  unidad_medida: string;
  lote: string | null;
  fecha_vencimiento: string | null;
  ubicacion: string | null;
  activo: boolean;
  estado_stock: 'normal' | 'bajo' | 'critico';
  categoria?: {
    id: number;
    nombre: string;
    color: string;
    icono: string;
  };
  subcategoria?: {
    id: number;
    nombre: string;
  };
  proveedor?: {
    id: number;
    nombre: string;
  };
  created_at: string;
  updated_at: string;
}

export interface MovimientoInventario {
  id: number;
  producto_id: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  precio_unitario: number | null;
  lote: string | null;
  proveedor_id: number | null;
  motivo: string | null;
  user_id: number;
  user?: {
    id: number;
    nombre: string;
  };
  created_at: string;
}

export interface ProductosFilter {
  categoria_id?: number;
  subcategoria_id?: number;
  proveedor_id?: number;
  estado_stock?: 'normal' | 'bajo' | 'critico';
  buscar?: string;
  page?: number;
  per_page?: number;
}

const productosService = {
  // Obtener todos los productos (paginado)
  getAll: async (filters?: ProductosFilter): Promise<PaginatedResponse<Producto>> => {
    const response = await api.get('/productos', { params: filters });
    return response.data;
  },

  // Obtener productos con stock bajo
  getStockBajo: async (): Promise<ApiResponse<Producto[]>> => {
    const response = await api.get('/productos/stock-bajo');
    return response.data;
  },

  // Obtener un producto por ID
  getById: async (id: number): Promise<ApiResponse<Producto>> => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  // Obtener movimientos de un producto
  getMovimientos: async (productoId: number): Promise<ApiResponse<MovimientoInventario[]>> => {
    const response = await api.get(`/productos/${productoId}/movimientos`);
    return response.data;
  },

  // Crear producto (solo admin)
  create: async (data: Partial<Producto>): Promise<ApiResponse<Producto>> => {
    const response = await api.post('/productos', data);
    return response.data;
  },

  // Actualizar producto (solo admin)
  update: async (id: number, data: Partial<Producto>): Promise<ApiResponse<Producto>> => {
    const response = await api.put(`/productos/${id}`, data);
    return response.data;
  },

  // Eliminar producto (solo admin)
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },

  // Registrar entrada de stock (solo admin)
  entradaStock: async (productoId: number, data: {
    cantidad: number;
    precio_compra: number;
    lote?: string;
    proveedor_id?: number;
    motivo?: string;
  }): Promise<ApiResponse<MovimientoInventario>> => {
    const response = await api.post(`/productos/${productoId}/entrada`, data);
    return response.data;
  },

  // Registrar salida de stock (solo admin)
  salidaStock: async (productoId: number, data: {
    cantidad: number;
    motivo: string;
  }): Promise<ApiResponse<MovimientoInventario>> => {
    const response = await api.post(`/productos/${productoId}/salida`, data);
    return response.data;
  },
};

export default productosService;

