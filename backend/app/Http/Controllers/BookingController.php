<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Service;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'service' => 'required|string|max:255',
            'price' => 'required|numeric',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'contact_number' => 'required|string|max:20',
            'payment_method' => 'required|string|max:50',
            'refNumber' => 'required|string|unique:bookings,refNumber'
        ]);

        // Start by finding the service associated with the booking
        $service = Service::where('name', $validatedData['service'])->first();

        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        // Check if service count is greater than 0
        if ($service->count <= 0) {
            return response()->json(['error' => 'Service is not available'], 400);
        }

        // Decrement the count of the booked service
        $service->count--;
        $service->save();

        // Check if the customer already exists
        $customer = Customer::where('email', $validatedData['email'])
            ->where('name', $validatedData['name'])
            ->where('contact_number', $validatedData['contact_number'])
            ->first();

        // If customer doesn't exist, create a new one
        if (!$customer) {
            $customer = Customer::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'contact_number' => $validatedData['contact_number'],
            ]);
        }

        // Create the booking and associate it with the customer
        $booking = new Booking($validatedData);
        $booking->status = 'pending';
        $booking->customer()->associate($customer);
        $booking->save();
        // Return booking details along with the customer ID
        return response()->json(['booking' => $booking, 'customerID' => $customer->id], 201);
    }

    public function index()
    {
        $bookings = Booking::with('customer')->get();
        return response()->json($bookings);
    }

    public function show($refNumber)
    {
        $booking = Booking::with('customer')->where('refNumber', $refNumber)->first();

        if ($booking) {
            return response()->json($booking);
        } else {
            return response()->json(['message' => 'Booking not found'], 404);
        }
    }

    public function cancel($refNumber)
    {
        $booking = Booking::where('refNumber', $refNumber)->first();

        if ($booking) {
            $booking->status = 'cancelled';
            $booking->save();

            return response()->json(['message' => 'Booking cancelled successfully'], 200);
        } else {
            return response()->json(['message' => 'Booking not found'], 404);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $validatedData = $request->validate([
            'status' => 'required|string|in:Completed,Pending,Cancelled',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->status = $validatedData['status'];
        $booking->save();

        return response()->json(['message' => 'Booking status updated successfully'], 200);
    }
}
