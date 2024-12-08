<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::all();
        return response()->json($payments);
    }
// lipat ko sa booking, may error kapag iniimport seht
    // public function createCheckoutSession(Request $request)
    // {
    //     Log::info('Request Data:', ['data' => $request->all()]);

    //     // Extract booking details from the request
    //     $bookingDetails = $request->input('booking_details');
    //     $serviceName = $bookingDetails['service_name']; // Get service_name from booking details

    //     $price = $bookingDetails['price']; // Get price from booking details

    //     // Serialize your booking details to URL parameters
    //     $successUrl = 'http://localhost:3000/booking-successful?state=' . urlencode(json_encode($bookingDetails));

    //     $client = new Client();
    //     $maxRetries = 3;
    //     $retryDelay = 100; // in milliseconds

    //     for ($i = 0; $i < $maxRetries; $i++) {
    //         try {
    //             $response = $client->post('https://api.paymongo.com/v1/checkout_sessions', [
    //                 'headers' => [
    //                     'Authorization' => 'Basic ' . base64_encode(env('PAYMONGO_SECRET_KEY') . ':'),
    //                     'Content-Type' => 'application/json',
    //                 ],
    //                 'json' => [
    //                     'data' => [
    //                         'attributes' => [
    //                             'description' => "Booking for: " . $serviceName, // Set service name as description
    //                             'line_items' => [
    //                                 [
    //                                     'name' => $serviceName,  // Set service_name as line item name
    //                                     'amount' => (int)($price * 100), // Convert price to cents
    //                                     'currency' => 'PHP',
    //                                     'quantity' => 1,
    //                                 ],
    //                             ],
    //                             'payment_method_types' => ['card', 'paymaya', 'gcash'],
    //                             // Replace the routes with full URLs
    //                             'success_url' => $successUrl, // Direct URL for success
    //                             'cancel_url' => 'http://localhost:3000/booking-canceled',  // Direct URL for cancel
    //                             // You can store or send the booking details to PayMongo if needed
    //                             'metadata' => [
    //                                 'booking_details' => $bookingDetails, // Pass the customer booking data as metadata
    //                             ]
    //                         ]
    //                     ]
    //                 ],
    //             ]);

    //             $body = json_decode($response->getBody(), true);
    //             $checkoutUrl = $body['data']['attributes']['checkout_url'];

    //             return response()->json(['checkout_url' => $checkoutUrl]);
    //         } catch (\GuzzleHttp\Exception\ClientException $e) {
    //             if ($e->getResponse()->getStatusCode() === 429 && $i < $maxRetries - 1) {
    //                 usleep($retryDelay * 1000); // Delay before retrying
    //                 $retryDelay *= 2; // Exponential backoff
    //                 Log::warning('Rate limit exceeded for PayMongo API: Too many requests');
    //             } else {
    //                 Log::error('Error creating checkout session: ' . $e->getMessage());
    //                 return response()->json(['error' => 'Failed to create checkout session', 'details' => $e->getMessage()], 500);
    //             }
    //         }
    //     }
    // }


    public function retrieveCheckoutSession($sessionId)
    {
        $client = new Client();

        try {
            $response = $client->get("https://api.paymongo.com/v1/checkout_sessions/{$sessionId}", [
                'headers' => [
                    'Authorization' => 'Basic ' . base64_encode(env('PAYMONGO_SECRET_KEY') . ':'),
                    'Content-Type' => 'application/json',
                ],
            ]);

            $session = json_decode($response->getBody(), true);

            return response()->json($session);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $responseBody = json_decode($e->getResponse()->getBody(), true);
            Log::error('Error creating checkout session: ', [
                'message' => $e->getMessage(),
                'response' => $responseBody, // Log request data for debugging
            ]);

            return response()->json([
                'error' => 'Failed to create checkout session',
                'details' => $responseBody['errors'] ?? $e->getMessage()
            ], 500);
        }
    }

    public function expireCheckoutSession($sessionId)
    {
        $client = new Client();

        try {
            $client->post("https://api.paymongo.com/v1/checkout_sessions/{$sessionId}/expire", [
                'headers' => [
                    'Authorization' => 'Basic ' . base64_encode(env('PAYMONGO_SECRET_KEY') . ':'),
                    'Content-Type' => 'application/json',
                ],
            ]);

            return response()->json(['message' => 'Checkout session expired successfully']);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            Log::error('Error expiring checkout session: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to expire checkout session',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function handleWebhook(Request $request)
    {
        $signature = $request->header('paymongo-signature');
        $payload = $request->getContent();

        if (!$signature || !$this->isValidSignature($payload, $signature)) {
            Log::warning('Invalid webhook signature', ['payload' => $payload]);
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        $eventType = $request->input('data.attributes.type');
        $paymentId = $request->input('data.attributes.data.id');

        try {
            if ($eventType === 'payment_succeeded') {
                Payment::where('payment_id', $paymentId)->update(['status' => 'succeeded']);
            } elseif ($eventType === 'payment_failed') {
                Payment::where('payment_id', $paymentId)->update(['status' => 'failed']);
            }
        } catch (\Exception $e) {
            Log::error('Error processing webhook: ' . $e->getMessage());
            return response()->json(['message' => 'Internal server error'], 500);
        }

        return response()->json(['message' => 'Webhook processed'], 200);
    }

    private function isValidSignature($payload, $signature)
    {
        $computedSignature = hash_hmac('sha256', $payload, env('PAYMONGO_WEBHOOK_SECRET'));
        return hash_equals($computedSignature, $signature);
    }

    public function handleSuccess(Request $request)
    {
        Log::info('handleSuccess triggered');

        // Log the entire request data to debug
        Log::info('Request Data: ' . json_encode($request->all()));

        $sessionId = $request->query('session_id');
        Log::info('Session ID: ' . $sessionId);

        if (!$sessionId) {
            Log::error('Session ID is missing');
            return redirect('http://localhost:3000/booking')->with('status', 'failed');
        }

        $client = new Client();

        try {
            $response = $client->get("https://api.paymongo.com/v1/checkout_sessions/{$sessionId}", [
                'headers' => [
                    'Authorization' => 'Basic ' . base64_encode(env('PAYMONGO_SECRET_KEY') . ':'),
                    'Content-Type' => 'application/json',
                ],
            ]);

            $data = json_decode($response->getBody(), true);
            $status = $data['data']['attributes']['status'];

            Log::info('Checkout session data: ' . json_encode($data));

            if ($status === 'succeeded') {
                Log::info('Payment succeeded, redirecting to success URL');
                return redirect('http://localhost:3000/payment')->with('status', 'success');
            }

            Log::info('Payment failed, redirecting to booking');
            return redirect('http://localhost:3000/booking')->with('status', 'failed');
        } catch (\Exception $e) {
            Log::error('Error retrieving checkout session: ' . $e->getMessage());
            return redirect('http://localhost:3000/booking')->with('status', 'failed');
        }
    }



    public function handleFailure(Request $request)
    {
        return redirect('http://localhost:3000/booking')->with('status', 'failed');
    }
}
