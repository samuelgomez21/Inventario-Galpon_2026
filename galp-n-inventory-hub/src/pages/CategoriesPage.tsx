import { CATEGORIAS } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import { ChevronRight } from 'lucide-react';

const catColors: Record<string, string> = {
  alimentos: 'bg-cat-alimentos',
  medicamentos: 'bg-cat-medicamentos',
  suplementos: 'bg-cat-suplementos',
  insumos: 'bg-cat-insumos',
  accesorios: 'bg-cat-accesorios',
};

const CategoriesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Categorías de Productos</h1>
        <p className="text-sm text-muted-foreground">Explora el inventario por categoría</p>
      </div>

      <div className="space-y-4">
        {Object.entries(CATEGORIAS).map(([key, cat]) => (
          <div key={key} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl ${catColors[key]} flex items-center justify-center text-2xl text-white shrink-0`}>
                {cat.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{cat.nombre}</h3>
                <p className="text-sm text-muted-foreground">{cat.descripcion}</p>
                <div className="flex items-center gap-6 mt-2">
                  <div>
                    <span className="text-lg font-bold text-foreground">{cat.productos}</span>
                    <span className="text-xs text-muted-foreground ml-1">Productos</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-foreground">{formatCurrency(cat.valor)}</span>
                    <span className="text-xs text-muted-foreground ml-1">Valor</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cat.subcategorias.slice(0, 4).map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">{s}</span>
                  ))}
                  {cat.subcategorias.length > 4 && (
                    <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">+{cat.subcategorias.length - 4}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
