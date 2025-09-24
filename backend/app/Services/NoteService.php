<?php

namespace App\Services;

use App\Models\Note;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use App\Repository\NoteRepo;

class NoteService
{
    protected $noteRepo;

    public function __construct(NoteRepo $noteRepo)
    {
        $this->noteRepo = $noteRepo;
    }

    public function getAllByUserId(int $id): ?Collection
    {
       return $this->noteRepo->getAllByUserId($id);
    }

    public function getNoteById(int $id): ?Note
    {
        return $this->noteRepo->getNoteById($id);
    }

    public function delete(int $noteId, int $userId): bool
    {
        return $this->noteRepo->delete($noteId, $userId);
    }

    public function create(array $data): Note
    {
        return $this->noteRepo->create($data);
    }

    public function update(array $data)
    {
         return $this->noteRepo->update($data);
    }

    public function getAllNote(): Collection
    {
        return $this->noteRepo->getAllNote();
    }
}