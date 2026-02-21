<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\VerificationCode;
use App\Models\LogActividad;
use App\Mail\VerificationCodeMail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class AuthController extends Controller
{
    /**
     * Solicitar código de verificación
     */
    public function solicitarCodigo(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = strtolower($request->email);

        // Rate limiting: máximo 5 intentos por minuto
        $key = 'login-attempt:' . $email;
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => "Demasiados intentos. Por favor espera {$seconds} segundos.",
            ], 429);
        }

        RateLimiter::hit($key, 60);

        // Verificar si el usuario existe y está activo
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autorizado',
            ], 401);
        }

        if (!$user->activo) {
            return response()->json([
                'success' => false,
                'message' => 'Tu cuenta está desactivada. Contacta al administrador.',
            ], 401);
        }

        // Invalidar códigos anteriores
        VerificationCode::where('email', $email)
            ->where('usado', false)
            ->update(['usado' => true]);

        // Generar nuevo código de 6 dígitos
        $codigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Crear código de verificación
        $verificationCode = VerificationCode::create([
            'email' => $email,
            'codigo' => $codigo,
            'expira_en' => now()->addMinutes(10),
        ]);

        // Enviar email con el código
        try {
            Mail::to($email)->queue(new VerificationCodeMail($codigo, $user->nombre));
        } catch (\Exception $e) {
            \Log::warning('Error al enviar email: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el correo. Intenta de nuevo.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Se ha enviado un código de verificación a tu correo',
        ]);
    }

    /**
     * Verificar código y obtener token
     */
    public function verificarCodigo(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'codigo' => 'required|string|size:6',
        ]);

        $email = strtolower($request->email);
        $codigo = $request->codigo;

        // Buscar código válido
        $verificationCode = VerificationCode::validos($email, $codigo)->first();

        if (!$verificationCode) {
            return response()->json([
                'success' => false,
                'message' => 'Código inválido o expirado',
            ], 401);
        }

        // Marcar código como usado
        $verificationCode->marcarComoUsado();

        // Obtener usuario
        $user = User::where('email', $email)->first();

        if (!$user || !$user->activo) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autorizado',
            ], 401);
        }

        // Revocar tokens anteriores
        $user->tokens()->delete();

        // Crear nuevo token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Registrar login
        LogActividad::registrar('login', $user->id);

        // Limpiar rate limiter
        RateLimiter::clear('login-attempt:' . $email);

        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'nombre' => $user->nombre,
                    'email' => $user->email,
                    'rol' => $user->rol,
                    'activo' => $user->activo,
                    'ultimo_acceso' => $user->ultimo_acceso,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
                'token' => $token,
                'token_type' => 'Bearer',
                'abilities' => $user->rol === 'admin' ? ['*'] : ['read'],
            ],
        ]);
    }

    /**
     * Obtener usuario actual
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'nombre' => $user->nombre,
                    'email' => $user->email,
                    'rol' => $user->rol,
                    'activo' => $user->activo,
                    'ultimo_acceso' => $user->ultimo_acceso,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
                'abilities' => $user->rol === 'admin' ? ['*'] : ['read'],
            ],
        ]);
    }

    /**
     * Cerrar sesión
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        // Registrar logout
        LogActividad::registrar('logout', $user->id);

        // Revocar token actual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada correctamente',
        ]);
    }

    /**
     * Cerrar todas las sesiones
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $user = $request->user();

        // Registrar logout
        LogActividad::registrar('logout_all', $user->id);

        // Revocar todos los tokens
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Todas las sesiones han sido cerradas',
        ]);
    }
}

