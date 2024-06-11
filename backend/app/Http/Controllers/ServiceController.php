<?php

namespace App\Http\Controllers;

use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use App\Models\Service;

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
        ]);

        $service = Service::create($validatedData);

        return response()->json($service, 201);
    }

    public function index()
    {
        $services = Service::all();

        return response()->json($services);
    }

    public function available(Request $request)
{
    $date = $request->query('date');

    // Fetch services with available_seats information for the selected date
    $services = Service::leftJoin('service_availability', function ($join) use ($date) {
            $join->on('services.id', '=', 'service_availability.service_id')
                 ->where('service_availability.date', '=', $date);
        })
        ->where(function($query) {
            $query->whereNull('service_availability.service_id') // No corresponding data in service_availability
                  ->orWhere(function ($query) {
                      $query->where('service_availability.available_seats', '>', 0); // Available seats > 0
                  });
        })
        ->select('services.*', 'service_availability.available_seats')
        ->get();

    return response()->json($services);
}


}
