<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
