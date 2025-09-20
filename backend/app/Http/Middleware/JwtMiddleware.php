<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use App\Utils\JWTUtil;
use Illuminate\Http\Request;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $token = JWTUtil::extractToken($request);
            $decoded = JWTUtil::validateToken($token);
            $request->attributes->set('userId', $decoded->sub);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Invalid token: ' . $e->getMessage()
            ], 401, route('login'));
        }

        return $next($request);
    }
}
