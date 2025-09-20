<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class NoteController extends Controller
{
    public function index()
    {
        $notes = DB::select('SELECT * FROM notes WHERE isCur = 1');
        return response()->json($notes);
    }

    public function getAllByUserId(Request $request)
    {
        $userId = $request->get('userId'); // lấy từ JWT middleware
        if (!$userId) {
            return response()->json(['error' => 'User ID not found in token'], 401);
        }

        $notes = DB::select('SELECT * FROM notes WHERE userId = ? AND isCur = 1', [$userId]);

        return response()->json($notes);
    }

    public function getNoteById(Note $note)
    {
        $note = DB::select('SELECT * FROM notes WHERE id = ?', [$note->id]);
        if (empty($note)) {
            return response()->json(['error' => 'Note not found.'], 404);
        }
        return response()->json($note);
    }


    public function delete(Note $note, Request $request)
    {
        $userId = $request->get('userId');
        $note = DB::update('UPDATE notes SET isCur = 0 WHERE id = ? AND userId = ?', [$note->id, $userId]);
        return response()->json($note, 200);
    }

    public function create(Request $request)
    {

        $title = $request->input('title');
        $content = $request->input('content');
        $userId = $request->get('userId');

        if (empty($title) || empty($content)) {
            return response()->json(['error' => 'Title and content are required.'], 400);
        }

        $note = DB::insert(
            'INSERT INTO notes (title, content, created_at, updated_at, isCur, userId) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?)',
            [$title, $content, 1, $userId]
        );

        // return response()->json($note, 201);

        return response()->json(['message' => 'Note created successfully'], 201);
    }

    public function createNoteAfterUpdate($userId, $title, $content, $createdAt) {
        $note = DB::insert(
            'INSERT INTO notes (title, content, created_at, updated_at, userId, isCur) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?)',
            [$title, $content, $createdAt, $userId, 1]
        );
    }

     public function update(Request $request, Note $note)
    {
        $title = $request->input('title');
        $content = $request->input('content');
        $userId = $request->input('userId');

        if (empty($title) && empty($content)) {
            return response()->json(['error' => 'At least one of title or content must be provided.'], 400);
        }

        $note = DB::update(
            'UPDATE notes SET isCur = 0 WHERE id = ? AND noteId = ? AND title != ? AND content != ?',
            [$note->id, $note->noteId, $title, $content]
        );

       createNoteAfterUpdate($userId, $title, $content, $note->created_at);


        $note = collection($note)->first();
        return response()->json($note);
    }

    function getAllNote() {
        $notes = DB::select('SELECT * FROM notes');
        return response()->json($notes);
    }
}
