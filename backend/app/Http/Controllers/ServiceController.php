<?php

namespace App\Http\Controllers;

use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Seats;
use App\Models\Booking;
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
        $date = $request->query('date');

        // Check if the date is provided in the query, else use the current date in 'Asia/Manila' timezone
        $date = $date ? Carbon::parse($date)->setTimezone('Asia/Manila')->format('Y-m-d') : Carbon::now()->setTimezone('Asia/Manila')->format('Y-m-d');

        // Log the formatted date
        // Log::info($date);

        // Fetch services and calculate bookings count for the selected date
        $services = Service::leftJoin('bookings', function ($join) use ($date) {
            $join->on('services.id', '=', 'bookings.service_id')
                ->where('bookings.date', '=', $date);
        })
            ->select('services.id', 'services.name', 'services.count') // Select relevant fields
            ->selectRaw('COUNT(bookings.id) as bookings_count') // Count the number of bookings
            ->groupBy('services.id', 'services.name', 'services.count') // Group by necessary columns
            ->get();
        Log::info($services);
        $result = $services->map(function ($service) {
            // Assuming 'default_count' holds the total available count for each service
            $availableSeats = $service->count ?? 0; // Default available count
            $bookingsCount = $service->bookings_count ?? 0; // Count of bookings for the date
            // Log::info($availableSeats);
            // Log::info($bookingsCount);

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
        // Log incoming request data for debugging
        Log::info('Creating new service', ['request_data' => $request->all()]);

        // Validate incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'duration' => 'required|string|max:255',
            'price' => 'required|numeric',
            'images' => 'nullable|file|image|max:5120', // Validate file size and type
            'description' => 'nullable|string',
            'count' => 'required|integer|min:1', // Ensure count is at least 1
            'service_code' => 'required|string|max:255|unique:services,service_code', // Ensure unique service code
        ]);

        // Enable query log to check queries being executed
        DB::enableQueryLog();

        // Start database transaction
        DB::beginTransaction();

        try {
            // Handle image upload if present
            if ($request->hasFile('images')) {
                $file = $request->file('images');
                $uploadedFileUrl = cloudinary()->upload($file->getRealPath(), [
                    'folder' => 'services_images',
                ])->getSecurePath();
                $validatedData['images'] = $uploadedFileUrl;
            }

            // Log the validated data to ensure image URL is present
            Log::info('Validated Data for Service Creation', ['validated_data' => $validatedData]);

            // Create service
            $service = Service::create($validatedData);
            Log::info('Service created successfully', ['service_id' => $service->id]);

            // Insert seats
            $seats = [];
            for ($i = 1; $i <= $validatedData['count']; $i++) {
                $seatCode = "{$validatedData['service_code']}-" . $i;
                $seats[] = [
                    'seat_code' => $seatCode,
                    'service_id' => $service->id,
                    'floor_number' => 1, // Default floor
                    'is_booked' => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Insert seats into the database
            DB::table('seats')->insert($seats);
            Log::info('Seats inserted successfully', ['seats_count' => count($seats)]);

            // Commit transaction
            DB::commit();

            // Log executed queries for debugging
            Log::info('Executed Database Queries', ['queries' => DB::getQueryLog()]);

            // Return success response
            return response()->json([
                'message' => 'Service and seats created successfully.',
                'service' => $service,
            ], 201);
        } catch (\Exception $e) {
            // Rollback transaction if error occurs
            DB::rollback();

            // Log the error for debugging
            Log::error('Error creating service or inserting seats', ['error' => $e->getMessage()]);

            // Log executed queries for debugging
            Log::info('Executed Database Queries', ['queries' => DB::getQueryLog()]);

            // Return error response
            return response()->json([
                'message' => 'Failed to create service or insert seats.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        Log::info('Updating service', ['service_id' => $id, 'request_data' => $request->all()]);
        Log::info('Incoming seat data', ['seats' => $request->input('seats')]);

        // Find the service by ID
        $service = Service::find($id);

        if (!$service) {
            Log::warning('Service not found', ['service_id' => $id]);
            return response()->json(['error' => 'Service not found'], 404);
        }

        // Validate incoming request data including 'seats' and 'floor_number'
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'duration' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric',
            'images' => 'nullable|file|image|max:5120', // Validate file size and type
            'description' => 'nullable|string',
            'count' => 'sometimes|integer|min:0', // Allow count to be updated
            'service_code' => 'sometimes|string|max:255|unique:services,service_code,' . $id, // Ensure unique service code
            'availability' => 'required|boolean',
            'seats' => 'nullable|json',  // Ensure seats are passed as a valid JSON string
        ]);

        Log::info('Validated data for update', ['validated_data' => $validatedData]);
        Log::info('Incoming seat data', ['seats' => $request->input('seats')]);  // Log the raw seat data

        try {
            // Handle image upload if provided
            if ($request->hasFile('images')) {
                $file = $request->file('images');
                Log::info('Uploading new image for service', ['file_name' => $file->getClientOriginalName()]);
                $uploadedFileUrl = cloudinary()->upload($file->getRealPath(), [
                    'folder' => 'services_images',
                    'curl_options' => [
                        CURLOPT_SSL_VERIFYPEER => false,
                        CURLOPT_SSL_VERIFYHOST => false
                    ],
                ])->getSecurePath();
                $validatedData['images'] = $uploadedFileUrl; // Update image URL
                Log::info('New image uploaded successfully', ['image_url' => $uploadedFileUrl]);
            }

            // Update the service with validated data (except for the seats part)
            Log::info('Updating service data in the database');
            $service->update($validatedData);
            Log::info('Service updated successfully', ['service_id' => $service->id]);

            // Get today's date in Philippine Time (PH Time)
            $todayPH = Carbon::now('Asia/Manila')->toDateString();  // Get today's date in PH timezone

            // Fetch bookings for today with the corresponding seat_codes for this service
            $bookingsToday = DB::table('bookings')
                ->join('seats', 'bookings.seat_code', '=', 'seats.seat_code')
                ->where('seats.service_id', $service->id)  // Filter by service ID
                ->whereDate('bookings.created_at', $todayPH)  // Only bookings for today
                ->select('bookings.seat_code')  // Select the seat_code from bookings
                ->get();  // Get the results

            // Extract booked seat codes from the bookingsToday collection
            $bookedSeatCodesToday = $bookingsToday->pluck('seat_code')->toArray();

            // If the count is updated and is greater than 0, generate or update seats
            if (isset($validatedData['count']) && $validatedData['count'] > 0) {
                Log::info('Processing seat updates', ['requested_count' => $validatedData['count']]);
                $existingSeats = DB::table('seats')->where('service_id', $service->id)->get();
                Log::info('Fetched existing seats', ['existing_seats_count' => count($existingSeats)]);

                // Decode 'seats' if it was passed as JSON string
                $seatsData = $request->has('seats') ? json_decode($request->input('seats'), true) : [];
                Log::info('Decoded seat data', ['seats' => $seatsData]);

                // Determine the number of seats to save based on the count and booked seats
                $seatsToSaveCount = max($validatedData['count'], count($bookedSeatCodesToday));
                // Log::info($seatsToSaveCount);

                // If seats data is provided, update their floor numbers, but not seat codes if booked
                if (count($seatsData) > 0) {
                    foreach ($seatsData as $index => $seat) {
                        $seatCode = "{$validatedData['service_code']}-" . ($index + 1);

                        // Skip updating seat if it's already booked today
                        if (in_array($seatCode, $bookedSeatCodesToday)) {
                            Log::info('Skipping seat code update as it is already booked today', ['seat_code' => $seatCode]);
                            continue;  // Skip this seat
                        }

                        $newFloorNumber = $seat['floor_number'] ?? null;
                        Log::info('Checking for floor number update', ['seat_code' => $seatCode, 'new_floor_number' => $newFloorNumber]);

                        $existingSeat = $existingSeats->firstWhere('seat_code', $seatCode);
                        if ($existingSeat && $newFloorNumber && $existingSeat->floor_number !== $newFloorNumber) {
                            Log::info('Updating floor number for existing seat', ['seat_code' => $seatCode, 'old_floor_number' => $existingSeat->floor_number]);
                            DB::table('seats')->where('id', $existingSeat->id)->update([
                                'floor_number' => $newFloorNumber,
                                'updated_at' => now(),
                            ]);
                            Log::info('Floor number updated for seat', ['seat_code' => $seatCode]);
                        }
                    }
                }

                // Insert new seats if needed
                $seatsNeeded = max(0, $seatsToSaveCount - count($existingSeats));
                $service->update(['count' => $seatsToSaveCount]);
                Log::info('Seats needed for insertion', ['seats_needed' => $seatsNeeded]);

                if ($seatsNeeded > 0) {
                    $seats = [];
                    $floorNumber = 2;  // Start with floor 2, but can be overridden by the request
                    $lastSeatCode = $existingSeats->last()?->seat_code ?? "{$validatedData['service_code']}-0";

                    // Loop to create new seats
                    for ($i = 1; $i <= $seatsNeeded; $i++) {
                        // If the seat data has a floor number provided, use it, otherwise keep the default
                        $floorNumber = isset($seatsData[$i - 1]['floor_number'])
                            ? $seatsData[$i - 1]['floor_number']
                            : $floorNumber;

                        // Generate a new seat code by incrementing the number part
                        $newSeatCode = "{$validatedData['service_code']}-" . (intval(explode('-', $lastSeatCode)[1]) + $i);

                        // Skip this seat if it is booked today
                        if (in_array($newSeatCode, $bookedSeatCodesToday)) {
                            Log::info('Skipping seat insertion as it is already booked today', ['seat_code' => $newSeatCode]);
                            continue;
                        }

                        // Prepare the seat data for insertion
                        $seats[] = [
                            'seat_code' => $newSeatCode,
                            'service_id' => $service->id,
                            'floor_number' => $floorNumber,
                            'is_booked' => false,  // Default value for is_booked
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }

                    // Insert new seats in bulk
                    Log::info('Inserting new seats into the database');
                    DB::table('seats')->insert($seats);
                    Log::info('New seats inserted successfully', ['seats_count' => count($seats)]);
                }

                // Delete extra seats that are not booked and are beyond the count
                $seatsToDelete = DB::table('seats')
                    ->where('service_id', $service->id)
                    ->whereNotIn('seat_code', array_column($seatsData, 'seat_code')) // Keep the seats that exist in the new data
                    ->whereNotIn('seat_code', $bookedSeatCodesToday) // Avoid deleting booked seats
                    ->get();

                Log::info('Deleting unbooked extra seats', ['seats_to_delete' => $seatsToDelete]);

                foreach ($seatsToDelete as $seat) {
                    DB::table('seats')->where('id', $seat->id)->delete();
                    Log::info('Deleted seat', ['seat_code' => $seat->seat_code]);
                }
            }

            return response()->json([
                'message' => 'Service updated successfully.',
                'service' => $service,
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error while updating service', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Database error. Failed to update service.',
                'error' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error while updating service', ['error' => $e->getMessage()]);
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

        // Get the current date in Philippine Time (PH Time)
        $todayPH = Carbon::now('Asia/Manila')->toDateString();  // Get today's date in PH timezone
        // Log::info($todayPH);
        $bookings = Booking::whereDate('date', $todayPH)->get();
        Log::info('Booking created at: ' . $bookings);

        // Fetch bookings for today with the corresponding seat_codes for this service
        $bookingsToday = DB::table('bookings')
            ->join('seats', 'bookings.seat_code', '=', 'seats.seat_code')
            ->where('seats.service_id', $service->id)  // Filter by service ID
            ->whereDate('bookings.date', $todayPH)  // Only bookings for today
            ->select('bookings.seat_code')  // Select the seat_code from bookings
            ->get();  // Get the results

        // Count the number of bookings per seat_code
        $bookingsGroupedBySeat = $bookingsToday->groupBy('seat_code');
        $bookCountsPerSeat = [];

        // Iterate over the seats and count bookings per seat_code
        foreach ($service->seats as $seat) {
            $seatCode = $seat->seat_code;
            // Count how many times this seat_code is booked today
            $bookCountsPerSeat[$seatCode] = isset($bookingsGroupedBySeat[$seatCode])
                ? $bookingsGroupedBySeat[$seatCode]->count()
                : 0;
        }

        // Prepare the response with service data, seat details, and the booking count for each seat
        return response()->json([
            'service' => $service,
            'booking_counts_per_seat' => $bookCountsPerSeat,  // Add the booking count per seat
            'booked_seat_codes_today' => $bookingsToday->pluck('seat_code'),  // Include the seat codes that are booked today
        ]);
    }
}
