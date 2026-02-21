<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recordatorio de Pago</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .amount { font-size: 28px; font-weight: bold; color: #EF4444; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        .contact { background: #EFF6FF; border: 1px solid #3B82F6; padding: 15px; border-radius: 8px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌾 El Galpón</h1>
        <p>Recordatorio de Saldo Pendiente</p>
    </div>
    <div class="content">
        <p>Estimado(a) <strong>{{ $nombreProveedor }}</strong>,</p>
        <p>Le recordamos amablemente que tiene un saldo pendiente con nosotros:</p>

        <div class="amount">
            $ {{ number_format($montoDeuda, 2, ',', '.') }} COP
        </div>

        <p>Agradecemos su atención a este asunto. Si ya realizó el pago, por favor ignore este mensaje.</p>

        <div class="contact">
            <strong>📞 Contacto:</strong><br>
            El Galpón - Agropecuaria y Veterinaria<br>
            Alcalá, Valle del Cauca, Colombia
        </div>
    </div>
    <div class="footer">
        <p>Este es un correo automático, por favor no respondas.</p>
    </div>
</body>
</html>

