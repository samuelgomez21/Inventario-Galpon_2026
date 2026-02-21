<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud de Cotización</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .products-table th, .products-table td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
        .products-table th { background: #10B981; color: white; }
        .products-table tr:nth-child(even) { background: white; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        .deadline { background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌾 El Galpón</h1>
        <p>Solicitud de Cotización {{ $numeroCotizacion }}</p>
    </div>
    <div class="content">
        <p>Estimado(a) <strong>{{ $nombreProveedor }}</strong>,</p>
        <p>Nos comunicamos desde El Galpón para solicitar cotización de los siguientes productos:</p>

        <table class="products-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Especificaciones</th>
                </tr>
            </thead>
            <tbody>
                @foreach($productos as $index => $producto)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $producto['nombre'] }}</td>
                    <td>{{ $producto['cantidad'] }}</td>
                    <td>{{ $producto['especificaciones'] ?? '-' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        @if($descripcion)
        <p><strong>Notas adicionales:</strong> {{ $descripcion }}</p>
        @endif

        <div class="deadline">
            <strong>📅 Fecha límite para respuesta:</strong><br>
            {{ $fechaLimite }}
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $urlRespuesta }}" style="display: inline-block; background: #10B981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                📤 RESPONDER COTIZACIÓN EN LÍNEA
            </a>
            <p style="margin-top: 15px; font-size: 12px; color: #6b7280;">
                También puede descargar una plantilla Excel desde el enlace
            </p>
        </div>

        <p>Agradecemos su pronta respuesta.</p>
        <p>Cordialmente,<br><strong>El Galpón</strong></p>
    </div>
    <div class="footer">
        <p>El Galpón - Agropecuaria y Veterinaria</p>
        <p>Alcalá, Valle del Cauca, Colombia</p>
    </div>
</body>
</html>

