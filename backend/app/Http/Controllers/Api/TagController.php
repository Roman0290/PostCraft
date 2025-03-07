<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TagController extends Controller
{
    /** Tags that have at least one published post, most used first. */
    public function index(): AnonymousResourceCollection
    {
        $tags = Tag::withCount(['posts' => fn ($q) => $q->published()])
            ->get()
            ->filter(fn (Tag $tag) => $tag->posts_count > 0)
            ->sortByDesc('posts_count')
            ->values();

        return TagResource::collection($tags);
    }
}
