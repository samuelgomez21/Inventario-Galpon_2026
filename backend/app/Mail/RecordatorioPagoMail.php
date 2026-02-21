<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RecordatorioPagoMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $nombreProveedor;
    public float $montoDeuda;

    /**
     * Create a new message instance.
     */
    public function __construct(string $nombreProveedor, float $montoDeuda)
    {
        $this->nombreProveedor = $nombreProveedor;
        $this->montoDeuda = $montoDeuda;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recordatorio de Saldo Pendiente - El Galpón',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.recordatorio-pago',
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

