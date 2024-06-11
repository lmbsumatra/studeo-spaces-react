<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\ServiceAvailability;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function getData()
    {
        // Summing up the 'count' column across all services
        $availableSeats = ServiceAvailability::sum('available_seats');
        $bookedSeats = Booking::count();
        $numberOfCustomers = Customer::sum('id');
        $totalSales = Booking::sum('price');

        return response()->json([
            'availableSeats' => $availableSeats,
            'bookedSeats'=> $bookedSeats,
            'numberOfCustomers'=> $numberOfCustomers,
            'totalSales'=> $totalSales,
            'pendingBookings'=> 0,
             'canceledBookings'=> 0,
        ]);
    }
}
