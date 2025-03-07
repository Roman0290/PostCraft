<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    public function __construct(private PostService $posts) {}

    /**
     * Public list of published posts.
     * Query params: search, category (slug), tag (slug), author (id), per_page
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $posts = Post::published()
            ->with(['author', 'category', 'tags'])
            ->withCount('comments')
            ->when($request->search, function (Builder $q, string $search) {
                $q->where(fn (Builder $q) => $q
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%"));
            })
            ->when($request->category, fn (Builder $q, string $slug) => $q->whereHas('category', fn ($c) => $c->where('slug', $slug)))
            ->when($request->tag, fn (Builder $q, string $slug) => $q->whereHas('tags', fn ($t) => $t->where('slug', $slug)))
            ->when($request->author, fn (Builder $q, $id) => $q->where('user_id', $id))
            ->latest('published_at')
            ->paginate(min((int) $request->input('per_page', 9), 50))
            ->withQueryString();

        return PostResource::collection($posts);
    }

    /** Posts (drafts included) written by the logged-in user. */
    public function mine(Request $request): AnonymousResourceCollection
    {
        $posts = $request->user()->posts()
            ->with(['category', 'tags'])
            ->withCount('comments')
            ->latest()
            ->paginate(20);

        return PostResource::collection($posts);
    }

    public function show(Post $post): PostResource
    {
        Gate::forUser(request()->user('sanctum'))->authorize('view', $post);

        return new PostResource($post->load(['author', 'category', 'tags'])->loadCount('comments'));
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $this->posts->create($request->user(), $request->validated(), $request->file('cover_image'));

        return (new PostResource($post->load(['author', 'category', 'tags'])))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdatePostRequest $request, Post $post): PostResource
    {
        $post = $this->posts->update($post, $request->validated(), $request->file('cover_image'));

        return new PostResource($post->load(['author', 'category', 'tags']));
    }

    public function destroy(Post $post): JsonResponse
    {
        Gate::authorize('delete', $post);
        $this->posts->delete($post);

        return response()->json(['message' => 'Post deleted.']);
    }
}
