<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getAllByUserId($userId)
    {
        $notes = DB::select('SELECT * FROM notes WHERE userId = ?', [$userId]);
        $note = collect($notes);
        return response()->json($note);
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
        $userId = $request->input('userId');
        $note = DB::delete('DELETE FROM notes WHERE id = ? AND userId = ?', [$note->id, $userId]);
        return response()->json(null, 204);
    }

    public function create(Request $request)
    {
        $title = $request->input('title');
        $content = $request->input('content');
        $userId = $request->input('userId');

        if (empty($title) || empty($content)) {
            return response()->json(['error' => 'Title and content are required.'], 400);
        }

        $note = DB::insert(
            'INSERT INTO notes (title, content, created_at, updated_at, userId) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)',
            [$title, $content, $userId]
        );

        return response()->json($note, 201);
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
            'UPDATE notes SET title = COALESCE(?, title), content = COALESCE(?, ?), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [$title, $content, $content, $note->id]
        );


        $note = collection($note)->first();
        return response()->json($note);
    }
}
