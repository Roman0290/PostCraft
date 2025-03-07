<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;

class CommentPolicy
{
    /** Comment owner, the post's author, or an admin may delete a comment. */
    public function delete(User $user, Comment $comment): bool
    {
        return $user->is_admin
            || $user->id === $comment->user_id
            || $user->id === $comment->post->user_id;
    }
}
