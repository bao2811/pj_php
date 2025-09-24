<?php

namespace App\Services;

use App\Models\Note;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use App\Repository\AdminRepo;

class AdminService
{
    protected $adminRepo;
    
    public function __construct()
    {
        $this->adminRepo = new AdminRepo();
    }

    public function getTotalCounts() {
        return $this->adminRepo->getTotalCounts();
    }

    public function countNotes() {
        return $this->adminRepo->countNotes();
    }

    public function countUsers() {
        return $this->adminRepo->countUsers();
    }

    public function getNotes() {
        return $this->adminRepo->getNotes();
    }

    public function getUsers() {
        return $this->adminRepo->getUsers();
    }

    public function deleteUser(int $id) {
        return $this->adminRepo->deleteUser($id);
    }

    public function getUserDetails(int $userId) {
        return $this->adminRepo->getUserDetails($userId);
    }

    public function getAllUser() {
        return $this->adminRepo->getAllUser();
    }

}