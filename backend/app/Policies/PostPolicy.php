<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /** Published posts are public; drafts are visible to their author and admins. */
    public function view(?User $user, Post $post): bool
    {
        if ($post->isPublished()) {
            return true;
        }

        return $user !== null && ($user->is_admin || $user->id === $post->user_id);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Post $post): bool
    {
        return $user->is_admin || $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->is_admin || $user->id === $post->user_id;
    }
}
