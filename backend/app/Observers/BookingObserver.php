<?php
namespace App\Observers;

use App\Models\Booking;
use App\Models\Service;
use App\Models\ServiceAvailability;
use Illuminate\Support\Facades\DB;

class BookingObserver
{
    /**
     * Handle the Booking "created" event.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function created(Booking $booking)
    {
        $this->updateServiceAvailability($booking);
    }

    /**
     * Handle the Booking "updated" event.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function updated(Booking $booking)
    {
        $this->updateServiceAvailability($booking);
    }

    /**
     * Handle the Booking "deleted" event.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function deleted(Booking $booking)
    {
        $this->updateServiceAvailability($booking);
    }

    /**
     * Update the service availability based on the current bookings.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    protected function updateServiceAvailability(Booking $booking)
    {
        $service = $booking->service;

        $bookings = Booking::where('service_id', $service->id)
                           ->where('date', $booking->date)
                           ->select(DB::raw('count(*) as booked_seats'))
                           ->first();

        $bookedSeats = $bookings ? $bookings->booked_seats : 0;
        $availableSeats = $service->count - $bookedSeats;

        ServiceAvailability::updateOrCreate(
            [
                'service_id' => $service->id,
                'date' => $booking->date,
            ],
            [
                'available_seats' => $availableSeats,
            ]
        );
    }
}
