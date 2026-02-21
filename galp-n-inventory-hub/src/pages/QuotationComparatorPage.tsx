import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_COTIZACIONES, MOCK_PROVEEDORES } from '@/data/mockData';
import { formatCurrencyFull } from '@/utils/formatters';
import { ArrowLeft, Award, Check, Package, Star, Truck } from 'lucide-react';
import { toast } from 'sonner';

const QuotationComparatorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cotizacion = MOCK_COTIZACIONES.find(c => c.id === Number(id));

  if (!cotizacion) return <div className="p-6 text-foreground">Cotización no encontrada</div>;

  const getProveedor = (pid: number) => MOCK_PROVEEDORES.find(p => p.id === pid);
  const respondidas = cotizacion.respuestas.filter(r => r.estado === 'respondida');

  const calcScore = (r: typeof respondidas[0]) => {
    const maxPrecio = Math.max(...respondidas.map(x => x.total || 0));
    const precioScore = maxPrecio > 0 ? 100 - ((r.total || 0) / maxPrecio) * 40 : 60;
    const calidadScore = ((r.calidad || 0) / 5) * 40;
    return precioScore + calidadScore + 20;
  };

  const ranked = respondidas.map(r => ({
    ...r,
    prov: getProveedor(r.proveedorId),
    score: calcScore(r),
  })).sort((a, b) => b.score - a.score);

  const winner = ranked[0];
  if (!winner) return <div className="p-6 text-foreground">No hay respuestas para comparar</div>;

  const handleAdjudicar = () => {
    toast.success(`Cotización adjudicada a ${winner.prov?.nombre}`);
    setTimeout(() => navigate('/cotizaciones'), 1500);
  };

  const comparisonData = cotizacion.productos.map(prod => {
    const ofertas = respondidas.map(r => {
      const det = r.productosDetalle.find(d => d.productoId === prod.id);
      return { proveedorId: r.proveedorId, precioUnitario: det?.precioUnitario || 0, subtotal: det?.subtotal || 0 };
    }).filter(o => o.precioUnitario > 0).sort((a, b) => a.precioUnitario - b.precioUnitario);
    return { producto: prod, ofertas };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(`/cotizaciones/${cotizacion.id}`)} className="p-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-primary">Comparador Inteligente</h1>
      </div>

      {/* Winner Card */}
      <div className="bg-gradient-to-br from-warning/20 to-warning/5 border-2 border-warning rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-warning text-white text-sm font-semibold flex items-center gap-1">
            <Award className="w-4 h-4" /> MEJOR OPCIÓN RECOMENDADA
          </span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl">🏪</div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{winner.prov?.nombre}</h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1 text-warning"><Star className="w-4 h-4 fill-current" /> {winner.calidad}/5.0</span>
                <span className="flex items-center gap-1"><Package className="w-4 h-4" /> 234 pedidos</span>
                <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> {winner.tiempoEntrega}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Precio Total</p>
            <p className="text-3xl font-bold text-primary">{formatCurrencyFull(winner.total || 0)}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold text-foreground mb-3 flex items-center gap-1">❓ ¿Por qué esta opción?</p>
          <div className="space-y-3">
            {[
              { title: 'Mejor relación precio-calidad', desc: 'Precio competitivo con excelente historial de calidad de productos' },
              { title: 'Tiempo de entrega óptimo', desc: `Cumple con los plazos requeridos (${winner.tiempoEntrega} hábiles)` },
              { title: 'Proveedor confiable', desc: '98% de cumplimiento en entregas anteriores y productos de calidad' },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center flex-shrink-0 mt-0.5"><Check className="w-3 h-3" /></div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleAdjudicar} className="w-full py-3 rounded-xl bg-success text-white font-semibold text-sm hover:opacity-90 flex items-center justify-center gap-2">
          <Award className="w-4 h-4" /> Adjudicar Cotización a este Proveedor
        </button>
      </div>

      {/* Comparison Table */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">📊 Comparación Detallada por Producto</h2>
        <div className="bg-info/10 border border-info/20 rounded-lg p-3 mb-4 flex items-start gap-2">
          <span className="text-info">ℹ️</span>
          <p className="text-sm text-info"><span className="font-semibold">Análisis Producto por Producto:</span> Compare precios unitarios para cada producto y vea cuál proveedor le conviene más para cada categoría.</p>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Producto / Proveedor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Precio Unitario</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Subtotal</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Mejor Opción</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map(({ producto, ofertas }) => (
                <>
                  <tr key={`h-${producto.id}`} className="bg-primary text-primary-foreground">
                    <td colSpan={4} className="px-4 py-2.5 font-semibold">
                      📦 {producto.nombre} <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-white/20">{producto.cantidad} {producto.unidad} - {producto.categoria}</span>
                    </td>
                  </tr>
                  {ofertas.map((o, oi) => {
                    const prov = getProveedor(o.proveedorId);
                    const isBest = oi === 0;
                    const allSamePrice = ofertas.every(x => x.precioUnitario === ofertas[0].precioUnitario);
                    const showBest = isBest || allSamePrice;
                    return (
                      <tr key={`${producto.id}-${o.proveedorId}`} className={isBest ? 'bg-success/5' : ''}>
                        <td className={`px-4 py-2.5 ${isBest ? 'font-semibold text-primary' : 'text-foreground'}`}>
                          {isBest ? '🏆' : '🏪'} {prov?.nombre} {isBest && !allSamePrice && <span className="text-xs text-primary">Mejor Precio</span>}
                        </td>
                        <td className="px-4 py-2.5">{formatCurrencyFull(o.precioUnitario)}</td>
                        <td className="px-4 py-2.5">{formatCurrencyFull(o.subtotal)}</td>
                        <td className="px-4 py-2.5">
                          {showBest && <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 w-fit"><Check className="w-3 h-3" /> MEJOR PRECIO</span>}
                        </td>
                      </tr>
                    );
                  })}
                </>
              ))}

              <tr className="bg-warning/20">
                <td colSpan={4} className="px-4 py-2.5 font-bold text-foreground text-center uppercase">📧 Resumen Total por Proveedor</td>
              </tr>
              {ranked.map((r, i) => (
                <tr key={r.proveedorId} className={i === 0 ? 'bg-success/5' : ''}>
                  <td className={`px-4 py-2.5 ${i === 0 ? 'font-semibold text-primary' : 'text-foreground'}`}>
                    {i === 0 ? '🏆' : '🏪'} {r.prov?.nombre} {i === 0 && <span className="text-xs text-primary">Mejor Opción Global</span>}
                  </td>
                  <td className="px-4 py-2.5 font-medium">{formatCurrencyFull(r.total || 0)}</td>
                  <td colSpan={2} className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${r.score >= 85 ? 'bg-success/10 text-success' : r.score >= 70 ? 'bg-info/10 text-info' : 'bg-muted text-muted-foreground'}`}>
                      Score: {r.score.toFixed(1)}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other Offers Grid */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">📋 Ofertas Recibidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ranked.map((r, i) => (
            <div key={r.proveedorId} className={`bg-card rounded-xl border-2 p-4 ${i === 0 ? 'border-primary' : 'border-border'}`}>
              {i === 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium mb-2 inline-block">🏆 #{i + 1} MEJOR OPCIÓN</span>}
              {i > 0 && <span className="text-xs text-muted-foreground mb-2 inline-block">#{i + 1}</span>}
              <h3 className="font-semibold text-foreground">{r.prov?.nombre}</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div><span className="text-muted-foreground">Precio Total</span><p className="font-bold text-primary">{formatCurrencyFull(r.total || 0)}</p></div>
                <div><span className="text-muted-foreground">Calidad</span><p className="flex items-center gap-1 text-warning"><Star className="w-3.5 h-3.5 fill-current" /> {r.calidad}/5.0</p></div>
                <div><span className="text-muted-foreground">Tiempo Entrega</span><p className="flex items-center gap-1 text-foreground"><Truck className="w-3.5 h-3.5" /> {r.tiempoEntrega}</p></div>
                <div>
                  <span className="text-muted-foreground">Score Final</span>
                  <p><span className={`px-2 py-0.5 rounded text-xs font-semibold ${r.score >= 85 ? 'bg-success/10 text-success' : r.score >= 70 ? 'bg-info/10 text-info' : 'bg-muted text-muted-foreground'}`}>{r.score.toFixed(1)}/100</span></p>
                </div>
                {r.observaciones && <div><span className="text-muted-foreground">Observaciones:</span><p className="text-xs text-foreground">{r.observaciones}</p></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuotationComparatorPage;
