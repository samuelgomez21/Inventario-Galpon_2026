import { CATEGORIAS } from '@/data/mockData';
import { formatCurrencyFull, formatCurrency } from '@/utils/formatters';
import { Wallet, ShoppingCart, TrendingUp, Package } from 'lucide-react';

const catEntries = Object.entries(CATEGORIAS);
const totalValor = catEntries.reduce((s, [, c]) => s + c.valor, 0);

const catBarColors: Record<string, string> = {
  alimentos: 'bg-cat-alimentos',
  medicamentos: 'bg-cat-medicamentos',
  suplementos: 'bg-cat-suplementos',
  insumos: 'bg-cat-insumos',
  accesorios: 'bg-cat-accesorios',
};

const BudgetPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Presupuesto del Inventario</h1>
        <p className="text-sm text-muted-foreground">Análisis financiero del inventario actual</p>
      </div>

      {/* Main value card */}
      <div className="bg-primary rounded-xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-primary-foreground/80 text-sm">Valor Total del Inventario</p>
            <p className="text-3xl font-bold text-primary-foreground">$48,500,000</p>
            <p className="text-primary-foreground/60 text-xs">COP - Pesos Colombianos</p>
          </div>
        </div>
        <div className="flex gap-3">
          {[
            { icon: ShoppingCart, label: 'Costo de Adquisición', value: '$40,200,000' },
            { icon: TrendingUp, label: 'Ganancia Potencial (20.6%)', value: '$8,300,000' },
            { icon: Package, label: 'Total de Productos', value: '1,247' },
          ].map(m => (
            <div key={m.label} className="px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <m.icon className="w-4 h-4 text-primary-foreground/70" />
                <p className="text-lg font-bold text-primary-foreground">{m.value}</p>
              </div>
              <p className="text-xs text-primary-foreground/60">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Valor por Categoría */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">📊 Valor por Categoría</h3>
          <div className="space-y-5">
            {catEntries.map(([key, cat]) => {
              const pct = Math.round((cat.valor / totalValor) * 100);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-foreground">{cat.emoji} {cat.nombre}</span>
                    <span className="font-medium text-foreground">{formatCurrencyFull(cat.valor)}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${catBarColors[key]}`} style={{ width: `${pct}%` }}>
                      <span className="text-[10px] font-bold text-white pl-2">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">ℹ️ Resumen Financiero</h3>
          <div className="space-y-4">
            {[
              { label: 'Productos in stock normal', value: '1,235' },
              { label: 'Productos con bajo stock', value: '12', highlight: true },
              { label: 'Margen promedio de ganancia', value: '20.6%', green: true },
              { label: 'Producto más valioso', value: 'Concentrado Ganado 40kg', bold: true },
              { label: 'Categoría más rentable', value: 'Medicamentos (24.5%)', green: true },
              { label: 'Inversión para reabastecer', value: '$2,170,000', green: true },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0">
                <span className="text-muted-foreground">{item.label}</span>
                <span className={`font-medium ${item.highlight ? 'text-destructive' : item.green ? 'text-primary' : item.bold ? 'text-foreground font-semibold' : 'text-foreground'}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
