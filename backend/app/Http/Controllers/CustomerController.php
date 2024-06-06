<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;

class CustomerController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'contact_number' => 'required|string|max:20',
        ]);

        $customer = Customer::create($validatedData);

        return response()->json($customer, 201);
    }

    public function index()
    {
        $customers = Customer::with('bookings')->get();
        return response()->json($customers);
    }

    public function show($id)
    {
        $customer = Customer::with('bookings')->find($id);

        if ($customer) {
            return response()->json($customer);
        } else {
            return response()->json(['message' => 'Customer not found'], 404);
        }
    }
}
