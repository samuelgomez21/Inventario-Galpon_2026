import api, { ApiResponse } from '@/lib/api';

export interface DashboardStats {
  total_productos: number;
  total_categorias: number;
  total_proveedores: number;
  productos_stock_bajo: number;
  productos_stock_critico: number;
  valor_inventario: number;
  valor_potencial_venta: number;
  ganancia_potencial: number;
  margen_promedio: number;
  deuda_total_proveedores: number;
  movimientos_hoy: number;
  ultimos_movimientos: Array<{
    id: number;
    producto: string;
    tipo: string;
    cantidad: number;
    fecha: string;
  }>;
  productos_mas_movidos: Array<{
    id: number;
    codigo: string;
    nombre: string;
    total_movimientos: number;
  }>;
}

export interface InventarioValorizado {
  total_productos: number;
  valor_total_compra: number;
  valor_total_venta: number;
  ganancia_potencial: number;
  margen_promedio: number;
  por_categoria: Array<{
    categoria: string;
    productos: number;
    valor_compra: number;
    valor_venta: number;
    ganancia: number;
  }>;
}

export interface ProductoPorCategoria {
  categoria: string;
  total: number;
  porcentaje: number;
  valor: number;
}

export interface MovimientosReporte {
  fecha_inicio: string;
  fecha_fin: string;
  total_entradas: number;
  total_salidas: number;
  total_ajustes: number;
  valor_entradas: number;
  valor_salidas: number;
  movimientos: Array<{
    id: number;
    producto: string;
    tipo: string;
    cantidad: number;
    valor: number;
    usuario: string;
    fecha: string;
  }>;
}

const reportesService = {
  // Dashboard principal
  getDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/reportes/dashboard');
    return response.data;
  },

  // Inventario valorizado
  getInventarioValorizado: async (): Promise<ApiResponse<InventarioValorizado>> => {
    const response = await api.get('/reportes/inventario-valorizado');
    return response.data;
  },

  // Movimientos (con filtros de fecha)
  getMovimientos: async (fechaInicio?: string, fechaFin?: string): Promise<ApiResponse<MovimientosReporte>> => {
    const response = await api.get('/reportes/movimientos', {
      params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
    });
    return response.data;
  },

  // Productos por categoría
  getProductosPorCategoria: async (): Promise<ApiResponse<ProductoPorCategoria[]>> => {
    const response = await api.get('/reportes/productos-por-categoria');
    return response.data;
  },

  // Productos más movidos
  getProductosMasMovidos: async (limite?: number): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/reportes/productos-mas-movidos', {
      params: { limite }
    });
    return response.data;
  },

  // Deudas con proveedores
  getDeudasProveedores: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/reportes/deudas-proveedores');
    return response.data;
  },

  // Stock en alerta
  getStockAlerta: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/reportes/stock-alerta');
    return response.data;
  },
};

export default reportesService;

