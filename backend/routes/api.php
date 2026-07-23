<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\CommentController;

// Handle Preflight OPTIONS requests for cross-origin browser fetch calls
Route::options('/{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization, Origin');
})->where('any', '.*');

// Board Endpoints
Route::get('/boards', [BoardController::class, 'index']);
Route::post('/boards', [BoardController::class, 'store']);
Route::get('/boards/{id}', [BoardController::class, 'show']);
Route::put('/boards/{id}', [BoardController::class, 'update']);
Route::delete('/boards/{id}', [BoardController::class, 'destroy']);

// List Endpoints
Route::post('/boards/{boardId}/lists', [ListController::class, 'store']);
Route::put('/lists/{id}', [ListController::class, 'update']);
Route::delete('/lists/{id}', [ListController::class, 'destroy']);

// Card Endpoints
Route::post('/lists/{listId}/cards', [CardController::class, 'store']);
Route::get('/cards/{id}', [CardController::class, 'show']);
Route::put('/cards/{id}', [CardController::class, 'update']);
Route::post('/cards/{id}/move', [CardController::class, 'move']);
Route::delete('/cards/{id}', [CardController::class, 'destroy']);

// Member Endpoints
Route::get('/boards/{boardId}/members', [MemberController::class, 'index']);
Route::post('/boards/{boardId}/members', [MemberController::class, 'store']);

// Tag Endpoints
Route::get('/tags', [TagController::class, 'index']);
Route::post('/tags', [TagController::class, 'store']);

// Comment Endpoints
Route::get('/cards/{cardId}/comments', [CommentController::class, 'index']);
Route::post('/cards/{cardId}/comments', [CommentController::class, 'store']);
