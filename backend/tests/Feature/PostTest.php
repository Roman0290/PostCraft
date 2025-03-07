<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_list_only_shows_published_posts(): void
    {
        Post::factory(3)->create();
        Post::factory()->draft()->create();

        $this->getJson('/api/posts')->assertOk()->assertJsonCount(3, 'data');
    }

    public function test_drafts_are_hidden_from_guests(): void
    {
        $draft = Post::factory()->draft()->create();

        $this->getJson("/api/posts/{$draft->slug}")->assertForbidden();
    }

    public function test_authenticated_user_can_create_a_post_with_tags(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/posts', [
            'title' => 'Hello World',
            'body' => 'My first post.',
            'status' => 'published',
            'tags' => 'laravel, React',
        ])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'hello-world')
            ->assertJsonCount(2, 'data.tags');
    }

    public function test_user_cannot_edit_someone_elses_post(): void
    {
        $post = Post::factory()->create();
        Sanctum::actingAs(User::factory()->create());

        $this->putJson("/api/posts/{$post->id}", [
            'title' => 'Hacked',
            'body' => 'x',
            'status' => 'published',
        ])->assertForbidden();
    }

    public function test_author_can_delete_own_post(): void
    {
        $post = Post::factory()->create();
        Sanctum::actingAs($post->author);

        $this->deleteJson("/api/posts/{$post->id}")->assertOk();
        $this->assertModelMissing($post);
    }
}
