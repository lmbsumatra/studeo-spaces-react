<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Message;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function getData(Request $request)
    {
        // Get the selected date (default to today in Manila timezone)
        $selectedDate = $request->input('date', Carbon::now()->setTimezone('Asia/Manila')->toDateString());

        // Get total available seats from services (sum of the 'count' field)
        $totalSeats = Service::sum('count'); // Total capacity of all services
        $bookedSeats = Booking::where('status', 'Completed')
            ->whereDate('date', $selectedDate)
            ->count(); // Count of bookings for the selected date
        $availableSeats = $totalSeats - $bookedSeats;

        // Calculate other metrics for the selected date
        $numberOfCustomers = Customer::whereHas('bookings', function ($query) use ($selectedDate) {
            $query->whereDate('date', $selectedDate);
        })->count();

        $totalSales = Booking::where('status', 'Completed')
            ->whereDate('date', $selectedDate)
            ->sum('price');

        $pendingBookings = Booking::where('status', 'Pending')
            ->whereDate('date', $selectedDate)
            ->count();

        $canceledBookings = Booking::where('status', 'Cancelled')
            ->whereDate('date', $selectedDate)
            ->count();

        // Get the top customers by total bookings
        $topCustomers = Customer::withCount('bookings')
            ->orderByDesc('bookings_count')
            ->limit(3)
            ->get(['name as customer_name', 'bookings_count as total_bookings']);

        // Get the most recent messages (last 5 messages)
        $messages = Message::latest()->take(5)->get();

        // Get booking data for chart (Booking stats for the selected date)
        $bookingChartData = Booking::whereDate('date', $selectedDate)
            ->selectRaw('DATE(date) as booking_date, COUNT(*) as bookings_count')
            ->groupBy('booking_date')
            ->orderBy('booking_date')
            ->get();

        // Aggregate bookings for daily, weekly, and monthly statistics
        $bookings = Booking::with(['customer', 'service'])->orderBy('created_at', 'desc')->get();

        // Aggregate bookings by date (Daily data)
        $bookingsByDate = $bookings->groupBy(function ($booking) {
            return Carbon::parse($booking->created_at)->format('Y-m-d');
        });
        $dailyData = $bookingsByDate->map(function ($day) {
            return [
                'period' => $day->first()->created_at->format('Y-m-d'),
                'total_bookings' => $day->count(),
            ];
        })->values();

        // Aggregate bookings by week (Weekly data)
        $bookingsByWeek = $bookings->groupBy(function ($booking) {
            // Format the 'created_at' of each booking to "Year-Wweek" (e.g., 2024-W47)
            return Carbon::parse($booking->created_at)->format('Y-W');  // Format as "Year-Wweek"
        });

        // Map the grouped data to desired output format
        $weeklyData = $bookingsByWeek->map(function ($week) {
            return [
                // Set the 'period' explicitly adding the "W" for clarity
                'period' => $week->first()->created_at->format('Y') . '-W' . $week->first()->created_at->format('W'),  // Manually add "W"
                // Count the total number of bookings for this week
                'total_bookings' => $week->count(),
            ];
        })->values();  // Reset keys for the resulting array

        // Aggregate bookings by month (Monthly data)
        $bookingsByMonth = $bookings->groupBy(function ($booking) {
            return Carbon::parse($booking->created_at)->format('Y-m');
        });
        $monthlyData = $bookingsByMonth->map(function ($month) {
            return [
                'period' => $month->first()->created_at->format('Y-m'),
                'total_bookings' => $month->count(),
            ];
        })->values();

        // Combine daily, weekly, and monthly data into a unified array for charting
        $combinedData = [
            'daily' => $dailyData,
            'weekly' => $weeklyData,
            'monthly' => $monthlyData,
        ];

        // User growth - Count unique customers by date
        $userGrowthData = $bookings->groupBy(function ($booking) {
            return Carbon::parse($booking->created_at)->format('Y-m-d');
        })->map(function ($day) {
            return [
                'date' => $day->first()->created_at->format('Y-m-d'),
                'new_users' => $day->unique('customer_id')->count(), // Count of unique customers
            ];
        })->values();

        // Get upcoming bookings (for the selected date or in the future)
        $upcomingBookings = Booking::where('date', '>=', $selectedDate)
            ->orderBy('date')
            ->with(['customer:id,name', 'service:id,name']) // Eager load the customer and service
            ->get(['id', 'date', 'status', 'customer_id', 'service_id', 'time']); // Select relevant fields

        // Format the result to include customer_name and service_name
        $upcomingBookings = $upcomingBookings->map(function ($booking) {
            return [
                'id' => $booking->id,
                'date' => $booking->date,
                'status' => $booking->status,
                'customer_id' => $booking->customer_id,
                'service_id' => $booking->service_id,
                'customer_name' => $booking->customer->name, // Accessing customer name
                'service_name' => $booking->service->name,   // Accessing service name
                'time' => $booking->time,
            ];
        });

        // Combine all data for the response
        return response()->json([
            'availableSeats' => $availableSeats,
            'bookedSeats' => $bookedSeats,
            'numberOfCustomers' => $numberOfCustomers,
            'totalSales' => $totalSales,
            'pendingBookings' => $pendingBookings,
            'canceledBookings' => $canceledBookings,
            'topCustomers' => $topCustomers,
            'messages' => $messages,
            'combinedBookingStats' => $combinedData, // This is the combined data
            'userGrowthData' => $userGrowthData,
            'upcomingBookings' => $upcomingBookings, // New field added for upcoming bookings
        ]);
    }

    public function getMappingData(Request $request)
    {
        // Get the selected date (default to today in Manila timezone)
        $selectedDate = $request->input('date', Carbon::now()->setTimezone('Asia/Manila')->toDateString());

        // Get all services and their associated seat count
        $services = Service::all();

        // Initialize an array to hold the mapping data per service
        $serviceData = [];

        foreach ($services as $service) {
            // Get total available seats for this service
            $totalSeats = $service->count;

            // Get the number of bookings made for the selected date for this service
            $bookedSeats = Booking::where('service_id', $service->id)
                ->where('status', 'Completed')
                ->whereDate('date', $selectedDate)
                ->count(); // Count of bookings for the selected date and service

            // Calculate available seats for this service
            $availableSeats = $totalSeats - $bookedSeats;

            // Store the data for this service
            $serviceData[] = [
                'service_id' => $service->id,
                'service_name' => $service->name, // Assuming 'name' is a field in the 'services' table
                'totalSeats' => $totalSeats,
                'bookedSeats' => $bookedSeats,
                'availableSeats' => $availableSeats,
                'duration' => $service->duration,
            ];
        }

        // Return the data as JSON
        return response()->json($serviceData);
    }
}
