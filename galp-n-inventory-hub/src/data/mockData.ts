export const CATEGORIAS = {
  alimentos: { nombre: 'Alimentos para Mascotas', emoji: '🐕', color: 'cat-alimentos', descripcion: 'Concentrados, snacks y alimentos especializados', subcategorias: ['Perros', 'Gatos', 'Aves', 'Peces', 'Roedores', 'Equinos', 'Bovinos', 'Porcinos'], productos: 342, valor: 13_600_000 },
  medicamentos: { nombre: 'Medicamentos Veterinarios', emoji: '💊', color: 'cat-medicamentos', descripcion: 'Vacunas, antiparasitarios y tratamientos', subcategorias: ['Vacunas', 'Antiparasitarios', 'Antibióticos', 'Antiinflamatorios', 'Analgésicos', 'Dermatológicos'], productos: 186, valor: 9_700_000 },
  suplementos: { nombre: 'Suplementos Animales', emoji: '💪', color: 'cat-suplementos', descripcion: 'Vitaminas, minerales y nutracéuticos', subcategorias: ['Vitaminas', 'Minerales', 'Probióticos', 'Ácidos Grasos', 'Aminoácidos'], productos: 124, valor: 7_200_000 },
  insumos: { nombre: 'Insumos Agrícolas', emoji: '🌾', color: 'cat-insumos', descripcion: 'Fertilizantes, semillas y herramientas', subcategorias: ['Fertilizantes', 'Semillas', 'Herbicidas', 'Insecticidas', 'Fungicidas', 'Herramientas'], productos: 310, valor: 10_700_000 },
  accesorios: { nombre: 'Accesorios para Mascotas', emoji: '🎀', color: 'cat-accesorios', descripcion: 'Collares, juguetes y accesorios', subcategorias: ['Collares', 'Correas', 'Camas', 'Juguetes', 'Transportadoras', 'Comederos', 'Rascadores', 'Ropa'], productos: 285, valor: 7_300_000 },
};

export const MOCK_PRODUCTOS = [
  { codigo: 'ALI-001', nombre: 'Dog Chow Adulto 21kg', categoria: 'alimentos', subcategoria: 'Perros', stock: 3, stockMin: 20, precioCompra: 75000, precioVenta: 85000, proveedor: 'Purina Colombia' },
  { codigo: 'MED-015', nombre: 'Ivermectina 50ml', categoria: 'medicamentos', subcategoria: 'Antiparasitarios', stock: 5, stockMin: 15, precioCompra: 18000, precioVenta: 25000, proveedor: 'Bayer Animal Health' },
  { codigo: 'ACC-042', nombre: 'Collar Antipulgas Perro L', categoria: 'accesorios', subcategoria: 'Collares', stock: 12, stockMin: 15, precioCompra: 22000, precioVenta: 35000, proveedor: 'Bayer Animal Health' },
  { codigo: 'INS-008', nombre: 'Fertilizante NPK 50kg', categoria: 'insumos', subcategoria: 'Fertilizantes', stock: 8, stockMin: 10, precioCompra: 45000, precioVenta: 60000, proveedor: 'Nutrición de Plantas' },
  { codigo: 'SUP-003', nombre: 'Vitamina E Equinos 1L', categoria: 'suplementos', subcategoria: 'Vitaminas', stock: 6, stockMin: 8, precioCompra: 65000, precioVenta: 90000, proveedor: 'Zoetis' },
  { codigo: 'ALI-022', nombre: 'Cat Chow Gatitos 8kg', categoria: 'alimentos', subcategoria: 'Gatos', stock: 25, stockMin: 10, precioCompra: 52000, precioVenta: 62000, proveedor: 'Purina Colombia' },
  { codigo: 'MED-003', nombre: 'Amoxicilina 100ml', categoria: 'medicamentos', subcategoria: 'Antibióticos', stock: 30, stockMin: 10, precioCompra: 28000, precioVenta: 38000, proveedor: 'Zoetis' },
  { codigo: 'INS-015', nombre: 'Semillas Maíz Híbrido 25kg', categoria: 'insumos', subcategoria: 'Semillas', stock: 40, stockMin: 15, precioCompra: 120000, precioVenta: 155000, proveedor: 'Syngenta' },
  { codigo: 'ACC-010', nombre: 'Cama Perro Grande', categoria: 'accesorios', subcategoria: 'Camas', stock: 18, stockMin: 5, precioCompra: 85000, precioVenta: 120000, proveedor: 'Mars Colombia' },
  { codigo: 'ALI-050', nombre: 'Concentrado Ganado 40kg', categoria: 'alimentos', subcategoria: 'Bovinos', stock: 50, stockMin: 20, precioCompra: 95000, precioVenta: 115000, proveedor: 'Purina Colombia' },
];

export const MOCK_PROVEEDORES = [
  { id: 1, nombre: 'Purina Colombia', contacto: 'Juan Pérez', email: 'ventas@purina.com.co', telefono: '601-555-0101', productos: 8, deuda: 0 },
  { id: 2, nombre: 'Mars Colombia', contacto: 'Ana García', email: 'pedidos@mars.com.co', telefono: '601-555-0202', productos: 5, deuda: 450000 },
  { id: 3, nombre: 'Bayer Animal Health', contacto: 'Carlos Ruiz', email: 'colombia@bayer.com', telefono: '601-555-0303', productos: 12, deuda: 0 },
  { id: 4, nombre: 'Zoetis', contacto: 'María López', email: 'info@zoetis.com.co', telefono: '601-555-0404', productos: 7, deuda: 0 },
  { id: 5, nombre: 'Syngenta', contacto: 'Pedro Ramírez', email: 'ventas@syngenta.co', telefono: '601-555-0505', productos: 6, deuda: 280000 },
  { id: 6, nombre: 'Nutrición de Plantas', contacto: 'Laura Torres', email: 'info@nutridplantas.co', telefono: '602-555-0606', productos: 4, deuda: 0 },
];

export interface ProductoCotizacion {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  unidad: 'Unidades' | 'Bultos' | 'Kilos' | 'Litros' | 'Frascos';
}

export interface DetalleProductoRespuesta {
  productoId: number;
  precioUnitario: number;
  subtotal: number;
}

export interface RespuestaProveedor {
  proveedorId: number;
  estado: 'pendiente' | 'respondida';
  fecha: string | null;
  total: number | null;
  tiempoEntrega: string | null;
  calidad: number | null;
  observaciones: string | null;
  productosDetalle: DetalleProductoRespuesta[];
}

export interface Cotizacion {
  id: number;
  numero: string;
  fecha: string;
  fechaLimite: string;
  estado: 'borrador' | 'enviada' | 'respondida' | 'adjudicada' | 'cancelada';
  productos: ProductoCotizacion[];
  proveedores: number[];
  respuestas: RespuestaProveedor[];
  totalEstimado: number;
  adjudicadoA: number | null;
  observaciones?: string;
}

export const MOCK_COTIZACIONES: Cotizacion[] = [
  {
    id: 1,
    numero: 'COT-2026-001',
    fecha: '2026-02-05',
    fechaLimite: '2026-02-12',
    estado: 'respondida',
    productos: [
      { id: 1, nombre: 'Alimento para Gallinas Ponedoras', categoria: 'Concentrados', cantidad: 50, unidad: 'Bultos' },
      { id: 2, nombre: 'Vitaminas para Aves', categoria: 'Medicamentos', cantidad: 10, unidad: 'Frascos' }
    ],
    proveedores: [1, 3, 4],
    respuestas: [
      {
        proveedorId: 1,
        estado: 'respondida',
        fecha: '2026-02-07',
        total: 1245000,
        tiempoEntrega: '3-5 días',
        calidad: 4.8,
        observaciones: 'Productos de primera calidad',
        productosDetalle: [
          { productoId: 1, precioUnitario: 22000, subtotal: 1100000 },
          { productoId: 2, precioUnitario: 14500, subtotal: 145000 }
        ]
      },
      {
        proveedorId: 3,
        estado: 'respondida',
        fecha: '2026-02-08',
        total: 1320000,
        tiempoEntrega: '2-3 días',
        calidad: 4.5,
        observaciones: 'Entrega inmediata disponible',
        productosDetalle: [
          { productoId: 1, precioUnitario: 23500, subtotal: 1175000 },
          { productoId: 2, precioUnitario: 14500, subtotal: 145000 }
        ]
      },
      {
        proveedorId: 4,
        estado: 'pendiente',
        fecha: null,
        total: null,
        tiempoEntrega: null,
        calidad: null,
        observaciones: null,
        productosDetalle: []
      }
    ],
    totalEstimado: 1245000,
    adjudicadoA: null
  },
  {
    id: 2,
    numero: 'COT-2026-002',
    fecha: '2026-02-08',
    fechaLimite: '2026-02-15',
    estado: 'respondida',
    productos: [
      { id: 1, nombre: 'Dog Chow Adulto 21kg', categoria: 'Alimentos', cantidad: 30, unidad: 'Bultos' },
      { id: 2, nombre: 'Vacuna Triple Canina', categoria: 'Medicamentos', cantidad: 20, unidad: 'Frascos' },
      { id: 3, nombre: 'Antiparasitario Interno', categoria: 'Medicamentos', cantidad: 15, unidad: 'Frascos' }
    ],
    proveedores: [1, 2, 3],
    respuestas: [
      {
        proveedorId: 1,
        estado: 'respondida',
        fecha: '2026-02-10',
        total: 3825000,
        tiempoEntrega: '5-7 días',
        calidad: 4.7,
        observaciones: 'Excelente precio en alimentos',
        productosDetalle: [
          { productoId: 1, precioUnitario: 89000, subtotal: 2670000 },
          { productoId: 2, precioUnitario: 45000, subtotal: 900000 },
          { productoId: 3, precioUnitario: 17000, subtotal: 255000 }
        ]
      },
      {
        proveedorId: 2,
        estado: 'respondida',
        fecha: '2026-02-11',
        total: 3950000,
        tiempoEntrega: '3-5 días',
        calidad: 4.3,
        observaciones: 'Entrega rápida disponible',
        productosDetalle: [
          { productoId: 1, precioUnitario: 92000, subtotal: 2760000 },
          { productoId: 2, precioUnitario: 42000, subtotal: 840000 },
          { productoId: 3, precioUnitario: 23300, subtotal: 349500 }
        ]
      },
      {
        proveedorId: 3,
        estado: 'respondida',
        fecha: '2026-02-12',
        total: 4100000,
        tiempoEntrega: '4-6 días',
        calidad: 4.5,
        observaciones: 'Garantía extendida en medicamentos',
        productosDetalle: [
          { productoId: 1, precioUnitario: 95000, subtotal: 2850000 },
          { productoId: 2, precioUnitario: 48000, subtotal: 960000 },
          { productoId: 3, precioUnitario: 19333, subtotal: 290000 }
        ]
      }
    ],
    totalEstimado: 3825000,
    adjudicadoA: null
  },
  {
    id: 3,
    numero: 'COT-2026-003',
    fecha: '2026-02-10',
    fechaLimite: '2026-02-17',
    estado: 'borrador',
    productos: [],
    proveedores: [],
    respuestas: [],
    totalEstimado: 0,
    adjudicadoA: null
  }
];

export const MOCK_ALERTAS = [
  { producto: 'Dog Chow Adulto 21kg', stock: 3, minimo: 20, status: 'critical' as const },
  { producto: 'Ivermectina 50ml', stock: 5, minimo: 15, status: 'critical' as const },
  { producto: 'Collar Antipulgas Perro L', stock: 12, minimo: 15, status: 'low' as const },
  { producto: 'Fertilizante NPK 50kg', stock: 8, minimo: 10, status: 'low' as const },
];

export const MOCK_ACTIVIDAD = [
  { hora: '14:32', usuario: 'Manuela', accion: 'Registró entrada', producto: 'Dog Chow Adulto 21kg', tipo: 'entrada' as const },
  { hora: '13:15', usuario: 'Sebastián', accion: 'Registró salida', producto: 'Collar Antipulgas Perro L', tipo: 'salida' as const },
  { hora: '11:45', usuario: 'Manuela', accion: 'Editó producto', producto: 'Ivermectina 50ml', tipo: 'edicion' as const },
  { hora: '10:20', usuario: 'Carlos', accion: 'Registró entrada', producto: 'Concentrado Ganado 40kg', tipo: 'entrada' as const },
  { hora: '09:00', usuario: 'Manuela', accion: 'Creó producto', producto: 'Vitamina B12 Inyectable', tipo: 'edicion' as const },
];
