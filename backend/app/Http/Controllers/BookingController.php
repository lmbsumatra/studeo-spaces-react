<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'service' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',  // Corrected line
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'contact_number' => 'required|string|max:20',
            'payment_method' => 'required|string|max:50',
            'refNumber' => 'required|string|unique:bookings,refNumber'
        ]);
    
        $booking = Booking::create($validatedData);
    
        return response()->json($booking, 201);
    }

    public function index()
    {
        $bookings = Booking::all();
        return response()->json($bookings);
    }

    // Add this method to fetch booking by reference number
    public function show($refNumber)
    {
        $booking = Booking::where('refNumber', $refNumber)->first();

        if ($booking) {
            return response()->json($booking);
        } else {
            return response()->json(['message' => 'Booking not found'], 404);
        }
    }
}
