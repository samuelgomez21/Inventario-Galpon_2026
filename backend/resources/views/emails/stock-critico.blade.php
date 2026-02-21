<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alerta Stock Crítico</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #EF4444, #DC2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .products-table th, .products-table td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
        .products-table th { background: #EF4444; color: white; }
        .products-table tr:nth-child(even) { background: white; }
        .critical { color: #EF4444; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚠️ Alerta de Stock Crítico</h1>
        <p>El Galpón - Sistema de Inventario</p>
    </div>
    <div class="content">
        <p>Se han detectado los siguientes productos con <strong class="critical">stock crítico</strong>:</p>

        <table class="products-table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Stock Actual</th>
                    <th>Stock Mínimo</th>
                </tr>
            </thead>
            <tbody>
                @foreach($productos as $producto)
                <tr>
                    <td>{{ $producto['codigo'] }}</td>
                    <td>{{ $producto['nombre'] }}</td>
                    <td class="critical">{{ $producto['stock'] }}</td>
                    <td>{{ $producto['stock_minimo'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <p>Por favor, tome las medidas necesarias para reabastecer estos productos.</p>
    </div>
    <div class="footer">
        <p>El Galpón - Alcalá, Valle del Cauca, Colombia</p>
        <p>Este es un correo automático del sistema de alertas.</p>
    </div>
</body>
</html>

