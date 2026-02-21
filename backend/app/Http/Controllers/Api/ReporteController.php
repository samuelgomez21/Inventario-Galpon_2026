<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Proveedor;
use App\Models\MovimientoInventario;
use App\Models\Cotizacion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    /**
     * Dashboard - Resumen general
     */
    public function dashboard(): JsonResponse
    {
        // Valor del inventario
        $productos = Producto::activos()->get();
        $valorInventario = $productos->sum(fn($p) => $p->stock * $p->precio_compra);
        $valorVenta = $productos->sum(fn($p) => $p->stock * $p->precio_venta);
        $gananciaPotencial = $valorVenta - $valorInventario;
        $margenPromedio = $valorInventario > 0 ? ($gananciaPotencial / $valorInventario) * 100 : 0;

        // Stock
        $stockCritico = Producto::activos()->where('estado_stock', 'critico')->count();
        $stockBajo = Producto::activos()->where('estado_stock', 'bajo')->count();
        $totalProductos = $productos->count();

        // Proveedores
        $totalProveedores = Proveedor::activos()->count();
        $proveedoresConDeuda = Proveedor::activos()->conDeuda()->count();
        $totalDeuda = Proveedor::activos()->sum('deuda');

        // Movimientos del día
        $movimientosHoy = MovimientoInventario::hoy()->count();
        $entradasHoy = MovimientoInventario::hoy()->entradas()->sum('cantidad');
        $salidasHoy = MovimientoInventario::hoy()->salidas()->sum('cantidad');

        // Cotizaciones activas
        $cotizacionesActivas = Cotizacion::activas()->count();
        $cotizacionesPendientes = Cotizacion::where('estado', 'enviada')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'inventario' => [
                    'total_productos' => $totalProductos,
                    'valor_inventario' => round($valorInventario, 2),
                    'valor_potencial_venta' => round($valorVenta, 2),
                    'ganancia_potencial' => round($gananciaPotencial, 2),
                    'margen_promedio' => round($margenPromedio, 2),
                    'stock_critico' => $stockCritico,
                    'stock_bajo' => $stockBajo,
                ],
                'proveedores' => [
                    'total' => $totalProveedores,
                    'con_deuda' => $proveedoresConDeuda,
                    'total_deuda' => round($totalDeuda, 2),
                ],
                'movimientos_hoy' => [
                    'total' => $movimientosHoy,
                    'entradas' => $entradasHoy,
                    'salidas' => $salidasHoy,
                ],
                'cotizaciones' => [
                    'activas' => $cotizacionesActivas,
                    'pendientes_respuesta' => $cotizacionesPendientes,
                ],
            ],
        ]);
    }

    /**
     * Reporte de inventario valorizado
     */
    public function inventarioValorizado(Request $request): JsonResponse
    {
        $query = Producto::with(['categoria', 'subcategoria', 'proveedor'])
            ->activos();

        if ($request->has('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }

        $productos = $query->orderBy('nombre')->get();

        $resumen = [
            'total_productos' => $productos->count(),
            'total_unidades' => $productos->sum('stock'),
            'valor_compra' => $productos->sum(fn($p) => $p->stock * $p->precio_compra),
            'valor_venta' => $productos->sum(fn($p) => $p->stock * $p->precio_venta),
        ];

        $resumen['ganancia_potencial'] = $resumen['valor_venta'] - $resumen['valor_compra'];
        $resumen['margen_promedio'] = $resumen['valor_compra'] > 0
            ? ($resumen['ganancia_potencial'] / $resumen['valor_compra']) * 100
            : 0;

        $detalle = $productos->map(function ($p) {
            return [
                'id' => $p->id,
                'codigo' => $p->codigo,
                'nombre' => $p->nombre,
                'categoria' => $p->categoria->nombre,
                'subcategoria' => $p->subcategoria?->nombre,
                'proveedor' => $p->proveedor?->nombre,
                'stock' => $p->stock,
                'stock_minimo' => $p->stock_minimo,
                'estado_stock' => $p->estado_stock,
                'precio_compra' => $p->precio_compra,
                'precio_venta' => $p->precio_venta,
                'valor_inventario' => round($p->stock * $p->precio_compra, 2),
                'valor_venta' => round($p->stock * $p->precio_venta, 2),
                'margen' => round($p->margen, 2),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'resumen' => $resumen,
                'detalle' => $detalle,
            ],
        ]);
    }

    /**
     * Reporte de movimientos de inventario
     */
    public function movimientos(Request $request): JsonResponse
    {
        $request->validate([
            'fecha_desde' => 'required|date',
            'fecha_hasta' => 'required|date|after_or_equal:fecha_desde',
        ]);

        $query = MovimientoInventario::with(['producto', 'user', 'proveedor'])
            ->whereDate('created_at', '>=', $request->fecha_desde)
            ->whereDate('created_at', '<=', $request->fecha_hasta);

        if ($request->has('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->has('producto_id')) {
            $query->where('producto_id', $request->producto_id);
        }

        $movimientos = $query->orderBy('created_at', 'desc')->get();

        // Resumen
        $entradas = $movimientos->where('tipo', 'entrada');
        $salidas = $movimientos->where('tipo', 'salida');
        $ajustes = $movimientos->where('tipo', 'ajuste');

        $resumen = [
            'total_movimientos' => $movimientos->count(),
            'entradas' => [
                'cantidad' => $entradas->count(),
                'unidades' => $entradas->sum('cantidad'),
                'valor' => $entradas->sum(fn($m) => $m->cantidad * ($m->precio_compra ?? 0)),
            ],
            'salidas' => [
                'cantidad' => $salidas->count(),
                'unidades' => $salidas->sum('cantidad'),
            ],
            'ajustes' => [
                'cantidad' => $ajustes->count(),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'periodo' => [
                    'desde' => $request->fecha_desde,
                    'hasta' => $request->fecha_hasta,
                ],
                'resumen' => $resumen,
                'movimientos' => $movimientos,
            ],
        ]);
    }

    /**
     * Reporte de productos por categoría
     */
    public function productosPorCategoria(): JsonResponse
    {
        $categorias = DB::table('productos')
            ->join('categorias', 'productos.categoria_id', '=', 'categorias.id')
            ->where('productos.activo', true)
            ->select(
                'categorias.id',
                'categorias.nombre',
                'categorias.color',
                DB::raw('COUNT(*) as total_productos'),
                DB::raw('SUM(productos.stock) as total_stock'),
                DB::raw('SUM(productos.stock * productos.precio_compra) as valor_inventario'),
                DB::raw('SUM(productos.stock * productos.precio_venta) as valor_venta')
            )
            ->groupBy('categorias.id', 'categorias.nombre', 'categorias.color')
            ->orderBy('valor_inventario', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categorias,
        ]);
    }

    /**
     * Reporte de productos más vendidos (por salidas)
     */
    public function productosMasMovidos(Request $request): JsonResponse
    {
        $dias = $request->get('dias', 30);
        $limite = $request->get('limite', 10);

        $productos = DB::table('movimientos_inventario')
            ->join('productos', 'movimientos_inventario.producto_id', '=', 'productos.id')
            ->where('movimientos_inventario.tipo', 'salida')
            ->where('movimientos_inventario.created_at', '>=', now()->subDays($dias))
            ->select(
                'productos.id',
                'productos.codigo',
                'productos.nombre',
                DB::raw('SUM(movimientos_inventario.cantidad) as total_salidas'),
                DB::raw('COUNT(*) as numero_movimientos')
            )
            ->groupBy('productos.id', 'productos.codigo', 'productos.nombre')
            ->orderBy('total_salidas', 'desc')
            ->limit($limite)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'periodo_dias' => $dias,
                'productos' => $productos,
            ],
        ]);
    }

    /**
     * Reporte de deudas a proveedores
     */
    public function deudasProveedores(): JsonResponse
    {
        $proveedores = Proveedor::activos()
            ->conDeuda()
            ->with(['pagos' => function ($q) {
                $q->orderBy('fecha_pago', 'desc')->limit(3);
            }])
            ->orderBy('deuda', 'desc')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'nombre' => $p->nombre,
                    'email' => $p->email,
                    'telefono' => $p->telefono,
                    'deuda' => $p->deuda,
                    'ultimos_pagos' => $p->pagos,
                ];
            });

        $totalDeuda = $proveedores->sum('deuda');

        return response()->json([
            'success' => true,
            'data' => [
                'total_deuda' => $totalDeuda,
                'cantidad_proveedores' => $proveedores->count(),
                'proveedores' => $proveedores,
            ],
        ]);
    }

    /**
     * Reporte de stock crítico y bajo
     */
    public function stockAlerta(): JsonResponse
    {
        $criticos = Producto::with(['categoria', 'proveedor'])
            ->activos()
            ->where('estado_stock', 'critico')
            ->orderBy('stock')
            ->get();

        $bajos = Producto::with(['categoria', 'proveedor'])
            ->activos()
            ->where('estado_stock', 'bajo')
            ->orderBy('stock')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'criticos' => [
                    'cantidad' => $criticos->count(),
                    'productos' => $criticos,
                ],
                'bajos' => [
                    'cantidad' => $bajos->count(),
                    'productos' => $bajos,
                ],
            ],
        ]);
    }
}

