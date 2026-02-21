<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Verificación</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .code { font-size: 36px; font-weight: bold; color: #10B981; letter-spacing: 8px; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        .warning { background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌾 El Galpón</h1>
        <p>Agropecuaria y Veterinaria</p>
    </div>
    <div class="content">
        <p>Hola <strong>{{ $nombreUsuario }}</strong>,</p>
        <p>Has solicitado iniciar sesión en El Galpón. Tu código de verificación es:</p>

        <div class="code">{{ $codigo }}</div>

        <div class="warning">
            <strong>⏰ Este código expira en 10 minutos.</strong>
            <p style="margin: 5px 0 0 0;">Si no solicitaste este código, puedes ignorar este mensaje.</p>
        </div>
    </div>
    <div class="footer">
        <p>El Galpón - Alcalá, Valle del Cauca, Colombia</p>
        <p>Este es un correo automático, por favor no respondas.</p>
    </div>
</body>
</html>

