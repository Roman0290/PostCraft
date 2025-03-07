<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
| All routes here are prefixed with /api (e.g. GET /api/posts).
| Authenticated routes expect the header:  Authorization: Bearer <token>
*/

// ---- Public -------------------------------------------------------------
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{post:slug}', [PostController::class, 'show'])->name('posts.show');
Route::get('/posts/{post:slug}/comments', [CommentController::class, 'index']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category:slug}', [CategoryController::class, 'show']);
Route::get('/tags', [TagController::class, 'index']);
Route::get('/users/{user}', [UserController::class, 'show']);

// ---- Authenticated ------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me/posts', [PostController::class, 'mine']);
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    // Use POST with "_method=PUT" when uploading a file (multipart/form-data)
    Route::put('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);

    Route::post('/posts/{post:slug}/comments', [CommentController::class, 'store'])->middleware('throttle:20,1');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // Admin only
    Route::middleware('admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });
});
