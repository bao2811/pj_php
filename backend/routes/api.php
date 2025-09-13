<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/



// Protected Routes
Route::middleware('auth:sanctum', )->group(function () {
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

