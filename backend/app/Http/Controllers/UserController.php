<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Utils\JWTUtil;

class UserController extends Controller
{
    public function getUser(Request $request)
    {
        $userId = $request->get('userId');
        if (!$userId) {
            return response()->json(['error' => 'User ID not found in token'], 401);
        }
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        return response()->json($user);
    }
}