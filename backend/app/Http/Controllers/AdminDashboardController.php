<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\ServiceAvailability;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function getData()
    {
        // Get today's date
        $today = Carbon::today()->toDateString();

        // Calculate available seats
        $availableSeats = Service::leftJoin('service_availability', function ($join) use ($today) {
                $join->on('services.id', '=', 'service_availability.service_id')
                     ->where('service_availability.date', '=', $today);
            })
            ->select(DB::raw('
                SUM(CASE 
                    WHEN service_availability.service_id IS NOT NULL THEN service_availability.available_seats 
                    ELSE services.count 
                END) as total_available_seats
            '))
            ->first()
            ->total_available_seats;

        // Calculate other metrics
        $bookedSeats = Booking::count();
        $numberOfCustomers = Customer::count();
        $totalSales = Booking::where('status', 'Completed')->sum('price');
        $pendingBookings = Booking::where('status', 'Pending')->count();
        $canceledBookings = Booking::where('status', 'Cancelled')->count();

        return response()->json([
            'availableSeats' => $availableSeats,
            'bookedSeats' => $bookedSeats,
            'numberOfCustomers' => $numberOfCustomers,
            'totalSales' => $totalSales,
            'pendingBookings' => $pendingBookings,
            'canceledBookings' => $canceledBookings,
        ]);
    }
}
