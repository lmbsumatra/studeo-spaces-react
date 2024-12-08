<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/view-email', function () {
    $bookingDetails = [
        'service_name' => 'Test Service',
        'date' => '2024-11-25',
        'time' => '10:00 AM',
        'price' => 100,
        'refNumber' => 'REF123456',
    ];
    return view('emails.booking_summary', compact('bookingDetails'));
});

// web.php (Laravel routes)
Route::get('payment-success', [PaymentController::class, 'handleSuccess'])->name('payment.success');
Route::get('payment-failure', [PaymentController::class, 'handleFailure'])->name('payment.failure');

use App\Http\Controllers\BookingController;

// Routes for handling payment success and cancel events
Route::get('/booking-successful', [BookingController::class, 'paymentSuccess'])->name('booking.payment.success');
Route::get('/booking-canceled', [BookingController::class, 'paymentCanceled'])->name('booking.payment.cancel');

