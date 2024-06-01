<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    public function store(Request $request)
{
    Log::info('Booking data:', $request->all()); // Add this line

    $validated = $request->validate([
        'service' => 'required|string',
        'date' => 'required|date',
        'time' => 'required|date_format:H:i',
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'contact_number' => 'required|string|max:15',
        'payment_method' => 'required|string|max:50',
    ]);

    $booking = Booking::create($validated);

    return response()->json($booking, 201);
}

    public function index()
    {
        $bookings = Booking::all();
        return response()->json($bookings);
    }
}
