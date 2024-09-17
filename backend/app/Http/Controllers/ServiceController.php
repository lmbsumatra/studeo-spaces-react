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
        foreach ($services as $service) {
            $availability = ServiceAvailability::where('service_id', $service->id)
                ->where('date', Carbon::now()->setTimezone('Asia/Manila')->format('Y-m-d')) // Or any specific date
                ->first();

            // If no availability data is found in service_availability, use the count from the services table
            if ($availability) {
                $service->availability = $availability->available_seats;
            } else {
                $service->availability = $service->availability;
            }
        }

        return response()->json($services);
    }


    public function available(Request $request)
    {
        $date = $request->query('date');

        // Fetch services with available_seats information for the selected date, excluding those with availability 0 in services table
        $services = Service::leftJoin('service_availability', function ($join) use ($date) {
            $join->on('services.id', '=', 'service_availability.service_id')
                ->where('service_availability.date', '=', $date);
        })
            ->where('services.availability', '>', 0) // Exclude services with availability 0
            ->where(function ($query) {
                $query->whereNull('service_availability.service_id')
                    ->orWhere(function ($query) {
                        $query->where('service_availability.available_seats', '>', 0);
                    });
            })
            ->select('services.*', 'service_availability.available_seats')
            ->get();

        return response()->json($services);
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
