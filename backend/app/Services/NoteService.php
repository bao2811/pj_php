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
        if (!$id) {
            return ['success' => false, 'error' => 'User ID not found in token'];
        }
        $notes = $this->noteRepo->getAllByUserId($id);

        if (!$notes) {
            return ['success' => false, 'error' => 'No notes found for this user.'];
        }

        return ['success' => true, 'data' => $notes];
    }

    public function getNoteById(int $id): ?Note
    {
        $note = $this->noteRepo->getNoteById($id);
        if (empty($note)) {
            return ['success' => false, 'error' => 'Note not found.'];
        }
        return ['success' => true, 'data' => $note];
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