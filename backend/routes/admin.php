<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\JwtMiddleware;

Route::middleware([JwtMiddleware::class])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/getusers', [AdminController::class, 'getUsers']);
    Route::get('/getnotes', [AdminController::class, 'getNotes']);
    Route::delete('/delete/user/{id}', [AdminController::class, 'deleteUser']);
    Route::delete('/delete/note/{id}', [AdminController::class, 'deleteNote']);
    Route::get('/countnotes', [AdminController::class, 'countNotes']);
    Route::get('/countusers', [AdminController::class, 'countUsers']);
    Route::get('/totalusersandnotes', [AdminController::class, 'getTotalCounts']);
});