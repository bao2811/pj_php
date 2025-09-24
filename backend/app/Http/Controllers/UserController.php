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
        
        $result = $this->userService->getUserById($userId);

        if (!$result['success']) {
            return response()->json(['error' => $result['error']], 404);
        }

        return response()->json($result['data']);
    }

    public function updateUser(Request $request)
    {
        $user = $request->user();
        $userId = $user->id ?? null;
        $data = $request->only(['name', 'email', 'password']);
        $result = $this->userService->updateUserById($userId, $data);
        if (!$result['success']) {
            return response()->json(['error' => $result['error']], 404);
        }
        return response()->json(['message' => 'User updated successfully']);
    }

}