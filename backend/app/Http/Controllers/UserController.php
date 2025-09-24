<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Utils\JWTUtil;
use App\Services\UserService;

class UserController extends Controller

{

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function getUser(Request $request)
    {

        $user = $request->user();
        $userId = $user->id ?? null;
        if (!$userId) {
            return response()->json(['error' => 'User ID not found in token'], 401);
        }
        $user = $this->userService->getUserById($userId);
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($user->banned == 1) {
            return response()->json(['error' => 'Your account has been banned. Please contact support.'], 403);
        }
        return response()->json($user);
    }

    public function updateUser(Request $request)
    {
        $user = $request->user();
        $userId = $user->id ?? null;
        if (!$userId) {
            return response()->json(['error' => 'User ID not found in token'], 401);
        }

        $data = $request->only(['name', 'email', 'password']);
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $this->userService->updateUserById($userId, $data);
        return response()->json(['message' => 'User updated successfully']);
    }

}