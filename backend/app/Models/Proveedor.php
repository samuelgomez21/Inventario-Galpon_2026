<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proveedor extends Model
{
    use HasFactory;

    protected $table = 'proveedores';

    protected $fillable = [
        'nombre',
        'email',
        'telefono',
        'direccion',
        'ciudad',
        'contacto_nombre',
        'notas',
        'deuda',
        'calificacion',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'deuda' => 'decimal:2',
            'calificacion' => 'decimal:2',
            'activo' => 'boolean',
        ];
    }

    /**
     * Relación con productos
     */
    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class);
    }

    /**
     * Relación con pagos
     */
    public function pagos(): HasMany
    {
        return $this->hasMany(PagoProveedor::class);
    }

    /**
     * Relación con movimientos de inventario
     */
    public function movimientos(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class);
    }

    /**
     * Relación con cotizaciones
     */
    public function cotizacionProveedores(): HasMany
    {
        return $this->hasMany(CotizacionProveedor::class);
    }

    /**
     * Incrementar deuda
     */
    public function incrementarDeuda(float $monto): void
    {
        $this->increment('deuda', $monto);
    }

    /**
     * Decrementar deuda (pago)
     */
    public function decrementarDeuda(float $monto): void
    {
        $this->decrement('deuda', $monto);
    }

    /**
     * Scope para proveedores activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope para proveedores con deuda
     */
    public function scopeConDeuda($query)
    {
        return $query->where('deuda', '>', 0);
    }
}

