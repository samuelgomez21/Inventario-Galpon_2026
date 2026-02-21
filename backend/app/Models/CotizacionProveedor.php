<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CotizacionProveedor extends Model
{
    use HasFactory;

    protected $table = 'cotizacion_proveedores';

    protected $fillable = [
        'cotizacion_id',
        'proveedor_id',
        'estado',
        'fecha_envio',
        'fecha_respuesta',
        'notas',
        'token',
        'token_expira_en',
    ];

    protected function casts(): array
    {
        return [
            'fecha_envio' => 'datetime',
            'fecha_respuesta' => 'datetime',
            'token_expira_en' => 'datetime',
        ];
    }

    /**
     * Relación con cotización
     */
    public function cotizacion(): BelongsTo
    {
        return $this->belongsTo(Cotizacion::class);
    }

    /**
     * Relación con proveedor
     */
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class);
    }

    /**
     * Relación con respuestas
     */
    public function respuestas(): HasMany
    {
        return $this->hasMany(CotizacionRespuesta::class);
    }

    /**
     * Marcar como enviada
     */
    public function marcarComoEnviada(): void
    {
        $this->update([
            'estado' => 'enviada',
            'fecha_envio' => now(),
        ]);
    }

    /**
     * Marcar como respondida
     */
    public function marcarComoRespondida(): void
    {
        $this->update([
            'estado' => 'respondida',
            'fecha_respuesta' => now(),
        ]);
    }

    /**
     * Generar token único para que el proveedor responda
     */
    public function generarToken(): string
    {
        $token = bin2hex(random_bytes(32)); // Token de 64 caracteres

        $this->update([
            'token' => $token,
            'token_expira_en' => now()->addDays(30), // Válido por 30 días
        ]);

        return $token;
    }

    /**
     * Verificar si el token es válido
     */
    public function tokenEsValido(): bool
    {
        if (!$this->token || !$this->token_expira_en) {
            return false;
        }

        return $this->token_expira_en->isFuture();
    }

    /**
     * Obtener URL pública para que el proveedor responda
     */
    public function getUrlRespuestaPublica(): string
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
        return "{$frontendUrl}/cotizacion-proveedor/{$this->token}";
    }
}

