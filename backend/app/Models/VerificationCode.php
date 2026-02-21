<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationCode extends Model
{
    use HasFactory;

    protected $table = 'verification_codes';

    protected $fillable = [
        'email',
        'codigo',
        'expira_en',
        'usado',
    ];

    protected function casts(): array
    {
        return [
            'expira_en' => 'datetime',
            'usado' => 'boolean',
        ];
    }

    /**
     * Verificar si el código ha expirado
     */
    public function haExpirado(): bool
    {
        return now()->isAfter($this->expira_en);
    }

    /**
     * Verificar si el código es válido
     */
    public function esValido(): bool
    {
        return !$this->usado && !$this->haExpirado();
    }

    /**
     * Marcar el código como usado
     */
    public function marcarComoUsado(): void
    {
        $this->update(['usado' => true]);
    }

    /**
     * Scope para códigos válidos
     */
    public function scopeValidos($query, string $email, string $codigo)
    {
        return $query->where('email', $email)
                    ->where('codigo', $codigo)
                    ->where('usado', false)
                    ->where('expira_en', '>', now());
    }
}

