<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Carbon\Carbon;

class ChartDataController extends Controller
{
    public function booking()
    {
        // Fetch all bookings with their relations
        $bookings = Booking::with(['customer', 'service'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Aggregate bookings by date
        $bookingsByDate = $bookings->groupBy(function ($booking) {
            return Carbon::parse($booking->created_at)->format('Y-m-d'); // Grouping by date
        });

        // Daily aggregation
        $dailyData = $bookingsByDate->map(function ($day) {
            return [
                'date' => $day->first()->created_at->format('Y-m-d'), // Get the date
                'total_bookings' => $day->count(), // Count of bookings for that date
            ];
        })->values(); // Reset keys to 0, 1, 2...

        // Weekly aggregation
        $bookingsByWeek = $bookings->groupBy(function ($booking) {
            return Carbon::parse($booking->created_at)->format('o-W'); // Grouping by year and week number
        });

        $weeklyData = $bookingsByWeek->map(function ($week) {
            return [
                'week' => $week->first()->created_at->format('o-W'), // Year-Week format
                'total_bookings' => $week->count(), // Count of bookings for that week
            ];
        })->values(); // Reset keys to 0, 1, 2...

        // Monthly aggregation
        $bookingsByMonth = $bookings->groupBy(function ($booking) {
            return Carbon::parse($booking->created_at)->format('Y-m'); // Grouping by year and month
        });

        $monthlyData = $bookingsByMonth->map(function ($month) {
            return [
                'month' => $month->first()->created_at->format('Y-m'), // Year-Month format
                'total_bookings' => $month->count(), // Count of bookings for that month
            ];
        })->values(); // Reset keys to 0, 1, 2...

        // Combine all data
        return response()->json([
            'daily' => $dailyData,
            'weekly' => $weeklyData,
            'monthly' => $monthlyData,
        ]);
    }

    public function topCustomers()
    {
        // Fetch all bookings with their relations
        $bookings = Booking::with('customer')->get();

        // Top 3 customers by total bookings
        $topCustomers = $bookings->groupBy('customer_id') // Group by customer ID
            ->map(function ($group) {
                return [
                    'customer_id' => $group->first()->customer->id,
                    'customer_name' => $group->first()->customer->name,
                    'total_bookings' => $group->count(),
                ];
            })
            ->sortByDesc('total_bookings') // Sort customers by total bookings
            ->take(3) // Get top 3 customers
            ->values(); // Reset keys to 0, 1, 2...

        return response()->json($topCustomers); // Return the top customers as JSON
    }

    public function userGrowth()
    {
        // Fetch all bookings with their relations
        $bookings = Booking::with('customer')->get();

        // Group by date and count unique customers
        $userGrowthData = $bookings->groupBy(function ($booking) {
            return Carbon::parse($booking->created_at)->format('Y-m-d'); // Grouping by date
        })->map(function ($day) {
            return [
                'date' => $day->first()->created_at->format('Y-m-d'),
                'new_users' => $day->unique('customer_id')->count(), // Count of unique customers
            ];
        })->values(); // Reset keys to 0, 1, 2...

        return response()->json($userGrowthData); // Return user growth data as JSON
    }
}
