<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ChartDataController;
use App\Http\Controllers\FeedbackController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;

use App\Http\Controllers\AdminBlogController;


Route::post('/notifications', [NotificationController::class, 'createNotification']);
Route::get('/notifications', [NotificationController::class, 'index']);
Route::delete('/notifications/{id}', [NotificationController::class, 'softDelete']);
Route::patch('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);


Route::middleware('auth:sanctum')->get('/admin', function (Request $request) {
    return $request->admin();
});

Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings', [BookingController::class, 'index']);
Route::get('/bookings/{refNumber}', [BookingController::class, 'show']);
// Define the routes for success and cancel callback within the same controller
Route::get('/booking-successful', [BookingController::class, 'paymentSuccess'])->name('booking.payment.success');
Route::get('/booking-canceled', [BookingController::class, 'paymentCanceled'])->name('booking.payment.cancel');


Route::post('/check-pass', [BookingController::class, 'checkPass']);
Route::post('/check-pass-by-reference', [BookingController::class, 'checkPassByReference']);
Route::post('/use-pass', [BookingController::class, 'usePass']);


Route::post('/customers', [CustomerController::class, 'store']);
Route::get('/customers', [CustomerController::class, 'index']);
Route::get('/customers/{id}', [CustomerController::class, 'show']);

Route::post('/messages', [MessageController::class, 'store']);
Route::get('/messages', [MessageController::class, 'index']);

Route::get('/services', [ServiceController::class, 'index']);
Route::post('/services', [ServiceController::class, 'create']);
Route::get('/services/{id}', [ServiceController::class, 'read']);
Route::post('/services/{id}', [ServiceController::class, 'update']);
Route::patch('/services-availability/{id}', [ServiceController::class, 'updateAvailability']);
Route::get('/services-availability', [ServiceController::class, 'getAvailableSeats']);
Route::delete('/services/{id}', [ServiceController::class, 'delete']);
Route::get('/available', [ServiceController::class, 'available']);
Route::patch('/services/{id}/available-seats', [ServiceController::class, 'updateAvailableSeats']);

Route::get('/feedbacks', [FeedbackController::class, 'index']);
Route::patch('/feedbacks/{feedbackId}', [FeedbackController::class, 'update']);
Route::post('/bookings/cancel/{refNumber}', [BookingController::class, 'cancel']);
Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus']);

Route::get('/payments', [PaymentController::class, 'index']);

Route::get('/admin-dashboard-data', [AdminDashboardController::class, 'getData']);
Route::get('/booking-data', [AdminDashboardController::class, 'getMappingData']);
Route::post('/free-up-seat', [AdminDashboardController::class, 'freeUpSeat']);
Route::post('/admins', [AuthController::class, 'login']);

Route::post('/update-username', [AdminController::class, 'changeUsername']);
Route::post('/update-password', [AdminController::class, 'changePassword']);
Route::post('/update-security-question', [AdminController::class, 'updateSecurityQuestion']);
Route::post('/reset-password', [AdminController::class, 'forgotPassword']);
Route::post('/check-username', [AdminController::class, 'findUsername']);
Route::post('/check-security', [AdminController::class, 'verifySecurity']);
Route::post('/change-password', [AdminController::class, 'updatePassword']);


Route::get('/admin-dashboard', [AdminController::class, 'dashboard'])->middleware('admin.auth');


Route::get('/booking-chart-data', [ChartDataController::class, 'booking']);
Route::get('/top-customers-data', [ChartDataController::class, 'topCustomers']);
Route::get('/user-growth-data', [ChartDataController::class, 'userGrowth']);

Route::get('blogs', [AdminBlogController::class, 'index']);
Route::post('blogs', [AdminBlogController::class, 'store']); // Includes image upload
Route::get('blogs/{id}', [AdminBlogController::class, 'show']);
Route::put('blogs/{id}', [AdminBlogController::class, 'update']);
Route::delete('blogs/{id}', [AdminBlogController::class, 'destroy']);

use Illuminate\Support\Facades\Mail;

Route::post('/send-receipt', [BookingController::class, 'sendEmailReceipt']);
Route::post('/bookings/cancel/{refNumber}', [BookingController::class, 'cancelBooking']);

Route::post('/create-checkout-session', [PaymentController::class, 'createCheckoutSession'])->middleware('throttle:5,1');
Route::post('/webhook', [PaymentController::class, 'handleWebhook']);

// Route::post('test-upload', function (Request $request) {
//     if ($request->hasFile('image')) {
//         $uploadResult = cloudinary()->upload($request->file('image')->getRealPath(), ['folder' => 'blogs']);
//         return response()->json($uploadResult);
//     }
//     return response()->json(['error' => 'No file uploaded'], 400);
// });
