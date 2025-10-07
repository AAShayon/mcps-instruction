<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserAddressController;

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

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Categories
    Route::apiResource('categories', CategoryController::class);
    
    // Products
    Route::apiResource('products', ProductController::class);
    
    // User Addresses
    Route::apiResource('user-addresses', UserAddressController::class);
    
    // Orders
    Route::apiResource('orders', OrderController::class);
    
    // Role-based routes
    Route::middleware('role:admin')->group(function () {
        // Admin specific routes
    });
    
    Route::middleware('role:user')->group(function () {
        // User specific
    });
    
    Route::middleware('role:rider')->group(function () {
        // Rider specific
    });
});