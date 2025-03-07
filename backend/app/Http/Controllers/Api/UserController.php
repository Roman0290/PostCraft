<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;

class UserController extends Controller
{
    /** Public author profile. */
    public function show(User $user): UserResource
    {
        return new UserResource($user->loadCount(['posts' => fn ($q) => $q->published()]));
    }
}
