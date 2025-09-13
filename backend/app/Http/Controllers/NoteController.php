<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Note::orderBy('created_at', 'desc')->get();
    }


    
    public function show(Note $note)
    {
        return $note;
    }


    public function delete(Note $note)
    {
        $note->delete();
        
        return response()->json(null, 204);
    }

    public function create(Request $request)
    {
        $title = $request->input('title');
        $content = $request->input('content');
        if (empty($title) || empty($content)) {
            return response()->json(['error' => 'Title and content are required.'], 400);
        }

        $note = Note::create([
            'title' => $title,
            'content' => $content,
        ]);

        return response()->json($note, 201);
    }

     public function update(Request $request, Note $note)
    {
        $title = $request->input('title');
        $content = $request->input('content');

        if (empty($title) && empty($content)) {
            return response()->json(['error' => 'At least one of title or content must be provided.'], 400);
        }


        $note->update([
            'title' => $title,
            'content' => $content,
        ]);

        return response()->json($note);
    }
}
