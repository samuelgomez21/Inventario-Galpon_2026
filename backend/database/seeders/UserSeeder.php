<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $usuarios = [
            [
                'nombre' => 'Manuela Gómez',
                'email' => 'manuela.gomez@elgalpon-alcala.com',
                'rol' => 'admin',
                'activo' => true,
            ],
            [
                'nombre' => 'Carlos Manuel Gómez',
                'email' => 'carlos.gomez@elgalpon-alcala.com',
                'rol' => 'admin',
                'activo' => true,
            ],
            [
                'nombre' => 'Sebastián Rodríguez',
                'email' => 'sebastian.rodriguez@elgalpon-alcala.com',
                'rol' => 'empleado',
                'activo' => true,
            ],
            [
                'nombre' => 'MJ Muñoz',
                'email' => 'mjmunoz_108@cue.edu.co',
                'rol' => 'admin',
                'activo' => true,
            ],
            [
                'nombre' => 'S Gómez',
                'email' => 'sgomez_21@cue.edu.co',
                'rol' => 'admin',
                'activo' => true,
            ],
        ];

        foreach ($usuarios as $usuario) {
            // Usar firstOrCreate en lugar de updateOrCreate
            // Esto solo crea el usuario si NO existe, pero NO lo actualiza si fue eliminado
            User::firstOrCreate(
                ['email' => $usuario['email']],
                $usuario
            );
        }
    }
}

