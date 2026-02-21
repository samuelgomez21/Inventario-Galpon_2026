<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CotizacionProducto extends Model
{
    use HasFactory;

    protected $table = 'cotizacion_productos';

    protected $fillable = [
        'cotizacion_id',
        'producto_id',
        'nombre_producto',
        'cantidad',
        'especificaciones',
    ];

    /**
     * Relación con cotización
     */
    public function cotizacion(): BelongsTo
    {
        return $this->belongsTo(Cotizacion::class);
    }

    /**
     * Relación con producto (opcional)
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    /**
     * Relación con respuestas
     */
    public function respuestas(): HasMany
    {
        return $this->hasMany(CotizacionRespuesta::class);
    }
}

