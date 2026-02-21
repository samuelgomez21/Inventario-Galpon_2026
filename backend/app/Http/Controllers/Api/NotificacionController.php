<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notificacion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificacionController extends Controller
{
    /**
     * Listar notificaciones del usuario actual
     */
    public function index(Request $request): JsonResponse
    {
        $query = Notificacion::where('user_id', auth()->id());

        if ($request->has('leida')) {
            $query->where('leida', $request->boolean('leida'));
        }

        if ($request->has('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        $notificaciones = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $notificaciones,
        ]);
    }

    /**
     * Contar notificaciones no leídas
     */
    public function contarNoLeidas(): JsonResponse
    {
        $count = Notificacion::where('user_id', auth()->id())
            ->noLeidas()
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'no_leidas' => $count,
            ],
        ]);
    }

    /**
     * Marcar notificación como leída
     */
    public function marcarLeida(Notificacion $notificacion): JsonResponse
    {
        // Verificar que la notificación pertenece al usuario
        if ($notificacion->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $notificacion->marcarComoLeida();

        return response()->json([
            'success' => true,
            'message' => 'Notificación marcada como leída',
        ]);
    }

    /**
     * Marcar todas como leídas
     */
    public function marcarTodasLeidas(): JsonResponse
    {
        Notificacion::where('user_id', auth()->id())
            ->noLeidas()
            ->update([
                'leida' => true,
                'leida_en' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Todas las notificaciones marcadas como leídas',
        ]);
    }

    /**
     * Eliminar una notificación
     */
    public function destroy(Notificacion $notificacion): JsonResponse
    {
        // Verificar que la notificación pertenece al usuario
        if ($notificacion->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $notificacion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notificación eliminada',
        ]);
    }

    /**
     * Eliminar todas las leídas
     */
    public function eliminarLeidas(): JsonResponse
    {
        Notificacion::where('user_id', auth()->id())
            ->where('leida', true)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notificaciones leídas eliminadas',
        ]);
    }
}

