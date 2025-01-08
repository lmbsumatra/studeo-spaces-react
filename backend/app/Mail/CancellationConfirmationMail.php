<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CancellationConfirmationMail extends Mailable 
{
    use Queueable, SerializesModels;

    public $bookingDetails;

    public function __construct($bookingDetails)
    {
        $this->bookingDetails = $bookingDetails;
    }

    public function build()
    {
        return $this->view('emails.cancellation_confirmation')
                    ->subject('Booking Cancellation Confirmation')
                    ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
                    ->with(['bookingDetails' => $this->bookingDetails]);
    }
}
