import { useState } from 'react';
import { CATEGORIAS } from '@/data/mockData';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const NewProductPage = () => {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState('');
  const [precioCompra, setPrecioCompra] = useState(0);
  const [precioVenta, setPrecioVenta] = useState(0);

  const margen = precioCompra > 0 ? (((precioVenta - precioCompra) / precioCompra) * 100).toFixed(1) : '0';
  const ganancia = precioVenta - precioCompra;
  const subcategorias = categoria ? CATEGORIAS[categoria as keyof typeof CATEGORIAS]?.subcategorias || [] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Producto guardado exitosamente');
    navigate('/productos');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-foreground">Agregar Nuevo Producto</h1>
      <p className="text-sm text-muted-foreground mb-6">Complete el formulario para registrar un nuevo producto</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Info Básica */}
        <section>
          <h2 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">📋 Información Básica</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Código del Producto *</label>
              <input placeholder="Ej: ALI-001" className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
              <p className="text-xs text-primary mt-1">Código único para identificar el producto</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nombre del Producto *</label>
              <input placeholder="Nombre completo del producto" className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Categoría *</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground" required>
                <option value="">Seleccionar categoría...</option>
                {Object.entries(CATEGORIAS).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Subcategoría</label>
              <select className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground" disabled={!categoria}>
                <option value="">Seleccionar subcategoría...</option>
                {subcategorias.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 mt-3 text-sm text-foreground">
            <input type="checkbox" className="rounded border-input" />
            <span><strong>Soportado por factura</strong> <span className="text-muted-foreground">Marcar si el producto puede incluirse en facturas</span></span>
          </label>
          <p className="text-xs text-primary mt-2">El stock inicial será 0. Para aumentar stock usa la opción "Registrar Ingreso" en el detalle del producto o en el listado.</p>
        </section>

        {/* Precios */}
        <section>
          <h2 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">💰 Inventario y Precios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Stock Mínimo</label>
              <input type="number" defaultValue={10} className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <p className="text-xs text-muted-foreground mt-1">Alerta cuando baje de este nivel</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Precio de Compra</label>
              <div className="flex">
                <span className="px-2 py-2 rounded-l-lg border border-r-0 border-input bg-muted text-sm text-muted-foreground">$</span>
                <input type="number" value={precioCompra} onChange={e => setPrecioCompra(+e.target.value)} className="flex-1 px-3 py-2 rounded-r-lg border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <p className="text-xs text-primary mt-1">Opcional: precio de referencia</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Precio de Venta *</label>
              <div className="flex">
                <span className="px-2 py-2 rounded-l-lg border border-r-0 border-input bg-muted text-sm text-muted-foreground">$</span>
                <input type="number" value={precioVenta} onChange={e => setPrecioVenta(+e.target.value)} className="flex-1 px-3 py-2 rounded-r-lg border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 rounded-lg bg-muted text-sm">
            📊 Margen de ganancia: <strong className="text-primary">{margen}%</strong> <span className="text-muted-foreground">(${ganancia.toLocaleString()} por unidad)</span>
          </div>
        </section>

        {/* Proveedor */}
        <section>
          <h2 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">🚚 Proveedor</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Proveedor</label>
              <select className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground">
                <option value="">Seleccionar proveedor...</option>
                <option>Purina Colombia</option><option>Mars Colombia</option><option>Bayer Animal Health</option>
                <option>Zoetis</option><option>Syngenta</option><option>Nutrición de Plantas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Ubicación en Bodega</label>
              <input placeholder="Ej: Estante A-3" className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </section>

        {/* Descripción */}
        <section>
          <h2 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">📝 Descripción</h2>
          <textarea placeholder="Descripción detallada del producto..." rows={4} className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
        </section>

        <div className="flex gap-3 justify-center">
          <button type="button" onClick={() => navigate('/productos')} className="px-5 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">✕ Cancelar</button>
          <button type="reset" className="px-5 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">🔄 Limpiar</button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">💾 Guardar Producto</button>
        </div>
      </form>
    </div>
  );
};

export default NewProductPage;
