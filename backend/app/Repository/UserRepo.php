<?php
namespace App\Repository;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserRepo
{

    public function updateUser(User $user, array $data): User
    {
        $user->update($data);
        return $user;
    }

    public function getUserById(int $id): ?User
    {
        return User::find($id);
    }

    public function createUser(array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return User::create($data);
    }

    public function updateUserById(int $id, array $data): ?User
    {
        $user = $this->getUserById($id);
        if (!$user) {
            throw new \InvalidArgumentException('User not found');
        }

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);
        return $user;
    }
 
    function getUserByEmail($email) {
        return User::where('email', $email)->first();
    }

}