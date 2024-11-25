<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Service;
use App\Models\Pass;
use App\Models\PassShare;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingSummaryMail;

class BookingController extends Controller
{
    private function generatePassReference()
    {
        do {
            $reference = 'PASS-' . strtoupper(substr(md5(uniqid()), 0, 8));
        } while (Pass::where('reference_number', $reference)->exists());

        return $reference;
    }

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
            'refNumber' => 'required|string|unique:bookings,refNumber',
            'payment_method' => 'required|in:GCash,Pay on Counter,Bank Card',
        ]);

        // Find the service
        $service = Service::find($validatedData['service_id']);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        // Find or create the customer
        $customer = Customer::firstOrCreate(
            ['email' => $validatedData['email']],
            [
                'name' => $validatedData['name'],
                'contact_number' => $validatedData['contact_number']
            ]
        );

        // Retrieve the pass for the customer if it exists
        $pass = Pass::where('customer_id', $customer->id)->first();

        // Determine pass type based on ownership and shared status
        $isOwner = $pass && $pass->customer_id == $customer->id;
        $isSharedPass = $pass && PassShare::where('pass_id', $pass->id)->where('shared_with_customer_id', $customer->id)->exists();

        if ($isOwner) {
            $validatedData['pass_type'] = 'Owner';
            $validatedData['payment_method'] = 'Shared Pass';
        } elseif ($isSharedPass) {
            $validatedData['pass_type'] = 'Shared';
            $validatedData['payment_method'] = 'Shared Pass';
        } else {
            $validatedData['pass_type'] = 'Regular';
            // Keep the user's chosen payment method
        }

        // Create the booking
        $booking = new Booking(array_merge($validatedData, [
            'status' => 'Pending',
        ]));
        $booking->customer()->associate($customer);
        $booking->save();

        // Create a 15-day pass if applicable (e.g., if service ID is 40)
        if ($service->id == 4) { // Assuming 40 is the ID for the 15-day pass service
            Pass::create([
                'customer_id' => $customer->id,
                'total_days' => 15,
                'remaining_days' => 15,
                'total_bullets' => 15,
                'remaining_bullets' => 15,
                'is_shared' => false,
                'reference_number' => $this->generatePassReference()
            ]);
        }

        return response()->json(['booking' => $booking, 'id' => $booking->id, 'customerID' => $customer->id], 201);
    }

    public function sendEmailReceipt(Request $request)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'email' => 'required|email',
            'service_name' => 'required|string',
            'date' => 'required|date',
            'time' => 'required',
            'price' => 'required|numeric',
            'refNumber' => 'required|string',
        ]);

        Log::info('Email data received: ', $validatedData);
        Log::info('Received email data: ', $request->all());


        // Prepare booking details for the email
        $bookingDetails = [
            'service_name' => $validatedData['service_name'],
            'date' => $validatedData['date'],
            'time' => $validatedData['time'],
            'price' => $validatedData['price'],
            'refNumber' => $validatedData['refNumber'],
        ];


        // Send the email
        try {
            Log::info('Sending email to: ' . $validatedData['email']);  // Log email address being sent to
            Mail::to($validatedData['email'])->send(new BookingSummaryMail($bookingDetails));
            Log::info('Email sent successfully to: ' . $validatedData['email']);
            return response()->json(['message' => 'Email sent successfully!'], 200);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Failed to send booking email: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send email. Please try again later.'], 500);
        }
    }

  
    public function index()
    {
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

            return response()->json(['booking' => $booking, 'id' => $booking->id], 200);
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

    public function checkPassByReference(Request $request)
    {
        $validatedData = $request->validate([
            'reference_number' => 'required|string',
            'name' => 'required|string'
        ]);

        $pass = Pass::where('reference_number', $validatedData['reference_number'])
            ->where('remaining_days', '>', 0)
            ->with('customer')
            ->first();

        if (!$pass) {
            return response()->json([
                'error' => 'Invalid or expired pass'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'pass' => $pass,
            'customer' => $pass->customer,
            'remaining_days' => $pass->remaining_days,
            'remaining_bullets' => $pass->remaining_bullets
        ]);
    }

    public function usePass(Request $request)
    {

        Log::info('usePass method triggered');

        // Validate the request
        $validatedData = $request->validate([
            'reference_number' => 'required|string',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'contact_number' => 'required|string'
        ]);

        // Retrieve the pass
        $pass = Pass::where('reference_number', $validatedData['reference_number'])
            ->where('remaining_days', '>', 0)
            ->first();

        if (!$pass || !$pass->isValid()) {
            Log::error('Pass not found, expired, or invalid', ['reference_number' => $validatedData['reference_number']]);
            return response()->json(['error' => 'Pass not found or expired'], 404);
        }

        // Find or create the customer
        $customer = Customer::firstOrCreate(
            ['email' => $validatedData['email']],
            [
                'name' => $validatedData['name'],
                'contact_number' => $validatedData['contact_number']
            ]
        );

        // Determine if the customer is the pass owner or using a shared pass
        $isOwner = $pass->customer_id == $customer->id;
        $isSharedPass = !$isOwner && $pass->is_shared;
        $pass_type = $isOwner ? 'Owner' : 'Shared';
        $payment_method = 'Shared Pass';

        // Create or retrieve a shared pass entry if it's a shared pass
        if ($isSharedPass) {
            $existingShare = PassShare::firstOrCreate([
                'pass_id' => $pass->id,
                'shared_with_customer_id' => $customer->id
            ], [
                'share_date' => now(),
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'contact' => $validatedData['contact_number']
            ]);

            if ($existingShare->wasRecentlyCreated) {
                Log::info('Pass share entry created', ['pass_id' => $pass->id, 'shared_with_customer_id' => $customer->id]);
            } else {
                Log::info('Pass share entry already exists', ['pass_id' => $pass->id, 'shared_with_customer_id' => $customer->id]);
            }
        }

        DB::beginTransaction();
        try {
            // Update pass usage
            $pass->decrement('remaining_days');
            $pass->decrement('remaining_bullets');

            // Create the booking record
            $booking = new Booking([
                'service_id' => 4, // Example service ID for a 15-day pass
                'price' => 0,
                'date' => now()->toDateString(),
                'time' => now()->toTimeString(),
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'contact_number' => $validatedData['contact_number'],
                'payment_method' => $payment_method,
                'refNumber' => 'SHARED-' . Str::uuid(),
                'status' => 'Confirmed',
                'pass_type' => $pass_type
            ]);
            $booking->customer()->associate($customer);
            $booking->save();

            DB::commit();

            Log::info('Transaction committed successfully');

            return response()->json([
                'success' => true,
                'message' => 'Pass used successfully',
                'remaining_days' => $pass->remaining_days,
                'remaining_bullets' => $pass->remaining_bullets,
                'booking' => $booking
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while using the pass'], 500);
        }
    }
}
