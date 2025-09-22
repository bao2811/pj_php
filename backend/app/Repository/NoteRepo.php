<?php
namespace App\Repository;

use App\Models\Note;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class NoteRepo
{
    public function index()
    {
        return Note::all();
    }

    public function getAllByUserId(int $userId): Collection
    {
        return Note::where('userId', $userId)->where('isCur', 1)->get();
    }

    public function getNoteById(int $id): ?Note
    {
        return Note::find($id);
    }

    public function delete(int $noteId, int $userId): bool
    {
        return Note::where('id', $noteId)->where('userId', $userId)->update(['isCur' => 0]) > 0;
    }

    public function create(array $data): Note
    {
        $note = Note::create($data);
        return $note;
    }

    public function update(array $data)
    {

        $note = Note::where('id', $data['noteId'])->where('userId', $data['userId'])->first();
        if (!$note) {
            throw new \InvalidArgumentException('Note not found');
        }

        $note->isCur = 0;
        $note->save();

        return $note;
    }

    function getAllNote() {
        return Note::all();
    }

}