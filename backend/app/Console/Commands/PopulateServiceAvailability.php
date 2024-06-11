<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Service;
use App\Models\Booking;
use App\Models\ServiceAvailability;
use Illuminate\Support\Facades\DB;

class PopulateServiceAvailability extends Command
{
    protected $signature = 'populate:service-availability';
    protected $description = 'Populate service availability table based on service count and booked seats';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $services = Service::all();

        foreach ($services as $service) {
            $bookings = Booking::where('service_id', $service->id)
                               ->groupBy('date')
                               ->select('date', DB::raw('count(*) as booked_seats'))
                               ->get();

            foreach ($bookings as $booking) {
                $availableSeats = $service->count - $booking->booked_seats;

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

        $this->info('Service availability has been populated successfully!');
    }
}
