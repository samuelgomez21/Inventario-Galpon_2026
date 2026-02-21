<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CotizacionSolicitudMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $nombreProveedor;
    public string $numeroCotizacion;
    public array $productos;
    public string $fechaLimite;
    public ?string $descripcion;
    public string $urlRespuesta;

    /**
     * Create a new message instance.
     */
    public function __construct(
        string $nombreProveedor,
        string $numeroCotizacion,
        array $productos,
        string $fechaLimite,
        ?string $descripcion = null,
        string $urlRespuesta = ''
    ) {
        $this->nombreProveedor = $nombreProveedor;
        $this->numeroCotizacion = $numeroCotizacion;
        $this->productos = $productos;
        $this->fechaLimite = $fechaLimite;
        $this->descripcion = $descripcion;
        $this->urlRespuesta = $urlRespuesta;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Solicitud de Cotización {$this->numeroCotizacion} - El Galpón",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.cotizacion-solicitud',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

