<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\AuthController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/create/note', [NoteController::class, 'create']);
    Route::put('/update/note/{id}', [NoteController::class, 'update']);
    Route::delete('/delete/note/{id}', [NoteController::class, 'delete']);
    Route::get('/notes', [NoteController::class, 'index']);
    Route::get('/note/{id}', [NoteController::class, 'show']);

    // Note endpoints
    Route::apiResource('notes', NoteController::class);
});
Route::get('/notes/user/{userId}', [NoteController::class, 'getAllByUserId']);
Route::get('/note/{id}', [NoteController::class, 'getNoteById']);

