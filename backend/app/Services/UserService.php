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

    public function updateUserById(int $id, array $data): ?User
    {
        return $this->userRepo->updateUserById($id, $data);
    }
 
    public function getUserById(int $id)
    {
        return $this->userRepo->getUserById($id);
    }

    public function createUser(array $data)
    {
        return $this->userRepo->createUser($data);
    }


}