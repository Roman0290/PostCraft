<?php

use Illuminate\Support\Facades\Route;

// This app is an API. The React frontend lives in ../frontend.
Route::get('/', fn () => response()->json([
    'name' => config('app.name').' API',
    'docs' => 'See README.md for the list of endpoints.',
    'api' => url('/api'),
]));
