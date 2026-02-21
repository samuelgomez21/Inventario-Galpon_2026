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
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->foreignId('categoria_id')->constrained('categorias');
            $table->foreignId('subcategoria_id')->nullable()->constrained('subcategorias');
            $table->foreignId('proveedor_id')->nullable()->constrained('proveedores');
            $table->decimal('precio_compra', 12, 2);
            $table->decimal('precio_venta', 12, 2);
            $table->integer('stock')->default(0);
            $table->integer('stock_minimo')->default(5);
            $table->string('unidad_medida')->default('unidad');
            $table->string('ubicacion')->nullable();
            $table->string('marca')->nullable();
            $table->string('presentacion')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->string('lote')->nullable();
            $table->enum('estado_stock', ['normal', 'bajo', 'critico'])->default('normal');
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->index('codigo');
            $table->index('estado_stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};

