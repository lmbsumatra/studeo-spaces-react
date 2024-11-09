<?php

namespace App\Http\Controllers;

use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\ServiceAvailability;

class ServiceController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'duration' => 'required|string|max:255',
            'price' => 'required|numeric',
            'images' => 'nullable|string',
            'description' => 'nullable|string',
            'count' => 'required|integer',
            'availability' => 'sometimes|boolean',
        ]);

        $service = Service::create($validatedData);

        return response()->json($service, 201);
    }

    public function index()
    {
        $services = Service::all();

        // Fetch availability data for each service
        // foreach ($services as $service) {
        //     $availability = ServiceAvailability::where('service_id', $service->id)
        //         ->where('date', Carbon::now()->setTimezone('Asia/Manila')->format('Y-m-d')) // Or any specific date
        //         ->first();

        // }

        return response()->json($services);
    }


    public function available(Request $request)
    {
        $date = $request->query('date');

        // Fetch services and calculate bookings count for the selected date
        $services = Service::leftJoin('bookings', function ($join) use ($date) {
            $join->on('services.id', '=', 'bookings.service_id')
                ->where('bookings.date', '=', $date);
        })
            ->select('services.id', 'services.name', 'services.count') // Select relevant fields
            ->selectRaw('COUNT(bookings.id) as bookings_count') // Count the number of bookings
            ->groupBy('services.id', 'services.name', 'services.count') // Group by necessary columns
            ->get();

        $result = $services->map(function ($service) {
            // Assuming 'default_count' holds the total available count for each service
            $availableSeats = $service->count ?? 0; // Default available count
            $bookingsCount = $service->bookings_count ?? 0; // Count of bookings for the date

            // Calculate available seats
            $finalAvailableSeats = max($availableSeats - $bookingsCount, 0); // Ensure non-negative value

            return [
                'service_id' => $service->id,
                'available_seats' => $finalAvailableSeats,
            ];
        });

        return response()->json($result);
    }



    public function updateAvailableSeats(Request $request, $id)
    {
        $validatedData = $request->validate([
            'available_seats' => 'required|integer|min:0',
        ]);

        $availability = ServiceAvailability::where('service_id', $id)
            ->where('date', Carbon::now()->setTimezone('Asia/Manila')->format('Y-m-d')) // Use today's date
            ->first();

        if ($availability) {
            $availability->update(['available_seats' => $validatedData['available_seats']]);
        } else {
            // If no entry exists, you might want to create one or handle this case as needed
            ServiceAvailability::create([
                'service_id' => $id,
                'date' => Carbon::now()->setTimezone('Asia/Manila')->format('Y-m-d'),
                'available_seats' => $validatedData['available_seats'],
            ]);
        }

        return response()->json(['message' => 'Available seats updated successfully'], 200);
    }


    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'duration' => 'required|string|max:255',
            'price' => 'required|numeric',
            'images' => 'nullable|string',
            'description' => 'nullable|string',
            'count' => 'required|integer',
        ]);

        $service = Service::create($validatedData);

        return response()->json($service, 201);
    }


    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'duration' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric',
            'images' => 'nullable|string',
            'description' => 'nullable|string',
            'count' => 'sometimes|integer|min:0',
            'availability' => 'required|boolean',
        ]);

        $service->update($validatedData);

        return response()->json($service, 200);
    }

    public function delete(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        $service->delete();

        return response()->json(['message' => 'Service deleted successfully'], 200);
    }

    public function updateAvailability(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        $validatedData = $request->validate([
            'availability' => 'required|boolean',
        ]);

        $service->update(['availability' => $validatedData['availability']]);

        return response()->json($service, 200);
    }

    public function getAvailableSeats(Request $request)
    {
        // Get current date
        $currentDate = Carbon::now()->setTimezone('Asia/Manila')->format('Y-m-d');


        // Debugging
        // echo "Current Date: $currentDate"; // Output current date for debugging

        // Query for available seats for today's date
        $availability = ServiceAvailability::where('date', $currentDate)->get();

        // Debugging
        // echo "Availability: " . json_encode($availability); // Output availability for debugging

        // Return response as JSON
        return response()->json($availability);
    }


    public function read(Request $request, $id)
    {
        $service = Service::find($id);

        return response()->json($service);
    }
}
