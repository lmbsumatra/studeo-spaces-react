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
use App\Models\Payment;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingSummaryMail;
use App\Mail\CancellationConfirmationMail;
use GuzzleHttp\Client;

class BookingController extends Controller
{
    private function generatePassReference()
    {
        Log::info('Generating pass reference');
        do {
            $reference = 'PASS-' . strtoupper(substr(md5(uniqid()), 0, 8));
        } while (Pass::where('reference_number', $reference)->exists());
        Log::info('Generated pass reference', ['reference' => $reference]);

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
            $validatedData['service_name'] = $service->name;
    
            // Determine pass type and payment method
            $passDetails = $this->determinePassType($customer = $this->findOrCreateCustomer($validatedData));
            $validatedData = array_merge($validatedData, $passDetails);
    
            // Begin database transaction
            DB::beginTransaction();
    
            // Validate the seat
            $seat = $this->validateSeat($validatedData, $validatedData['seat_code'] ?? null, $validatedData['pass_type'] === 'Shared');
            if (!$seat) {
                Log::warning('No available seat found or seat already booked', [
                    'service_id' => $validatedData['service_id'],
                    'date' => $validatedData['date'],
                ]);
                DB::rollBack();
                return response()->json(['error' => 'No available seats for this service at the selected date and time'], 400);
            }
            $validatedData['seat_code'] = $seat->seat_code;
    
            // Create the booking
            $bookingData = array_merge($validatedData, [
                'status' => 'Pending',
                'customer_id' => $customer->id,
            ]);
            $booking = new Booking($bookingData);
            $booking->save();
            $booking['service_name'] = $service->name;
    
            Log::info('Booking created successfully', ['booking_id' => $booking->id, 'customer_id' => $customer->id]);
    
            // Create a 15-day pass if applicable
            if ($service->id == 4) { // Assuming 4 is the ID for the 15-day pass service
                Log::info('Creating a 15-day pass for the customer', ['customer_id' => $customer->id]);
                Pass::create([
                    'customer_id' => $customer->id,
                    'total_days' => 15,
                    'remaining_days' => 15,
                    'total_bullets' => 15,
                    'remaining_bullets' => 15,
                    'is_shared' => false,
                    'reference_number' => $this->generatePassReference(),
                ]);
            }
    
            // Commit the transaction
            DB::commit();
    
            // Create checkout session
            Log::info('Creating checkout session');
            $checkoutResponse = $this->createCheckoutSession($booking, $service->name);
            $checkoutResponseBody = json_decode($checkoutResponse->getContent(), true);
    
            if (isset($checkoutResponseBody['checkout_url'])) {
                return response()->json([
                    'booking' => $booking,
                    'id' => $booking->id,
                    'customerID' => $customer->id,
                    'checkout_url' => $checkoutResponseBody['checkout_url'],
                ], 201);
            }
    
            return response()->json(['error' => 'Checkout session creation failed'], 500);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error occurred while processing booking', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }
    
    /**
     * Validate seat availability and return a seat instance.
     */
    private function validateSeat($validatedData, $seatCode = null, $isSharedPass = false)
    {
        Log::info('Validating seat availability', [
            'seat_code' => $seatCode,
            'date' => $validatedData['date'],
            'service_id' => $validatedData['service_id'],
            'is_shared_pass' => $isSharedPass
        ]);
    
        // Step 1: Get all seat codes with 'Completed' bookings for the given date and service
        Log::info('Fetching completed seat codes for the given date and service', [
            'date' => $validatedData['date'],
            'service_id' => $validatedData['service_id']
        ]);
    
        $completedSeatCodes = Booking::where('date', $validatedData['date'])
            ->where('service_id', $validatedData['service_id'])
            ->where('status', 'Completed')
            ->pluck('seat_code') // Get only the seat codes
            ->toArray();
    
        Log::info('Completed seat codes retrieved', ['completed_seat_codes' => $completedSeatCodes]);
    
        // If no seat code is provided, find an available seat excluding the completed ones
        if (!$seatCode) {
            Log::info('No seat code provided, searching for available seats excluding completed bookings');
    
            $availableSeats = Seat::where('service_id', $validatedData['service_id'])
                ->whereNotIn('seat_code', $completedSeatCodes)  // Exclude completed bookings
                ->get();
    
            if ($availableSeats->isEmpty()) {
                Log::warning('No available seats found for the given service');
                return null;
            }
    
            Log::info('Available seats found', ['available_seat_code' => $availableSeats->first()->seat_code]);
            return $availableSeats->first();  // Return the first available seat
        }
    
        // Step 2: Find the seat with the given seat code
        Log::info('Looking for seat with the provided seat code', ['seat_code' => $seatCode]);
    
        $seat = Seat::where('seat_code', $seatCode)
            ->where('service_id', $validatedData['service_id'])
            ->first();
    
        if (!$seat) {
            Log::error('Seat not found or does not match service', ['seat_code' => $seatCode]);
            return null;
        }
    
        Log::info('Seat found', ['seat_code' => $seatCode]);
    
        // Step 3: Check if there is an existing 'Completed' booking for this seat and date
        if (in_array($seatCode, $completedSeatCodes)) {
            Log::warning('Seat is already booked (Completed status)', [
                'seat_code' => $seatCode,
                'date' => $validatedData['date'],
                'service_id' => $validatedData['service_id']
            ]);
            return null;  // Seat is not available if there is a completed booking
        }
    
        // Step 4: For shared passes, add an extra check to prevent overbooking with shared pass
        if ($isSharedPass) {
            Log::info('Checking if seat is already booked with a shared pass', ['seat_code' => $seatCode]);
    
            $sharedPassBooking = Booking::where('seat_code', $seatCode)
                ->where('date', $validatedData['date'])
                ->where('service_id', $validatedData['service_id'])
                ->where('payment_method', 'Shared Pass')
                ->whereNot('status', 'Completed')  // Exclude completed shared pass bookings
                ->first();
    
            if ($sharedPassBooking) {
                Log::warning('Seat is already booked with a shared pass', [
                    'seat_code' => $seatCode,
                    'shared_pass_booking_id' => $sharedPassBooking->id
                ]);
                return null;
            }
    
            Log::info('No shared pass booking found for the seat');
        }
    
        Log::info('Seat is available for booking', ['seat_code' => $seat->seat_code]);
        return $seat;  // If no issues, return the seat
    }
    
    
    /**
     * Find or create a customer based on validated data.
     */
    private function findOrCreateCustomer($validatedData)
    {
        Log::info('Looking for customer or creating a new one', ['email' => $validatedData['email']]);
        return Customer::firstOrCreate(
            ['email' => $validatedData['email']],
            [
                'name' => $validatedData['name'],
                'contact_number' => $validatedData['contact_number'],
            ]
        );
    }

    /**
     * Determine pass type and payment method for the customer.
     */
    private function determinePassType($customer)
    {
        $pass = Pass::where('customer_id', $customer->id)->first();
        if ($pass) {
            if (PassShare::where('pass_id', $pass->id)->where('shared_with_customer_id', $customer->id)->exists()) {
                Log::info('Pass type determined: Shared Pass', ['customer_id' => $customer->id]);
                return ['pass_type' => 'Shared', 'payment_method' => 'Shared Pass'];
            }
            Log::info('Pass type determined: Owner Pass', ['customer_id' => $customer->id]);
            return ['pass_type' => 'Owner', 'payment_method' => 'Shared Pass'];
        }
        Log::info('Pass type determined: Regular', ['customer_id' => $customer->id]);
        return ['pass_type' => 'Regular'];
    }

    public function createCheckoutSession(Booking $booking, $serviceName)
    {
        Log::info('Creating checkout session for booking', ['booking_id' => $booking->id]);

        // Extract booking details from the booking model
        $bookingDetails = $booking->toArray();
        Log::info('Extracted booking details', ['booking_details' => $bookingDetails]);

        // Get the service object (assuming you have a relation with the Service model)
        $price = $booking->price;  // Assuming price is stored in the bookings table
        Log::info('Service Name and Price', ['service_name' => $serviceName, 'price' => $price]);

        // Create success and cancel URLs with booking details
        $successUrl = route('booking.payment.success', ['state' => urlencode(json_encode($bookingDetails))]);
        $cancelUrl = route('booking.payment.cancel', ['state' => urlencode(json_encode($bookingDetails))]);

        Log::info('Success and Cancel URLs created', ['success_url' => $successUrl, 'cancel_url' => $cancelUrl]);

        $client = new Client();
        $maxRetries = 3;
        $retryDelay = 100; // in milliseconds
        Log::info('Max retries set', ['max_retries' => $maxRetries]);

        for ($i = 0; $i < $maxRetries; $i++) {
            try {
                Log::info("Attempting to create checkout session, attempt #$i");

                $response = $client->post('https://api.paymongo.com/v1/checkout_sessions', [
                    'headers' => [
                        'Authorization' => 'Basic ' . base64_encode(env('PAYMONGO_SECRET_KEY') . ':'),
                        'Content-Type' => 'application/json',
                    ],
                    'json' => [
                        'data' => [
                            'attributes' => [
                                'description' => "Booking for: " . $serviceName,
                                'line_items' => [
                                    [
                                        'name' => $serviceName,
                                        'amount' => (int)($price * 100), // Convert price to cents
                                        'currency' => 'PHP',
                                        'quantity' => 1,
                                    ],
                                ],
                                'payment_method_types' => ['card', 'paymaya', 'gcash'],
                                'success_url' => $successUrl,
                                'cancel_url' => $cancelUrl,
                                'metadata' => [
                                    'booking_details' => $bookingDetails, // Pass the customer booking data as metadata
                                    'id' => $booking->id,
                                ]
                            ]
                        ]
                    ]
                ]);

                // Log the API response from PayMongo
                $body = json_decode($response->getBody(), true);
                Log::info('Checkout session created successfully', ['response' => $body]);

                $checkoutUrl = $body['data']['attributes']['checkout_url'];
                Log::info('Checkout URL received', ['checkout_url' => $checkoutUrl]);

                unset($booking['service_name']);

                // Update booking with checkout_url from PayMongo API (Optional)
                $booking->update(['checkout_url' => $checkoutUrl]);
                Log::info('Booking updated with checkout URL', ['booking_id' => $booking->id]);

                $checkoutUrl = $body['data']['attributes']['checkout_url'] ?? null;
                if (!$checkoutUrl) {
                    Log::error('No checkout URL in PayMongo response', ['response_body' => $body]);
                    return response()->json(['error' => 'Failed to create checkout session, no URL returned'], 500);
                }

                // Return checkout URL to frontend
                return response()->json(['checkout_url' => $checkoutUrl]);
            } catch (\GuzzleHttp\Exception\ClientException $e) {
                Log::error('Error during checkout session creation', [
                    'error' => $e->getMessage(),
                    'response_code' => $e->getResponse()->getStatusCode(),
                    'response_body' => (string) $e->getResponse()->getBody(),  // Log the body of the response for more details
                    'attempt' => $i + 1
                ]);

                // Retry logic
                if ($e->getResponse()->getStatusCode() === 429 && $i < $maxRetries - 1) {
                    usleep($retryDelay * 1000); // Delay before retrying
                    $retryDelay *= 2; // Exponential backoff
                    Log::warning('Rate limit exceeded for PayMongo API: Too many requests');
                } else {
                    Log::error('Final attempt failed to create checkout session', [
                        'exception' => $e->getMessage(),
                        'response' => (string) $e->getResponse()->getBody()  // Log full response on final failure
                    ]);
                    return response()->json(['error' => 'Failed to create checkout session', 'details' => $e->getMessage()], 500);
                }
            }
        }
    }
    public function paymentSuccess(Request $request)
    {
        Log::info('Payment success callback received', ['request_data' => $request->all()]);

        // Decode the booking details passed in the query string
        $bookingDetails = json_decode(urldecode($request->query('state')), true);
        Log::info('Booking details for success:', ['booking_details' => $bookingDetails]);

        // Find the booking by its ID
        $booking = Booking::find($bookingDetails['id']);
        if ($booking) {
            // Update the booking status to "Completed"
            $booking->status = 'Completed';

            // Additional logic for shared pass
            if ($booking->payment_method === 'Shared Pass') {
                Log::info('Shared pass booking marked as completed', ['booking_id' => $booking->id]);
                $booking->status = 'Completed'; // Explicitly ensure the status is completed
            }

            $booking->save();
            Log::info('Booking status updated to completed', ['booking_id' => $booking->id]);

            // Create a Payment entry linked to the booking
            $payment = new Payment([
                'booking_id' => $booking->id,
                'customer_name' => $booking->name, // Assuming 'name' exists in the booking model
                'amount' => $booking->price,       // Assuming 'price' is stored in the booking
                'date' => now(),                   // Payment date is the current timestamp
            ]);
            $payment->save();

            Log::info('Payment entry created successfully', ['payment_id' => $payment->id]);

            $serviceName = $booking->service ? $booking->service->name : 'N/A'; // 'service' is the relationship method on the Booking model

            // Generate the success URL dynamically for the frontend
            $successUrl = 'http://localhost:3000/payment?state=' . urlencode(json_encode([
                'id' => $booking->id,
                'status' => 'Completed',
                'details' => $booking->toArray(), // Include full booking details
                'service_name' => $serviceName,
            ]));

            // Optionally, log the success URL if needed
            Log::info('Redirecting to success URL', ['success_url' => $successUrl]);

            // Redirect the user to the frontend success page
            return redirect()->away($successUrl); // `away()` redirects to an external URL
        }

        Log::error('Booking not found for payment success', ['booking_id' => $bookingDetails['id']]);
        return response()->json(['error' => 'Booking not found'], 404);
    }


    public function paymentCanceled(Request $request)
    {
        Log::info('Payment canceled callback received', ['request_data' => $request->all()]);

        // Decode the booking details passed in the query string
        $bookingDetails = json_decode(urldecode($request->query('state')), true);
        Log::info('Booking details for cancel:', ['booking_details' => $bookingDetails]);

        // Find the booking by its ID
        $booking = Booking::find($bookingDetails['id']);
        if ($booking) {
            // Update the booking status to "Canceled"
            $booking->status = 'Cancelled';
            $booking->save();
            Log::info('Booking status updated to canceled', ['booking_id' => $booking->id]);

            // Generate the cancel URL dynamically for the frontend
            $cancelUrl = 'http://localhost:3000/booking-cancelled?state=' . urlencode(json_encode($bookingDetails));

            // Optionally, log the cancel URL if needed
            Log::info('Redirecting to cancel URL', ['cancel_url' => $cancelUrl]);

            // Redirect the user to the frontend cancel page
            return redirect()->away($cancelUrl); // `away()` redirects to an external URL
        }

        Log::error('Booking not found for payment cancellation', ['booking_id' => $bookingDetails['id']]);
        return response()->json(['error' => 'Booking not found'], 404);
    }


    //SENDING RECEIPT MAIL
    public function sendEmailReceipt(Request $request)
    {
        // Log the incoming request data
        Log::info('Incoming email receipt request:', $request->all());

        // Validate the incoming request
        try {
            $validatedData = $request->validate([
                'email' => 'required|email',
                'service_id' => 'required|integer',
                'date' => 'required|date',
                'time' => 'required',
                'price' => 'required|numeric',
                'refNumber' => 'required|string',
                'customer_id' => 'nullable|integer', // Add validation for customer_id
            ]);
            Log::info('Validation successful. Validated data:', $validatedData);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', $e->errors());
            return response()->json(['error' => 'Validation failed. Please check your input.'], 422);
        }

        // Prepare booking details for the email
        $bookingDetails = [
            'service_id' => $validatedData['service_id'],
            'date' => $validatedData['date'],
            'time' => $validatedData['time'],
            'price' => $validatedData['price'],
            'refNumber' => $validatedData['refNumber'],
            'customer_id' => $validatedData['customer_id'] ?? 'N/A', // Include customer_id or 'N/A' if not provided
        ];

        // Log the booking details before sending the email
        Log::info('Prepared booking details for email:', $bookingDetails);

        // Send the email
        try {
            Log::info('Attempting to send email to: ' . $validatedData['email']);
            Mail::to($validatedData['email'])->send(new BookingSummaryMail($bookingDetails));
            Log::info('Email sent successfully to: ' . $validatedData['email']);
            return response()->json(['message' => 'Email sent successfully!'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to send booking email to ' . $validatedData['email'] . ': ' . $e->getMessage());
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
