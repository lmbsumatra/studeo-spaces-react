<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Message;
use App\Models\Seat;
use Illuminate\Support\Facades\Log;
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
            return Carbon::parse($booking->created_at)->format('Y-W');  // Format as "Year-Wweek"
        });

        // Map the grouped data to desired output format
        $weeklyData = $bookingsByWeek->map(function ($week) {
            return [
                'period' => $week->first()->created_at->format('Y') . '-W' . $week->first()->created_at->format('W'), // Manually add "W"
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
            ->whereIn('status', ['Completed', 'completed'])
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

        // Get the booking with the nearest time to the current time
        $currentTime = Carbon::now()->setTimezone('Asia/Manila'); // Current time in Manila timezone

        // Find the nearest booking based on time
        $nearestBooking = $upcomingBookings->sortBy(function ($booking) use ($currentTime) {
            // Combine date and time to create a full Carbon object
            $bookingTime = Carbon::parse($booking['date'] . ' ' . $booking['time']);
            return $bookingTime->diffInSeconds($currentTime); // Calculate difference in seconds
        })->first(); // Get the first booking (the one closest to the current time)

        // Log the nearest booking
        Log::info($nearestBooking);

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
            'upcomingBookings' => $upcomingBookings, // List of all upcoming bookings
            'nearestBooking' => $nearestBooking, // Nearest booking to the current time
        ]);
    }


    public function getMappingData(Request $request)
    {
        // Get the selected date (default to today in Manila timezone)
        $selectedDate = $request->input('date', Carbon::now()->setTimezone('Asia/Manila')->toDateString());

        // Define the specific service IDs and their corresponding names
        $servicesData = [];

        // Define your service IDs with names: 1 = Glassbox, 2 = All Day All Night, 5 = Barkadaral 1, 6 = Barkadaral 2
        $serviceConditions = [
            1 => 'Glassbox',              // service_id 1 is Glassbox
            3 => 'All Day All Night',     // service_id 2 is All Day All Night
            5 => 'Barkadaral 1',          // service_id 5 is Barkadaral 1
            6 => 'Barkadaral 2',          // service_id 6 is Barkadaral 2
        ];

        // Iterate over each service_id condition
        foreach ($serviceConditions as $serviceId => $serviceName) {
            // Fetch the service and its booking data for the selected date
            $service = Service::leftJoin('bookings', function ($join) use ($selectedDate, $serviceId) {
                $join->on('services.id', '=', 'bookings.service_id')
                    ->where('bookings.date', '=', $selectedDate)
                    ->where('services.id', '=', $serviceId); // Filter by specific service_id
            })
                ->where('services.id', $serviceId)
                ->select('services.id', 'services.name', 'services.count as totalSeats', 'services.duration')
                ->selectRaw('COUNT(CASE WHEN bookings.status IN ("Completed", "completed") THEN 1 END) as bookedSeats') // Count only completed bookings
                ->groupBy('services.id', 'services.name', 'services.count', 'services.duration')
                ->first(); // We expect only one service

            if (!$service) {
                return response()->json(['error' => "Service ID $serviceId ($serviceName) not found"], 404);
            }

            // Fetch all seats for the service (no floor filter, all seats for the service)
            $seats = Seat::where('service_id', $serviceId) // Ensure we fetch all seats for this service
                ->get(['id', 'seat_code']); // Fetch all seat codes and IDs

            // Now, for each seat, check if it has a completed or completed booking on the selected date
            $seatsWithBookingStatus = $seats->map(function ($seat) use ($selectedDate, $serviceId) {
                // Check if the seat has a completed or completed booking for the selected date
                $booking = Booking::where('service_id', $serviceId)
                    ->where('seat_code', $seat->seat_code)
                    ->where('date', $selectedDate)
                    ->whereIn('bookings.status', ['Completed', 'completed'])  // Status is Completed or completed
                    ->first(); // Fetch the booking data for this seat

                $isBooked = $booking ? true : false; // True if booked, false if not
                return [
                    'id' => $seat->id,
                    'seat_code' => $seat->seat_code,
                    'isBooked' => $isBooked, // Indicate whether the seat is booked
                ];
            });

            // Prepare the response data for the current service
            $servicesData[] = [
                'service_id' => $service->id,
                'service_name' => $service->name,
                'totalSeats' => $service->totalSeats,
                'bookedSeats' => $service->bookedSeats,
                'availableSeats' => $service->totalSeats - $service->bookedSeats,
                'duration' => $service->duration,
                'seats' => $seatsWithBookingStatus, // Include seat data with booking status
            ];
        }

        // Return the data as JSON
        return response()->json($servicesData);
    }

    public function freeUpSeat(Request $request)
    {
        // Log the incoming request details for debugging purposes
        Log::info('freeUpSeat called', [
            'seat_code' => $request->input('seat_code'),
            'date' => $request->input('date', Carbon::now()->setTimezone('Asia/Manila')->toDateString())
        ]);
    
        // Get the seat_code and selected date from the request
        $seatCode = $request->input('seat_code');
        $selectedDate = $request->input('date', Carbon::now()->setTimezone('Asia/Manila')->toDateString());
    
        // Fetch the booking for the seat on the selected date, where isBooked is true
        Log::info('Fetching booking for seat code: ' . $seatCode . ' on date: ' . $selectedDate);
        $booking = Booking::where('seat_code', $seatCode)
            ->where('date', $selectedDate)
            ->whereIn('status', ['Completed', 'completed'])  // Status should be "Completed"
            ->first(); // Fetch the first matching booking
    
        if (!$booking) {
            Log::warning('No booking found with isBooked true and status Completed for seat code: ' . $seatCode . ' on date: ' . $selectedDate);
            return response()->json(['error' => 'No booking found with status "Completed" or "completed" for the given seat.'], 404);
        }
    
        // Log the found booking details before updating
        Log::info('Found booking to update', [
            'seat_code' => $booking->seat_code,
            'date' => $booking->date,
            'current_status' => $booking->status
        ]);
    
        // Change the status to "Done"
        $booking->status = 'Done';
        $booking->save();  // Save the updated booking
    
        // Log the successful update of the booking status
        Log::info('Booking status updated', [
            'seat_code' => $booking->seat_code,
            'new_status' => $booking->status
        ]);
    
        // Return success response
        return response()->json([
            'success' => true,
            'message' => 'Booking status updated to Done, seat freed up.',
            'seat_code' => $seatCode,
            'new_status' => $booking->status,
        ]);
    }
    
}
