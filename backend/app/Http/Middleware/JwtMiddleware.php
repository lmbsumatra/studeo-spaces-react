<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Attempt to get the authenticated user via JWT
            $user = JWTAuth::parseToken()->authenticate();
        } catch (JWTException $e) {
            // If JWT is missing or invalid, return error response
            return response()->json(['message' => 'Token is invalid or expired'], 401);
        }

        // Attach the user to the request
        $request->attributes->add(['user' => $user]);

        return $next($request);
    }
}
