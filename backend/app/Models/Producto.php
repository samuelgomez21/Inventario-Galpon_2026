<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'categoria_id',
        'subcategoria_id',
        'proveedor_id',
        'precio_compra',
        'precio_venta',
        'stock',
        'stock_minimo',
        'unidad_medida',
        'ubicacion',
        'marca',
        'presentacion',
        'fecha_vencimiento',
        'lote',
        'estado_stock',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'precio_compra' => 'decimal:2',
            'precio_venta' => 'decimal:2',
            'fecha_vencimiento' => 'date',
            'activo' => 'boolean',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($producto) {
            $producto->actualizarEstadoStock();
        });
    }

    /**
     * Relación con categoría
     */
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }

    /**
     * Relación con subcategoría
     */
    public function subcategoria(): BelongsTo
    {
        return $this->belongsTo(Subcategoria::class);
    }

    /**
     * Relación con proveedor
     */
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class);
    }

    /**
     * Relación con movimientos de inventario
     */
    public function movimientos(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class);
    }

    /**
     * Actualizar estado del stock basado en las reglas de negocio
     */
    public function actualizarEstadoStock(): void
    {
        if ($this->stock <= $this->stock_minimo * 0.3) {
            $this->estado_stock = 'critico';
        } elseif ($this->stock <= $this->stock_minimo) {
            $this->estado_stock = 'bajo';
        } else {
            $this->estado_stock = 'normal';
        }
    }

    /**
     * Calcular margen de ganancia
     */
    public function getMargenAttribute(): float
    {
        if ($this->precio_compra <= 0) {
            return 0;
        }
        return (($this->precio_venta - $this->precio_compra) / $this->precio_compra) * 100;
    }

    /**
     * Calcular valor en inventario
     */
    public function getValorInventarioAttribute(): float
    {
        return $this->stock * $this->precio_compra;
    }

    /**
     * Calcular valor potencial de venta
     */
    public function getValorVentaAttribute(): float
    {
        return $this->stock * $this->precio_venta;
    }

    /**
     * Scope para productos activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope para stock crítico
     */
    public function scopeStockCritico($query)
    {
        return $query->where('estado_stock', 'critico');
    }

    /**
     * Scope para stock bajo
     */
    public function scopeStockBajo($query)
    {
        return $query->whereIn('estado_stock', ['bajo', 'critico']);
    }

    /**
     * Scope para buscar por código o nombre
     */
    public function scopeBuscar($query, string $termino)
    {
        return $query->where(function ($q) use ($termino) {
            $q->where('codigo', 'like', "%{$termino}%")
              ->orWhere('nombre', 'like', "%{$termino}%");
        });
    }
}

