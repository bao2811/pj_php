<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\NoteService;


class NoteController extends Controller
{
    protected $noteService;

    public function __construct(NoteService $noteService)
    {
        $this->noteService = $noteService;
    }

    public function index()
    {
        $notes = $this->noteService->getAllNote();
        return response()->json($notes);
    }

    public function getAllByUserId(Request $request)
    {
        $user = $request->user();
        $userId = $user->id ?? null;
        if (!$userId) {
            return response()->json(['error' => 'User ID not found in token'], 401);
        }
        $notes = $this->noteService->getAllByUserId($userId);
        return response()->json($notes);
    }

    public function getNoteById(Note $note)
    {
        $note = $this->noteService->getNoteById($note->id);
        if (empty($note)) {
            return response()->json(['error' => 'Note not found.'], 404);
        }
        return response()->json($note);
    }


    public function delete(Note $note, Request $request)
    {
        // $userId = $request->get('userId');
        $user = $request->user();
        $userId = $user->id ?? null;
        $note = $this->noteService->delete($note->id, $userId);
        return response()->json($note, 200);
    }

    public function create(Request $request)
    {
        $title = $request->input('title');
        $content = $request->input('content');
        // $userId = $request->get('userId');
        $user = $request->user();
        $userId = $user->id ?? null;

        $data = [
            'title'   => $title,
            'content' => $content,
            'isCur'   => 1,
            'userId'  => $userId,
        ];

        if (empty($title) || empty($content)) {
            return response()->json(['error' => 'Title and content are required.'], 400);
        }

        $note = $this->noteService->create($data);

        return response()->json(['message' => 'Note created successfully'], 201);
    }

    public function update(Request $request, Note $note)
    {
        $title = $request->input('title');
        $content = $request->input('content');
        // $userId = $request->input('userId');
        $user = $request->user();
        $userId = $user->id ?? null;

        $data = [
            'title'   => $title,
            'content' => $content,
            'userId'  => $userId,
            'noteId'  => $note->noteId
        ];

        if (empty($title) && empty($content)) {
            return response()->json(['error' => 'At least one of title or content must be provided.'], 400);
        }

        $note = $this->noteService->update($data);
    

        $data1 = [
            'title'   => $title,
            'content' => $content,
            'userId'  => $userId,
            'isCur'   => 1,
            'created_at' => $note->created_at,
        ];

        $note = $this->noteService->create($data1);
        return response()->json($note);
    }

    function getAllNote() {
        $notes = $this->noteService->getAllNote();
        return response()->json($notes);
    }
}
