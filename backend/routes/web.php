<?php

use Illuminate\Support\Facades\Route;

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
