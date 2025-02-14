<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingSummaryMail extends Mailable 
{
    use Queueable, SerializesModels;

    public $bookingDetails;

    public function __construct($bookingDetails)
    {
        $this->bookingDetails = $bookingDetails;
    }

    public function build()
    {
        return $this->view('emails.booking_summary')
                ->subject('Your Booking Receipt')
                ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
                ->with('bookingDetails', $this->bookingDetails);
    }
}
