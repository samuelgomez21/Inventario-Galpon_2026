<?php

namespace Database\Seeders;

use App\Models\Proveedor;
use Illuminate\Database\Seeder;

class ProveedorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $proveedores = [
            [
                'nombre' => 'Purina Colombia',
                'email' => 'ventas@purina.com.co',
                'telefono' => '+57 310 123 4567',
                'direccion' => 'Zona Industrial',
                'ciudad' => 'Bogotá',
                'contacto_nombre' => 'Juan Pérez',
                'deuda' => 0,
                'calificacion' => 4.8,
            ],
            [
                'nombre' => 'Mars Colombia',
                'email' => 'pedidos@mars.com.co',
                'telefono' => '+57 315 987 6543',
                'direccion' => 'Centro Empresarial',
                'ciudad' => 'Medellín',
                'contacto_nombre' => 'María García',
                'deuda' => 450000,
                'calificacion' => 4.5,
            ],
            [
                'nombre' => 'Bayer Animal Health',
                'email' => 'colombia@bayer.com',
                'telefono' => '+57 320 456 7890',
                'direccion' => 'Parque Industrial',
                'ciudad' => 'Cali',
                'contacto_nombre' => 'Carlos López',
                'deuda' => 0,
                'calificacion' => 4.9,
            ],
            [
                'nombre' => 'Zoetis',
                'email' => 'info@zoetis.com.co',
                'telefono' => '+57 318 222 3333',
                'direccion' => 'Torre Empresarial',
                'ciudad' => 'Bogotá',
                'contacto_nombre' => 'Ana Martínez',
                'deuda' => 0,
                'calificacion' => 4.7,
            ],
            [
                'nombre' => 'Italcol',
                'email' => 'ventas@italcol.com',
                'telefono' => '+57 312 555 6666',
                'direccion' => 'Zona Franca',
                'ciudad' => 'Barranquilla',
                'contacto_nombre' => 'Pedro Sánchez',
                'deuda' => 280000,
                'calificacion' => 4.3,
            ],
            [
                'nombre' => 'Syngenta',
                'email' => 'agro@syngenta.com',
                'telefono' => '+57 314 777 8888',
                'direccion' => 'Edificio Corporativo',
                'ciudad' => 'Bogotá',
                'contacto_nombre' => 'Luis Rodríguez',
                'deuda' => 0,
                'calificacion' => 4.6,
            ],
        ];

        foreach ($proveedores as $proveedor) {
            Proveedor::updateOrCreate(
                ['email' => $proveedor['email']],
                $proveedor
            );
        }
    }
}

