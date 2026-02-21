export { default as authService } from './authService';
export { default as categoriasService } from './categoriasService';
export { default as productosService } from './productosService';
export { default as proveedoresService } from './proveedoresService';
export { default as cotizacionesService } from './cotizacionesService';
export { default as reportesService } from './reportesService';
export { default as usuariosService } from './usuariosService';
export { default as notificacionesService } from './notificacionesService';

// Re-export types
export type { User, AuthResponse } from './authService';
export type { Categoria, Subcategoria } from './categoriasService';
export type { Producto, MovimientoInventario, ProductosFilter } from './productosService';
export type { Proveedor, PagoProveedor, ResumenDeudas } from './proveedoresService';
export type { Cotizacion, CotizacionProducto, CotizacionProveedor, CotizacionRespuesta, ComparacionRespuestas } from './cotizacionesService';
export type { DashboardStats, InventarioValorizado, MovimientosReporte, ProductoPorCategoria } from './reportesService';
export type { CreateUserData, UpdateUserData } from './usuariosService';
export type { Notificacion } from './notificacionesService';

