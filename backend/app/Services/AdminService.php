<?php

namespace App\Repository;

use App\Models\Note;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
class NoteRepo
{
    protected $noteRepo;
    
    public function __construct()
    {
        $this->noteRepo = new Note();
    }

    public function getTotalCounts() {
        return $this->noteRepo->getTotalCounts();
    }

    public function countNotes() {
        return $this->noteRepo->countNotes();
    }

    public function countUsers() {
        return $this->noteRepo->countUsers();
    }

    public function getNotes() {
        return $this->noteRepo->getNotes();
    }

    public function getUsers() {
        return $this->noteRepo->getUsers();
    }

    public function deleteUser(int $id) {
        return $this->noteRepo->deleteUser($id);
    }

    public function getUserDetails(int $userId) {
        return $this->noteRepo->getUserDetails($userId);
    }

    public function getAllUser() {
        return $this->noteRepo->getAllUser();
    }

}