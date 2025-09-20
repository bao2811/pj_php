<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Controllers\UserController;


// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);

// Protected routes
Route::middleware([JwtMiddleware::class])->group(function () {
    // User info
    Route::get('/user', [UserController::class, 'getUser']);
    // Notes endpoints
    Route::get('/notes', [NoteController::class, 'index']);              
    Route::get('/notes/user', [NoteController::class, 'getAllByUserId']); 
    Route::get('/note/{id}', [NoteController::class, 'getNoteById']); 
    Route::post('/create/note', [NoteController::class, 'create']);   
    Route::put('/update/note/{note}', [NoteController::class, 'update']); 
    Route::delete('/delete/note/{note}', [NoteController::class, 'delete']);

});
