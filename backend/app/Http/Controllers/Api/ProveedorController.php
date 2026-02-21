<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proveedor;
use App\Models\PagoProveedor;
use App\Models\LogActividad;
use App\Mail\RecordatorioPagoMail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class ProveedorController extends Controller
{
    /**
     * Listar todos los proveedores
     */
    public function index(Request $request): JsonResponse
    {
        $query = Proveedor::query();

        // Filtros
        if ($request->has('activo')) {
            $query->where('activo', $request->boolean('activo'));
        }

        if ($request->has('con_deuda')) {
            $query->conDeuda();
        }

        if ($request->has('buscar')) {
            $termino = $request->buscar;
            $query->where(function ($q) use ($termino) {
                $q->where('nombre', 'like', "%{$termino}%")
                  ->orWhere('email', 'like', "%{$termino}%")
                  ->orWhere('telefono', 'like', "%{$termino}%");
            });
        }

        $orderBy = $request->get('order_by', 'nombre');
        $orderDir = $request->get('order_dir', 'asc');
        $query->orderBy($orderBy, $orderDir);

        // Si no se pide paginación explícita, devolver todos
        if ($request->has('per_page') && $request->per_page !== 'all') {
            $proveedores = $query->paginate($request->get('per_page', 15));
            return response()->json([
                'success' => true,
                'data' => $proveedores,
            ]);
        }

        // Devolver todos los proveedores sin paginar
        $proveedores = $query->get();
        return response()->json([
            'success' => true,
            'data' => $proveedores,
        ]);
    }

    /**
     * Crear un nuevo proveedor
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'nullable|email',
            'telefono' => 'nullable|string|max:50',
            'direccion' => 'nullable|string|max:255',
            'ciudad' => 'nullable|string|max:100',
            'contacto_nombre' => 'nullable|string|max:255',
            'notas' => 'nullable|string',
        ]);

        $proveedor = Proveedor::create($validated);

        // Registrar actividad
        LogActividad::registrar(
            'crear_proveedor',
            auth()->id(),
            'Proveedor',
            $proveedor->id,
            null,
            $proveedor->toArray()
        );

        return response()->json([
            'success' => true,
            'message' => 'Proveedor creado exitosamente',
            'data' => $proveedor,
        ], 201);
    }

    /**
     * Mostrar un proveedor específico
     */
    public function show(Proveedor $proveedor): JsonResponse
    {
        $proveedor->load(['productos' => function ($q) {
            $q->activos()->limit(10);
        }, 'pagos' => function ($q) {
            $q->orderBy('fecha_pago', 'desc')->limit(10);
        }]);

        return response()->json([
            'success' => true,
            'data' => $proveedor,
        ]);
    }

    /**
     * Actualizar un proveedor
     */
    public function update(Request $request, Proveedor $proveedor): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email',
            'telefono' => 'nullable|string|max:50',
            'direccion' => 'nullable|string|max:255',
            'ciudad' => 'nullable|string|max:100',
            'contacto_nombre' => 'nullable|string|max:255',
            'notas' => 'nullable|string',
            'calificacion' => 'sometimes|numeric|min:0|max:5',
            'activo' => 'sometimes|boolean',
        ]);

        $datosAnteriores = $proveedor->toArray();
        $proveedor->update($validated);

        // Registrar actividad
        LogActividad::registrar(
            'actualizar_proveedor',
            auth()->id(),
            'Proveedor',
            $proveedor->id,
            $datosAnteriores,
            $proveedor->fresh()->toArray()
        );

        return response()->json([
            'success' => true,
            'message' => 'Proveedor actualizado exitosamente',
            'data' => $proveedor->fresh(),
        ]);
    }

    /**
     * Eliminar un proveedor
     */
    public function destroy(Proveedor $proveedor): JsonResponse
    {
        // Verificar si tiene deuda pendiente
        if ($proveedor->deuda > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el proveedor porque tiene deuda pendiente',
            ], 400);
        }

        // Verificar si tiene productos asociados
        if ($proveedor->productos()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el proveedor porque tiene productos asociados',
            ], 400);
        }

        $datosAnteriores = $proveedor->toArray();
        $proveedor->delete();

        // Registrar actividad
        LogActividad::registrar(
            'eliminar_proveedor',
            auth()->id(),
            'Proveedor',
            $proveedor->id,
            $datosAnteriores,
            null
        );

        return response()->json([
            'success' => true,
            'message' => 'Proveedor eliminado exitosamente',
        ]);
    }

    /**
     * Incrementar deuda del proveedor (compra)
     */
    public function incrementarDeuda(Request $request, Proveedor $proveedor): JsonResponse
    {
        $validated = $request->validate([
            'monto' => 'required|numeric|min:0.01',
            'notas' => 'nullable|string',
        ]);

        $deudaAnterior = $proveedor->deuda;
        $proveedor->incrementarDeuda($validated['monto']);

        // Registrar actividad
        LogActividad::registrar(
            'incrementar_deuda_proveedor',
            auth()->id(),
            'Proveedor',
            $proveedor->id,
            ['deuda' => $deudaAnterior],
            ['deuda' => $proveedor->deuda, 'monto_incrementado' => $validated['monto']]
        );

        return response()->json([
            'success' => true,
            'message' => 'Deuda actualizada exitosamente',
            'data' => $proveedor->fresh(),
        ]);
    }

    /**
     * Registrar pago a proveedor
     */
    public function registrarPago(Request $request, Proveedor $proveedor): JsonResponse
    {
        $validated = $request->validate([
            'monto' => 'required|numeric|min:0.01',
            'metodo_pago' => 'required|in:efectivo,transferencia,cheque,otro',
            'referencia' => 'nullable|string|max:100',
            'notas' => 'nullable|string',
            'fecha_pago' => 'required|date',
        ]);

        // Validar que el monto no exceda la deuda
        if ($validated['monto'] > $proveedor->deuda) {
            return response()->json([
                'success' => false,
                'message' => 'El monto del pago no puede ser mayor a la deuda actual ($' . number_format($proveedor->deuda, 2) . ')',
            ], 400);
        }

        $deudaAnterior = $proveedor->deuda;

        DB::transaction(function () use ($proveedor, $validated) {
            // Registrar el pago
            PagoProveedor::create([
                'proveedor_id' => $proveedor->id,
                'user_id' => auth()->id(),
                'monto' => $validated['monto'],
                'metodo_pago' => $validated['metodo_pago'],
                'referencia' => $validated['referencia'] ?? null,
                'notas' => $validated['notas'] ?? null,
                'fecha_pago' => $validated['fecha_pago'],
            ]);

            // Decrementar deuda
            $proveedor->decrementarDeuda($validated['monto']);
        });

        // Registrar actividad
        LogActividad::registrar(
            'pago_proveedor',
            auth()->id(),
            'Proveedor',
            $proveedor->id,
            ['deuda' => $deudaAnterior],
            ['deuda' => $proveedor->fresh()->deuda, 'monto_pagado' => $validated['monto']]
        );

        return response()->json([
            'success' => true,
            'message' => 'Pago registrado exitosamente',
            'data' => $proveedor->fresh(),
        ]);
    }

    /**
     * Historial de pagos de un proveedor
     */
    public function historialPagos(Request $request, Proveedor $proveedor): JsonResponse
    {
        $query = $proveedor->pagos()->with('user');

        if ($request->has('fecha_desde')) {
            $query->whereDate('fecha_pago', '>=', $request->fecha_desde);
        }

        if ($request->has('fecha_hasta')) {
            $query->whereDate('fecha_pago', '<=', $request->fecha_hasta);
        }

        $pagos = $query->orderBy('fecha_pago', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $pagos,
        ]);
    }

    /**
     * Enviar recordatorio de pago
     */
    public function enviarRecordatorio(Proveedor $proveedor): JsonResponse
    {
        if (!$proveedor->email) {
            return response()->json([
                'success' => false,
                'message' => 'El proveedor no tiene email registrado',
            ], 400);
        }

        if ($proveedor->deuda <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'El proveedor no tiene deuda pendiente',
            ], 400);
        }

        try {
            Mail::to($proveedor->email)->send(new RecordatorioPagoMail(
                $proveedor->nombre,
                $proveedor->deuda
            ));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el correo: ' . $e->getMessage(),
            ], 500);
        }

        // Registrar actividad
        LogActividad::registrar(
            'enviar_recordatorio_pago',
            auth()->id(),
            'Proveedor',
            $proveedor->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Recordatorio enviado exitosamente',
        ]);
    }

    /**
     * Resumen de proveedores con deuda
     */
    public function resumenDeudas(): JsonResponse
    {
        $proveedores = Proveedor::activos()
            ->conDeuda()
            ->orderBy('deuda', 'desc')
            ->get(['id', 'nombre', 'email', 'telefono', 'deuda']);

        $totalDeuda = $proveedores->sum('deuda');

        return response()->json([
            'success' => true,
            'data' => [
                'proveedores' => $proveedores,
                'total_deuda' => $totalDeuda,
                'cantidad_proveedores' => $proveedores->count(),
            ],
        ]);
    }
}

