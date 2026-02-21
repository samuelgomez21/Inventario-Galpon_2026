<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PagoProveedor extends Model
{
    use HasFactory;

    protected $table = 'pago_proveedores';

    protected $fillable = [
        'proveedor_id',
        'user_id',
        'monto',
        'metodo_pago',
        'referencia',
        'notas',
        'fecha_pago',
    ];

    protected function casts(): array
    {
        return [
            'monto' => 'decimal:2',
            'fecha_pago' => 'date',
        ];
    }

    /**
     * Relación con proveedor
     */
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class);
    }

    /**
     * Relación con usuario que registró el pago
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

