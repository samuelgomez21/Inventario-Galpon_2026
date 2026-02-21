<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogActividad extends Model
{
    use HasFactory;

    protected $table = 'logs_actividad';

    protected $fillable = [
        'user_id',
        'accion',
        'modelo',
        'modelo_id',
        'datos_anteriores',
        'datos_nuevos',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'datos_anteriores' => 'array',
            'datos_nuevos' => 'array',
        ];
    }

    /**
     * Relación con usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Registrar una actividad
     */
    public static function registrar(
        string $accion,
        ?int $userId = null,
        ?string $modelo = null,
        ?int $modeloId = null,
        ?array $datosAnteriores = null,
        ?array $datosNuevos = null
    ): self {
        return self::create([
            'user_id' => $userId ?? auth()->id(),
            'accion' => $accion,
            'modelo' => $modelo,
            'modelo_id' => $modeloId,
            'datos_anteriores' => $datosAnteriores,
            'datos_nuevos' => $datosNuevos,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Scope por acción
     */
    public function scopePorAccion($query, string $accion)
    {
        return $query->where('accion', $accion);
    }

    /**
     * Scope por modelo
     */
    public function scopePorModelo($query, string $modelo)
    {
        return $query->where('modelo', $modelo);
    }
}

