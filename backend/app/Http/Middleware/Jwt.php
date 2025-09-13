<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use App\Utils\JWTUtil;

class JwtMiddleware
{

    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('Authorization');

        if (!$token) {
            return response()->json(['error' => 'Token not provided'], 401);
        }

        try {
            $decoded = JWTUtil::validateToken(str_replace('Bearer ', '', $token));
            if (is_string($decoded)) {
                return response()->json(['error' => $decoded], 401);
            }
            $request->attributes->add(['user_id' => $decoded->sub]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Invalid token: ' . $e->getMessage()], 401);
        }

        return $next($request);
    }
}