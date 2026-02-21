import { MOCK_PRODUCTOS, CATEGORIAS } from '@/data/mockData';
import { getStockStatus, formatCurrencyFull } from '@/utils/formatters';
import { Download, XCircle, AlertTriangle, DollarSign } from 'lucide-react';

const lowStockProducts = MOCK_PRODUCTOS.filter(p => {
  const s = getStockStatus(p.stock, p.stockMin);
  return s.status !== 'normal';
}).map(p => ({
  ...p,
  ...getStockStatus(p.stock, p.stockMin),
  faltante: p.stockMin - p.stock,
  costoReposicion: (p.stockMin - p.stock) * p.precioCompra,
}));

const critical = lowStockProducts.filter(p => p.status === 'critical').length;
const low = lowStockProducts.filter(p => p.status === 'low').length;
const totalInversion = lowStockProducts.reduce((s, p) => s + p.costoReposicion, 0);

const LowStockPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Productos con Stock Bajo</h1>
          <p className="text-sm text-muted-foreground">Productos que necesitan reabastecimiento</p>
        </div>
        <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground flex items-center gap-1.5 hover:bg-muted">
          <Download className="w-4 h-4" /> Exportar Lista
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 border-2 border-destructive/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center"><XCircle className="w-5 h-5 text-destructive" /></div>
            <div><p className="text-2xl font-bold text-foreground">{critical}</p><p className="text-xs text-muted-foreground">Stock Crítico</p></div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 border-2 border-warning/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-warning" /></div>
            <div><p className="text-2xl font-bold text-foreground">{low}</p><p className="text-xs text-muted-foreground">Stock Bajo</p></div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 border-2 border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><DollarSign className="w-5 h-5 text-foreground" /></div>
            <div><p className="text-2xl font-bold text-foreground">{formatCurrencyFull(totalInversion)}</p><p className="text-xs text-muted-foreground">Inversión Requerida</p></div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Estado</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Producto</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Categoría</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Stock Actual</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Stock Mínimo</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Faltante</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Costo Reposición</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Acción</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map(p => (
              <tr key={p.codigo} className={`border-b border-border last:border-0 ${p.status === 'critical' ? 'bg-destructive/5' : 'bg-warning/5'}`}>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'critical' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'critical' ? 'bg-destructive' : 'bg-warning'}`} />
                    {p.label}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{p.nombre}</td>
                <td className="px-4 py-3 text-muted-foreground">{CATEGORIAS[p.categoria as keyof typeof CATEGORIAS]?.nombre}</td>
                <td className="px-4 py-3 text-center"><span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${p.status === 'critical' ? 'text-destructive' : 'text-warning'}`}>{p.stock}</span></td>
                <td className="px-4 py-3 text-center text-muted-foreground">{p.stockMin}</td>
                <td className="px-4 py-3 text-center text-foreground font-medium">{p.faltante}</td>
                <td className="px-4 py-3 text-right text-foreground">{formatCurrencyFull(p.costoReposicion)}</td>
                <td className="px-4 py-3 text-center">
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">Pedir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockPage;
