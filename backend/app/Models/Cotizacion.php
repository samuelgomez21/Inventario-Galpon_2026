<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cotizacion extends Model
{
    use HasFactory;

    protected $table = 'cotizaciones';

    protected $fillable = [
        'numero',
        'user_id',
        'titulo',
        'descripcion',
        'estado',
        'fecha',
        'fecha_limite',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'fecha_limite' => 'date',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($cotizacion) {
            if (empty($cotizacion->numero)) {
                $cotizacion->numero = self::generarNumero();
            }
        });
    }

    /**
     * Generar número de cotización automático
     */
    public static function generarNumero(): string
    {
        $año = now()->year;
        $ultimaCotizacion = self::whereYear('created_at', $año)
            ->orderBy('id', 'desc')
            ->first();

        $consecutivo = 1;
        if ($ultimaCotizacion) {
            $partes = explode('-', $ultimaCotizacion->numero);
            $consecutivo = (int)end($partes) + 1;
        }

        return sprintf('COT-%d-%03d', $año, $consecutivo);
    }

    /**
     * Relación con usuario creador
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con productos de la cotización
     */
    public function productos(): HasMany
    {
        return $this->hasMany(CotizacionProducto::class);
    }

    /**
     * Relación con proveedores de la cotización
     */
    public function proveedores(): HasMany
    {
        return $this->hasMany(CotizacionProveedor::class);
    }

    /**
     * Verificar si está próxima a vencer (2 días)
     */
    public function proximaAVencer(): bool
    {
        return now()->diffInDays($this->fecha_limite, false) <= 2 &&
               now()->diffInDays($this->fecha_limite, false) >= 0;
    }

    /**
     * Scope para cotizaciones activas
     */
    public function scopeActivas($query)
    {
        return $query->whereIn('estado', ['borrador', 'enviada', 'en_proceso']);
    }

    /**
     * Scope para cotizaciones próximas a vencer
     */
    public function scopeProximasAVencer($query)
    {
        return $query->whereIn('estado', ['enviada', 'en_proceso'])
                    ->whereDate('fecha_limite', '<=', now()->addDays(2))
                    ->whereDate('fecha_limite', '>=', now());
    }
}

