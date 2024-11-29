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
use App\Models\Seat;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingSummaryMail;
use App\Mail\CancellationConfirmationMail;

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
        Log::info('Booking store request received', ['request_data' => $request->all()]);

        try {
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
                'seat_code' => 'nullable|string|exists:seats,seat_code',
            ]);

            Log::info('Request data validated successfully', ['validated_data' => $validatedData]);

            // Find the service
            $service = Service::find($validatedData['service_id']);
            if (!$service) {
                Log::error('Service not found', ['service_id' => $validatedData['service_id']]);
                return response()->json(['error' => 'Service not found'], 404);
            }

            Log::info('Service found', ['service' => $service]);

            $seatCode = $validatedData['seat_code'] ?? null;
            $seat = null;

            // If seat_code is not provided in the request, find the first available seat
            if (!$seatCode) {
                Log::info('No seat_code provided, looking for available seat for the selected service, date, and time', [
                    'service_id' => $validatedData['service_id'],
                    'date' => $validatedData['date'],
                    // 'time' => $validatedData['time'],
                ]);

                // Find a seat where no booking exists for the given service, date, and time
                $seat = Seat::whereDoesntHave('bookings', function ($query) use ($validatedData) {
                    $query->where('date', $validatedData['date'])
                        // ->where('time', $validatedData['time'])
                        ->where('service_id', $validatedData['service_id']);
                })
                    ->where('service_id', $validatedData['service_id'])
                    ->first();

                // If no seat is available, log and return an error
                if (!$seat) {
                    Log::warning('No available seat found', [
                        'service_id' => $validatedData['service_id'],
                        'date' => $validatedData['date'],
                        // 'time' => $validatedData['time'],
                    ]);
                    return response()->json(['error' => 'No available seats for this service at the selected date and time'], 400);
                }

                Log::info('Available seat found', ['seat_code' => $seat->seat_code]);
                $seatCode = $seat->seat_code;
            } else {
                Log::info('Seat code provided', ['seat_code' => $seatCode]);

                // Validate that the specified seat is available
                $seat = Seat::where('seat_code', $seatCode)->first();
                if (!$seat) {
                    Log::error('Seat not found', ['seat_code' => $seatCode]);
                    return response()->json(['error' => 'Seat not found'], 404);
                }

                // Check if the seat is already booked for the selected date and time
                $existingBooking = Booking::where('seat_code', $seatCode)
                    ->where('date', $validatedData['date'])
                    // ->where('time', $validatedData['time'])
                    ->where('service_id', $validatedData['service_id'])
                    ->first();

                if ($existingBooking) {
                    Log::warning('Seat already booked', [
                        'seat_code' => $seatCode,
                        'date' => $validatedData['date'],
                        // 'time' => $validatedData['time'],
                    ]);
                    return response()->json(['error' => 'Seat is already booked for the selected date and time'], 400);
                }

                Log::info('Seat validated successfully', ['seat_code' => $seatCode]);
            }


            // Find or create the customer
            $customer = Customer::firstOrCreate(
                ['email' => $validatedData['email']],
                [
                    'name' => $validatedData['name'],
                    'contact_number' => $validatedData['contact_number']
                ]
            );

            Log::info('Customer found or created', ['customer_id' => $customer->id, 'customer_email' => $validatedData['email']]);

            // Retrieve the pass for the customer if it exists
            $pass = Pass::where('customer_id', $customer->id)->first();
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
            }

            Log::info('Pass type determined', ['pass_type' => $validatedData['pass_type']]);
            Log::info('HERE', ['seat_code' => $seatCode]);
            // Create the booking
            $bookingData = array_merge($validatedData, [
                'status' => 'Pending',
                'seat_code' => $seatCode, // Make sure this is included in the merge
                'customer_id' => $customer->id,
            ]);

            // Log booking data before creation for debugging
            Log::info('Booking data before save', ['booking_data' => $bookingData]);

            // Create the booking
            $booking = new Booking($bookingData);
            $saved = $booking->save();

            Log::info('Booking created successfully', ['booking_id' => $booking->id, 'customer_id' => $customer->id]);

            // Create a 15-day pass if applicable (e.g., if service ID is 40)
            if ($service->id == 4) { // Assuming 40 is the ID for the 15-day pass service
                Log::info('Creating a 15-day pass for the customer', ['customer_id' => $customer->id]);
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

            Log::info('Booking and pass creation process completed');

            return response()->json(['booking' => $booking, 'id' => $booking->id, 'customerID' => $customer->id], 201);
        } catch (\Exception $e) {
            Log::error('Error occurred while processing booking', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }


    //SENDING RECEIPT MAIL
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
            'customer_id' => 'nullable|integer', // Add validation for customer_id
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
            'customer_id' => $validatedData['customer_id'] ?? 'N/A', // Include customer_id or 'N/A' if not provided
        ];

        // Send the email
        try {
            Log::info('Sending email to: ' . $validatedData['email']);
            Mail::to($validatedData['email'])->send(new BookingSummaryMail($bookingDetails));
            Log::info('Email sent successfully to: ' . $validatedData['email']);
            return response()->json(['message' => 'Email sent successfully!'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to send booking email: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send email. Please try again later.'], 500);
        }
    }

    //SENDING CANCELLATION EMAIL
    public function cancelBooking($refNumber)
    {
        try {
            Log::info("Cancel booking initiated for refNumber: $refNumber");

            // Retrieve booking by reference number
            $booking = Booking::where('refNumber', $refNumber)->first();

            if (!$booking) {
                Log::warning("Booking not found for refNumber: $refNumber");
                return response()->json(['message' => 'Booking not found'], 404);
            }

            // Update booking status to 'Canceled'
            $booking->status = 'Canceled';
            $booking->save();
            Log::info("Booking status updated to 'Canceled' for refNumber: $refNumber");

            // Send cancellation confirmation email
            Mail::to($booking->email)->send(new CancellationConfirmationMail($booking));
            Log::info("Cancellation confirmation email sent to: {$booking->email}");

            return response()->json(['message' => 'Booking canceled successfully.']);
        } catch (\Exception $e) {
            Log::info('Test log before error handling');
            Log::error("Cancellation failed for refNumber $refNumber: " . $e->getMessage());
            return response()->json(['message' => 'Cancellation failed'], 500);
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
        // Validate incoming request
        $validatedData = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'pass_id' => 'required|exists:passes,pass_id',
        ]);

        // Retrieve the customer
        $customer = Customer::find($validatedData['customer_id']);

        // Find the pass with matching customer_id and pass_id
        $pass = Pass::where('pass_id', $validatedData['pass_id'])
            ->where('customer_id', $customer->id)
            ->where('remaining_days', '>', 0)
            ->first();

        if (!$pass) {
            return response()->json(['error' => 'No valid pass found for this customer'], 404);
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
