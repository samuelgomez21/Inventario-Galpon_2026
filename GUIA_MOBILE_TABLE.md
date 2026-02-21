# 📱 Guía de Implementación - Mejorar Responsive en Tablas

## 🎯 Objetivo

Mejorar la experiencia móvil de las tablas reemplazándolas con **cards apilables** en pantallas pequeñas.

---

## ✅ Componente Creado

He creado el componente **`MobileTable`** en:
```
galp-n-inventory-hub/src/components/ui/mobile-table.tsx
```

Este componente convierte automáticamente datos tabulares en cards para móvil.

---

## 🔧 Cómo Usar

### **Paso 1: Importar el componente**

```tsx
import MobileTable from '@/components/ui/mobile-table';
```

### **Paso 2: Implementar vista dual (Desktop + Mobile)**

**ANTES (solo tabla):**
```tsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</div>
```

**DESPUÉS (tabla + cards):**
```tsx
<div>
  {/* Desktop: Tabla normal */}
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full">
      <thead>...</thead>
      <tbody>...</tbody>
    </table>
  </div>

  {/* Mobile: Cards */}
  <MobileTable
    data={filteredProducts}
    keyExtractor={(p) => p.id.toString()}
    columns={[
      { key: 'nombre', label: 'Producto', render: (p) => (
        <span className="font-medium">{p.nombre}</span>
      )},
      { key: 'stock', label: 'Stock', render: (p) => (
        <span className={getStockClass(p.stock)}>{p.stock}</span>
      )},
      { key: 'precio', label: 'Precio', render: (p) => formatCurrency(p.precio) },
    ]}
    onItemClick={(p) => navigate(`/productos/${p.id}`)}
  />
</div>
```

---

## 📝 Ejemplo Completo - ProductsPage

```tsx
import MobileTable from '@/components/ui/mobile-table';
import { formatCurrencyFull } from '@/utils/formatters';

const ProductsPage = () => {
  const filtered = /* ... tus productos filtrados ... */;

  return (
    <div className="space-y-6">
      {/* ... Filters ... */}

      {/* Desktop: Tabla */}
      <div className="hidden md:block bg-card rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3">Código</th>
              <th className="text-left px-4 py-3">Producto</th>
              <th className="text-left px-4 py-3">Categoría</th>
              <th className="text-center px-4 py-3">Stock</th>
              <th className="text-right px-4 py-3">Precio</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.codigo} className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-3 font-mono text-xs">{p.codigo}</td>
                <td className="px-4 py-3 font-medium">{p.nombre}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.categoria}</td>
                <td className="px-4 py-3 text-center">{p.stock}</td>
                <td className="px-4 py-3 text-right">{formatCurrencyFull(p.precioVenta)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Cards */}
      <MobileTable
        data={filtered}
        keyExtractor={(p) => p.codigo}
        columns={[
          {
            key: 'nombre',
            label: 'Producto',
            render: (p) => (
              <div className="flex items-center gap-2">
                <span>{getCategoryEmoji(p.categoria)}</span>
                <span className="font-medium">{p.nombre}</span>
              </div>
            )
          },
          {
            key: 'codigo',
            label: 'Código',
            render: (p) => <code className="text-xs">{p.codigo}</code>
          },
          {
            key: 'stock',
            label: 'Stock',
            render: (p) => {
              const status = getStockStatus(p.stock, p.stockMin);
              return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  status === 'critical' ? 'bg-destructive/10 text-destructive' :
                  status === 'low' ? 'bg-warning/10 text-warning' :
                  'bg-success/10 text-success'
                }`}>
                  {p.stock}
                </span>
              );
            }
          },
          {
            key: 'precio',
            label: 'Precio Venta',
            render: (p) => (
              <span className="font-semibold">{formatCurrencyFull(p.precioVenta)}</span>
            )
          }
        ]}
        onItemClick={(p) => {
          // Navegar a detalles o mostrar modal
          console.log('Ver producto:', p);
        }}
        emptyMessage="No se encontraron productos"
      />
    </div>
  );
};
```

---

## 🎨 Características del Componente

### **Props del MobileTable:**

```typescript
interface MobileTableProps<T> {
  // Datos a mostrar
  data: T[];
  
  // Definición de columnas
  columns: Array<{
    key: string;           // Identificador único
    label: string;         // Etiqueta a mostrar
    render: (item: T) => ReactNode;  // Cómo renderizar el valor
    className?: string;    // Clases CSS adicionales
  }>;
  
  // Función para obtener key única de cada item
  keyExtractor: (item: T) => string | number;
  
  // Función opcional al hacer clic en un item
  onItemClick?: (item: T) => void;
  
  // Mensaje cuando no hay datos
  emptyMessage?: string;
}
```

### **Ventajas:**

✅ **Responsivo:** Solo se muestra en móvil (`md:hidden`)  
✅ **Touch-friendly:** Área de toque grande (toda la card)  
✅ **Flexible:** Puedes renderizar cualquier contenido  
✅ **Hover effects:** Feedback visual al tocar  
✅ **TypeScript:** Tipado completo  

---

## 📋 Páginas a Actualizar

### **Prioridad Alta 🔴**

1. **ProductsPage.tsx**
   - Tabla con 8 columnas
   - Muchos datos por fila
   - **Impacto:** Alto

2. **QuotationsPage.tsx**
   - Tabla con 6 columnas
   - Información importante
   - **Impacto:** Medio-Alto

### **Prioridad Media 🟡**

3. **LowStockPage.tsx**
   - Tabla de productos
   - Similar a ProductsPage
   - **Impacto:** Medio

4. **SuppliersPage.tsx**
   - Ya usa cards ✅
   - Solo necesita validación
   - **Impacto:** Bajo

### **Prioridad Baja 🟢**

5. **QuotationDetailPage.tsx**
   - Tablas internas en tabs
   - Menos crítico
   - **Impacto:** Bajo

---

## 🧪 Testing

### **Breakpoints a Probar:**

```
< 640px (sm)  → Móvil pequeño (iPhone SE)
640px - 768px → Móvil grande
768px - 1024px → Tablet
> 1024px      → Desktop
```

### **Comandos DevTools:**

```
F12 → Ctrl+Shift+M (Toggle device toolbar)

Probar en:
- iPhone SE (375px) ✓
- iPhone 12 (390px) ✓
- Samsung Galaxy (360px) ✓
- iPad (768px) ✓
- iPad Pro (1024px) ✓
```

---

## 🎯 Checklist de Implementación

### **Para cada página con tabla:**

- [ ] Importar `MobileTable`
- [ ] Envolver tabla existente en `<div className="hidden md:block">`
- [ ] Agregar `<MobileTable>` debajo de la tabla
- [ ] Definir columnas con `render` functions
- [ ] Probar en DevTools con diferentes tamaños
- [ ] Verificar touch targets (mínimo 44x44px)
- [ ] Probar scroll y navegación

---

## 🚀 Implementación Rápida

### **Paso 1: ProductsPage (30 min)**

```bash
# Editar archivo
code galp-n-inventory-hub/src/pages/ProductsPage.tsx
```

1. Importar `MobileTable`
2. Duplicar sección de tabla
3. Agregar `hidden md:block` a la tabla
4. Agregar `<MobileTable>` con las columnas
5. Probar en navegador

### **Paso 2: QuotationsPage (20 min)**

```bash
code galp-n-inventory-hub/src/pages/QuotationsPage.tsx
```

Aplicar el mismo patrón.

### **Paso 3: Testing (10 min)**

```bash
# Iniciar servidor si no está corriendo
cd galp-n-inventory-hub
npm run dev

# Abrir navegador en modo responsive
# F12 → Ctrl+Shift+M
# Probar: 375px, 768px, 1024px
```

---

## 💡 Tips y Mejores Prácticas

### **1. Mantener Consistencia**

Usar el mismo orden de información en mobile y desktop:
```tsx
// Desktop
Código | Nombre | Stock | Precio

// Mobile (mismo orden)
Código
Nombre
Stock
Precio
```

### **2. Información Crítica Primero**

En mobile, mostrar primero la info más importante:
```tsx
columns={[
  { label: 'Producto', ... },     // ← Más importante
  { label: 'Stock', ... },        // ← Importante
  { label: 'Precio', ... },       // ← Importante
  { label: 'Categoría', ... },    // ← Menos importante
]}
```

### **3. Usar Iconos y Emojis**

Los iconos ayudan a identificar rápido:
```tsx
render: (p) => (
  <div className="flex items-center gap-2">
    <Package className="w-4 h-4" />
    <span>{p.stock}</span>
  </div>
)
```

### **4. Formatear Números**

Usar formatters para mejor legibilidad:
```tsx
render: (p) => formatCurrencyFull(p.precio)
```

### **5. Estados Visuales**

Usar badges para estados:
```tsx
render: (p) => (
  <span className={`badge ${getStatusClass(p.status)}`}>
    {p.status}
  </span>
)
```

---

## 📊 Antes vs Después

### **ANTES (Solo Tabla)**
```
Mobile:
┌─────────────────────────────────┐
│ ←→ scroll horizontal muy largo  │
│ [col1][col2][col3][col4][col5]  │
│ [....][....][....][....][....]  │
└─────────────────────────────────┘
❌ Difícil de leer
❌ Scroll incómodo
❌ Touch targets pequeños
```

### **DESPUÉS (Cards Responsive)**
```
Mobile:
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │ Producto: Alimento Dog Chow │ │
│ │ Stock: 45 ✅                 │ │
│ │ Precio: $45,000             │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Producto: Vacuna Triple     │ │
│ │ Stock: 12 ⚠️                │ │
│ │ Precio: $28,000             │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
✅ Fácil de leer
✅ Sin scroll horizontal
✅ Touch targets grandes
```

---

## ✅ Resultado Esperado

Después de implementar `MobileTable` en las páginas principales:

**Puntuación Responsive:**
- Actual: **70%** 🟡
- Objetivo: **95%** 🟢

**Experiencia Móvil:**
- Actual: **Funcional pero incómodo** 😐
- Objetivo: **Excelente experiencia nativa** 😊📱

---

## 📞 Soporte

Si tienes dudas o encuentras problemas:

1. Ver ejemplos en el código creado
2. Revisar documentación de Tailwind CSS breakpoints
3. Usar Chrome DevTools para debugging
4. Probar en dispositivos reales si es posible

---

**¡Con este componente, mejorarás significativamente la experiencia móvil de la aplicación!** 📱✨

