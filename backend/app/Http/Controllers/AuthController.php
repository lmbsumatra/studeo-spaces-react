<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle the admin login request.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Log the incoming request
        Log::info('Login attempt received', [
            'username' => $request->username,
            'ip_address' => $request->ip(),
        ]);

        // Validate the incoming request data
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Extract the username and password from the request
        $credentials = $request->only('username', 'password');

        // Find the admin by username
        $admin = Admin::where('username', $credentials['username'])->first();

        // If the admin exists and the password matches using Hash::check
        if ($admin && Hash::check($credentials['password'], $admin->password)) {
            Log::info('Credentials valid, authentication successful.');

            // Generate a JWT token for the authenticated admin
            $token = JWTAuth::claims(['admin_id' => $admin->id])->fromUser($admin);

            Log::info('JWT token generated for admin', ['admin_id' => $admin->id]);

            // Return the token to the client
            return response()->json(['token' => $token]);
        }

        // Log invalid login attempt
        Log::warning('Invalid login attempt', [
            'username' => $credentials['username'],
            'ip_address' => $request->ip(),
        ]);

        // Return an error message if the credentials are invalid
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
}
