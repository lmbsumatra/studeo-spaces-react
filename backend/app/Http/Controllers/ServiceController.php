<?php

namespace App\Http\Controllers;

use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Seats;
use App\Models\ServiceAvailability;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
        $date = $request->query('date', Carbon::now()->setTimezone('Asia/Manila')->format('Y-m-d'));

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
        // Validate incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'duration' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'nullable|file|image|max:5120', // Validate file size and type
            'description' => 'nullable|string',
            'count' => 'required|integer|min:1', // Ensure count is at least 1
            'service_code' => 'required|string|max:255|unique:services,service_code', // Ensure unique service code
        ]);

        try {
            // Handle image upload
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $uploadedFileUrl = cloudinary()->upload($file->getRealPath(), [
                    'folder' => 'services_images',
                    'curl_options' => [
                        CURLOPT_SSL_VERIFYPEER => false,
                        CURLOPT_SSL_VERIFYHOST => false
                    ],
                ])->getSecurePath();
                $validatedData['image'] = $uploadedFileUrl; // Corrected to 'image' key to match database field
            }

            // Create the service
            $service = Service::create($validatedData);

            // Generate seats if 'count' is provided
            if ($validatedData['count'] > 0) {
                $seats = [];
                $floorNumber = 1;  // Start with floor 1 (or adjust based on logic)

                for ($i = 1; $i <= $validatedData['count']; $i++) {
                    $seats[] = [
                        'seat_code' => "{$validatedData['service_code']}-$i",
                        'service_id' => $service->id,
                        'floor_number' => $floorNumber,  // Assigning floor number
                        'is_booked' => false,  // Default value for is_booked
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    // Optionally increment the floor number (if logic applies)
                    if ($i % 10 == 0) {
                        $floorNumber++; // Increment floor number after every 10 seats, for example
                    }
                }

                // Insert generated seats in bulk
                DB::table('seats')->insert($seats);
            }

            return response()->json([
                'message' => 'Service created successfully.',
                'service' => $service,
            ], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Catch and log database-related errors
            Log::error('Database error while creating service:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Database error. Failed to create service.',
                'error' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            // Catch all other exceptions (e.g., file upload issues)
            Log::error('Unexpected error while creating service:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Unexpected error occurred while creating service.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        // Find the service by ID
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        // Validate incoming request data
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'duration' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric',
            'image' => 'nullable|file|image|max:5120', // Validate file size and type
            'description' => 'nullable|string',
            'count' => 'sometimes|integer|min:0', // Allow count to be updated
            'service_code' => 'sometimes|string|max:255|unique:services,service_code,' . $id, // Ensure unique service code
            'availability' => 'required|boolean',
        ]);

        try {
            // Handle image upload if provided
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $uploadedFileUrl = cloudinary()->upload($file->getRealPath(), [
                    'folder' => 'services_images',
                    'curl_options' => [
                        CURLOPT_SSL_VERIFYPEER => false,
                        CURLOPT_SSL_VERIFYHOST => false
                    ],
                ])->getSecurePath();
                $validatedData['image'] = $uploadedFileUrl; // Update image URL
            }

            // Update the service with validated data
            $service->update($validatedData);

            // If the count is updated and is greater than 0, generate seats
            if (isset($validatedData['count']) && $validatedData['count'] > 0) {
                // Clear existing seats if count is changed
                DB::table('seats')->where('service_id', $service->id)->delete();

                $seats = [];
                $floorNumber = 1;  // Start with floor 1

                for ($i = 1; $i <= $validatedData['count']; $i++) {
                    $seats[] = [
                        'seat_code' => "{$validatedData['service_code']}-$i",
                        'service_id' => $service->id,
                        'floor_number' => $floorNumber,  // Assign floor number
                        'is_booked' => false,  // Default value for is_booked
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    // Increment floor number after every 10 seats
                    if ($i % 10 == 0) {
                        $floorNumber++;
                    }
                }

                // Insert generated seats in bulk
                DB::table('seats')->insert($seats);
            }

            // Return response with updated service data
            return response()->json([
                'message' => 'Service updated successfully.',
                'service' => $service,
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            // Log any database-related errors
            Log::error('Database error while updating service:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Database error. Failed to update service.',
                'error' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            // Log any other unexpected errors
            Log::error('Unexpected error while updating service:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Unexpected error occurred while updating service.',
                'error' => $e->getMessage(),
            ], 500);
        }
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
        // Fetch the service with its associated seats
        $service = Service::with('seats')->find($id);

        // Check if the service exists
        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        // Return the service data including seats
        return response()->json($service);
    }
}
