<?php

namespace App\Services;

use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Business logic for creating and updating posts, kept out of the controller.
 */
class PostService
{
    public function create(User $author, array $data, ?UploadedFile $cover): Post
    {
        return DB::transaction(function () use ($author, $data, $cover) {
            $post = new Post($this->attributes($data));
            $post->user_id = $author->id;

            if ($cover) {
                $post->cover_image = $cover->store('posts', 'public');
            }

            $post->save();
            $this->syncTags($post, $data['tags'] ?? null);

            return $post;
        });
    }

    public function update(Post $post, array $data, ?UploadedFile $cover): Post
    {
        return DB::transaction(function () use ($post, $data, $cover) {
            $post->fill($this->attributes($data, $post));

            if ($post->isDirty('title')) {
                $post->slug = $post->uniqueSlug($post->title);
            }

            if ($cover || ! empty($data['remove_cover'])) {
                $this->deleteCover($post);
                $post->cover_image = $cover?->store('posts', 'public');
            }

            $post->save();
            $this->syncTags($post, $data['tags'] ?? null);

            return $post;
        });
    }

    public function delete(Post $post): void
    {
        $this->deleteCover($post);
        $post->delete();
    }

    private function attributes(array $data, ?Post $existing = null): array
    {
        $attributes = [
            'title' => $data['title'],
            'excerpt' => $data['excerpt'] ?? null,
            'body' => $data['body'],
            'category_id' => $data['category_id'] ?? null,
            'status' => $data['status'],
        ];

        // Keep the original publish date when a published post is edited
        $attributes['published_at'] = $data['status'] === 'published'
            ? ($existing?->published_at ?? now())
            : null;

        return $attributes;
    }

    /** Turn "React, laravel ,php" into synced Tag models (created if missing). */
    private function syncTags(Post $post, ?string $tags): void
    {
        $ids = collect(explode(',', (string) $tags))
            ->map(fn ($name) => mb_strtolower(trim($name)))
            ->filter()
            ->unique()
            ->take(10)
            ->map(fn ($name) => Tag::firstOrCreate(['name' => $name])->id);

        $post->tags()->sync($ids);
    }

    private function deleteCover(Post $post): void
    {
        if ($post->cover_image) {
            Storage::disk('public')->delete($post->cover_image);
        }
    }
}
