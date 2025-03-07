<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    public function index(Post $post): AnonymousResourceCollection
    {
        Gate::forUser(request()->user('sanctum'))->authorize('view', $post);

        $comments = $post->comments()->with('author')->oldest()->get()
            ->each(fn (Comment $c) => $c->setRelation('post', $post));

        return CommentResource::collection($comments);
    }

    public function store(StoreCommentRequest $request, Post $post): JsonResponse
    {
        abort_unless($post->isPublished(), 422, 'You can only comment on published posts.');

        $comment = new Comment($request->validated());
        $comment->user_id = $request->user()->id;
        $post->comments()->save($comment);

        return (new CommentResource($comment->load('author')))
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(Comment $comment): JsonResponse
    {
        Gate::authorize('delete', $comment);
        $comment->delete();

        return response()->json(['message' => 'Comment deleted.']);
    }
}
