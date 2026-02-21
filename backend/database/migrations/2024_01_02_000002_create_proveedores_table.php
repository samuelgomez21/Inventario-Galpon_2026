<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('proveedores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('email')->nullable();
            $table->string('telefono')->nullable();
            $table->string('direccion')->nullable();
            $table->string('ciudad')->nullable();
            $table->string('contacto_nombre')->nullable();
            $table->text('notas')->nullable();
            $table->decimal('deuda', 12, 2)->default(0);
            $table->decimal('calificacion', 3, 2)->default(5.00);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('pago_proveedores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proveedor_id')->constrained('proveedores')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users');
            $table->decimal('monto', 12, 2);
            $table->enum('metodo_pago', ['efectivo', 'transferencia', 'cheque', 'otro'])->default('efectivo');
            $table->string('referencia')->nullable();
            $table->text('notas')->nullable();
            $table->date('fecha_pago');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pago_proveedores');
        Schema::dropIfExists('proveedores');
    }
};

