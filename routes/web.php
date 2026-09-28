<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InventoryController;

Route::get('/', function () {
    return view('welcome');
});

// API Routes
Route::get('/api/ingredients', [InventoryController::class, 'getIngredients']);
Route::get('/api/logs', [InventoryController::class, 'getLogs']);
Route::post('/api/ingredients', [InventoryController::class, 'storeIngredient']);
Route::post('/api/ingredients/{id}/stock', [InventoryController::class, 'updateStock']);