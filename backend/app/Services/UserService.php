<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Repository\UserRepo;

class UserService
{
    protected $userRepo;

    public function __construct(UserRepo $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    public function updateUserById(int $id, array $data)
    {
        if (!$id) {
            return ['success' => false, 'error' => 'User ID not found in token'];
        }

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user = $this->userRepo->getUserById($id);

        if (!$user) {
            return ['success' => false, 'error' => 'User not found'];
        }
        if ($user->banned == 1) {
            return ['success' => false, 'error' => 'Your account has been banned. Please contact support.'];
        }
        return ['success' => true, 'data' => $this->userRepo->updateUserById($id, $data)];
    }
 
    public function getUserById(int $id)
    {
        if (!$id) {
            return ['success' => false, 'error' => 'User ID not found in token'];
        }

        $user = $this->userRepo->getUserById($id);

        if (!$user) {
            return ['success' => false, 'error' => 'User not found'];
        }

        if ($user->banned == 1) {
            return ['success' => false, 'error' => 'Your account has been banned. Please contact support.'];
        }
        return ['success' => true, 'data' => $user];
    }

    public function createUser(array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $data['role'] = $data['role'] ?? 'user';
        $data['banned'] = $data['banned'] ?? 0;
        return $this->userRepo->createUser($data);
    }

    public function getUserByEmail($email) {

        $user = $this->userRepo->getUserByEmail($email);
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }
        
        if ($user->banned == 1) {
            return ['success' => false, 'error' => 'Your account has been banned. Please contact support.'];
        }
        return ['success' => true, 'data' => $user];
    }
}