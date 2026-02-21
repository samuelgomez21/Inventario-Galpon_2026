<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CustomCors
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Obtener el origen de la petición
        $origin = $request->headers->get('Origin');

        // Si no hay origen, usar un valor por defecto
        if (!$origin) {
            $origin = $request->headers->get('Referer');
            if ($origin) {
                // Extraer el origen del referer
                $parts = parse_url($origin);
                $origin = ($parts['scheme'] ?? 'http') . '://' . ($parts['host'] ?? 'localhost');
                if (isset($parts['port'])) {
                    $origin .= ':' . $parts['port'];
                }
            } else {
                $origin = '*';
            }
        }

        // Manejar preflight requests (OPTIONS)
        if ($request->isMethod('OPTIONS')) {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Max-Age', '86400');
        }

        // Procesar la petición
        $response = $next($request);

        // Agregar headers CORS a todas las respuestas
        $response->headers->set('Access-Control-Allow-Origin', $origin);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}

