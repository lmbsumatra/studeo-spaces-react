<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings', [BookingController::class, 'index']);
Route::get('/bookings/{refNumber}', [BookingController::class, 'show']);

Route::post('/customers', [CustomerController::class, 'store']);
Route::get('/customers', [CustomerController::class, 'index']);
Route::get('/customers/{id}', [CustomerController::class, 'show']);

Route::post('/messages', [MessageController::class, 'store']);
Route::get('/messages', [MessageController::class, 'index']);

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/available', [ServiceController::class, 'available']);

Route::post('/bookings/cancel/{refNumber}', [BookingController::class, 'cancel']);
Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus']);

Route::get('/admin-dashboard-data', [AdminDashboardController::class, 'getData']);
Route::post('/admins', [AuthController::class, 'login']);

Route::get('/admin-dashboard', [AdminController::class, 'dashboard'])->middleware('admin.auth');
