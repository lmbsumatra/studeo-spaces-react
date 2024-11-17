<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Booking;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function getData(Request $request)
    {
        // Adjust the selected date to be one day behind (if required)
        $selectedDate = $request->input('date', Carbon::now()->setTimezone('Asia/Manila')->toDateString());

        // Get the total available seats from services (sum of the 'count' field)
        $totalSeats = Service::sum('count'); // Total capacity of all services

        // Calculate the number of booked seats for the selected date
        $bookedSeats = Booking::where('status', 'Completed')
            ->whereDate('date', $selectedDate)
            ->count(); // Count the number of bookings (each booking is for 1 seat)

        // Calculate available seats by subtracting booked seats from total seats
        $availableSeats = $totalSeats - $bookedSeats;

        // Calculate other metrics based on the selected date
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
