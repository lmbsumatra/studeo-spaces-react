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
    public function getData(Request $request)
    {
        // Adjust the selected date to be one day behind
        $selectedDate = $request->input('date', Carbon::now()->setTimezone('Asia/Manila')->toDateString());
        // echo "$selectedDate";
        // Calculate available seats
        $availableSeats = Service::leftJoin('service_availability', function ($join) use ($selectedDate) {
            $join->on('services.id', '=', 'service_availability.service_id')
                ->where('service_availability.date', '=', $selectedDate);
        })
            ->select(DB::raw('
                SUM(CASE 
                    WHEN service_availability.service_id IS NOT NULL THEN service_availability.available_seats 
                    ELSE services.count 
                END) as total_available_seats
            '))
            ->first()
            ->total_available_seats;

        // Calculate other metrics based on the selected date
        $bookedSeats = Booking::where('status', 'Completed')
            ->whereDate('date', $selectedDate)
            ->count();
        $numberOfCustomers = Customer::whereHas('bookings', function ($query) use ($selectedDate) {
            $query->whereDate('date', $selectedDate);
        })->count();
        $totalSales = Booking::where('status', 'Completed')
            ->whereDate('date', $selectedDate)
            ->sum('price');
        $pendingBookings = Booking::where('status', 'Pending')
            ->whereDate('date', $selectedDate)
            ->count();
        $canceledBookings = Booking::where('status', 'Cancelled')
            ->whereDate('date', $selectedDate)
            ->count();

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
