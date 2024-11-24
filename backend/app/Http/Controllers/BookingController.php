<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Service;
use App\Models\Pass;
use App\Models\PassShare;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'service_id' => 'required|exists:services,id',
            'price' => 'required|numeric',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'contact_number' => 'required|string|max:20',
            'payment_method' => 'required|string|max:50',
            'refNumber' => 'required|string|unique:bookings,refNumber'
        ]);

        // Find the service associated with the booking
        $service = Service::findOrFail($validatedData['service_id']);

        // Check if service count is greater than 0
        if ($service->count <= 0) {
            return response()->json(['error' => 'Service is not available'], 400);
        }

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
        $booking = new Booking([
            'service_id' => $validatedData['service_id'],
            'price' => $validatedData['price'],
            'date' => $validatedData['date'],
            'time' => $validatedData['time'],
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'contact_number' => $validatedData['contact_number'],
            'payment_method' => $validatedData['payment_method'],
            'refNumber' => $validatedData['refNumber'],
            'status' => 'Pending',
        ]);
        $booking->customer()->associate($customer);
        $booking->save();

        // Create a 15-day pass if applicable (e.g., if service ID is 4)
        if ($service->id == 4) { // Assuming 4 is the ID for the 15-day pass service
            Pass::create([
                'customer_id' => $customer->id,
                'total_days' => 15,
                'remaining_days' => 15,
                'total_bullets' => 15,
                'remaining_bullets' => 15,
                'is_shared' => false
            ]);
        }

        // Return booking details along with the customer ID
        return response()->json(['booking' => $booking, 'customerID' => $customer->id], 201);
    }

    public function index()
    {
        // Fetch bookings with customer and service relations, sorted by created_at in descending order
        $bookings = Booking::with(['customer', 'service'])->orderBy('created_at', 'desc')->get();
        return response()->json($bookings);
    }


    public function show($refNumber)
    {
        $booking = Booking::with(['customer', 'service'])->where('refNumber', $refNumber)->first();

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
            $booking->status = 'Cancelled';
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

    public function checkPass(Request $request)
    {
        $customer = Customer::find($request->customer_id);

        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        $pass = Pass::where('customer_id', $customer->id)
            ->where('remaining_days', '>', 0)
            ->first();

        if (!$pass) {
            return response()->json(['error' => 'No valid 15-day pass found for this customer'], 404);
        }

        return response()->json([
            'success' => true,
            'pass' => $pass,
            'customer' => $customer
        ]);
    }

    public function usePass(Request $request)
    {
        $pass = Pass::findOrFail($request->passId);

        if ($pass->remaining_days <= 0) {
            return response()->json(['error' => 'Pass has no remaining days'], 400);
        }

        $pass->remaining_days--;
        $pass->remaining_bullets--;
        $pass->save();

        $booking = new Booking([
            'service_id' => 4, // Assuming 4 is the ID for the 15-day pass service
            'price' => 0, // It's prepaid, so no additional cost
            'date' => now()->toDateString(),
            'time' => now()->toTimeString(),
            'name' => $pass->customer->name,
            'email' => $pass->customer->email,
            'contact_number' => $pass->customer->contact_number,
            'payment_method' => 'Prepaid Pass',
            'refNumber' => 'PASS-' . Str::uuid(),
            'status' => 'confirmed'
        ]);
        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Pass used successfully',
            'remainingDays' => $pass->remaining_days,
            'booking' => $booking
        ]);
    }

    public function sharePass(Request $request)
    {
        $pass = Pass::findOrFail($request->passId);
        $sharedWithCustomer = Customer::findOrFail($request->sharedWithCustomerId);

        if ($pass->is_shared) {
            return response()->json(['error' => 'This pass has already been shared'], 400);
        }

        $pass->is_shared = true;
        $pass->save();

        $passShare = new PassShare([
            'pass_id' => $pass->id,
            'shared_with_customer_id' => $sharedWithCustomer->id,
            'share_date' => now()
        ]);
        $passShare->save();

        return response()->json([
            'success' => true,
            'message' => 'Pass shared successfully'
        ]);
    }
}
