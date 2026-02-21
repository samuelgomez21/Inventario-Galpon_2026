<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Subcategoria;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            [
                'nombre' => 'Alimentos para Mascotas',
                'slug' => 'alimentos',
                'icono' => 'fa-bone',
                'color' => '#3B82F6',
                'descripcion' => 'Alimentos y nutrición para todo tipo de mascotas',
                'subcategorias' => ['Perros', 'Gatos', 'Aves', 'Peces', 'Roedores', 'Equinos', 'Bovinos', 'Porcinos'],
            ],
            [
                'nombre' => 'Medicamentos Veterinarios',
                'slug' => 'medicamentos',
                'icono' => 'fa-pills',
                'color' => '#F59E0B',
                'descripcion' => 'Medicamentos y tratamientos veterinarios',
                'subcategorias' => ['Vacunas', 'Antiparasitarios', 'Antibióticos', 'Antiinflamatorios', 'Analgésicos', 'Dermatológicos'],
            ],
            [
                'nombre' => 'Suplementos Animales',
                'slug' => 'suplementos',
                'icono' => 'fa-capsules',
                'color' => '#EC4899',
                'descripcion' => 'Suplementos nutricionales y vitamínicos',
                'subcategorias' => ['Vitaminas', 'Minerales', 'Probióticos', 'Ácidos Grasos', 'Aminoácidos'],
            ],
            [
                'nombre' => 'Insumos Agrícolas',
                'slug' => 'insumos',
                'icono' => 'fa-tractor',
                'color' => '#10B981',
                'descripcion' => 'Productos para agricultura y cultivos',
                'subcategorias' => ['Fertilizantes', 'Semillas', 'Herbicidas', 'Insecticidas', 'Fungicidas', 'Herramientas'],
            ],
            [
                'nombre' => 'Accesorios para Mascotas',
                'slug' => 'accesorios',
                'icono' => 'fa-paw',
                'color' => '#8B5CF6',
                'descripcion' => 'Accesorios y productos para el cuidado de mascotas',
                'subcategorias' => ['Collares', 'Correas', 'Camas', 'Juguetes', 'Transportadoras', 'Comederos', 'Rascadores', 'Ropa'],
            ],
        ];

        foreach ($categorias as $catData) {
            $subcategorias = $catData['subcategorias'];
            unset($catData['subcategorias']);

            $categoria = Categoria::updateOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );

            foreach ($subcategorias as $subNombre) {
                Subcategoria::updateOrCreate(
                    [
                        'categoria_id' => $categoria->id,
                        'slug' => \Str::slug($subNombre),
                    ],
                    [
                        'nombre' => $subNombre,
                    ]
                );
            }
        }
    }
}

