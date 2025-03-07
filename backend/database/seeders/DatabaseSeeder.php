<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Demo accounts (password for both: "password")
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'bio' => 'Editor-in-chief. Writes about software and the web.',
        ]);
        $admin->forceFill(['is_admin' => true])->save();

        $author = User::factory()->create([
            'name' => 'Jane Writer',
            'email' => 'jane@example.com',
            'bio' => 'Frontend developer and occasional blogger.',
        ]);

        $readers = User::factory(5)->create();
        $writers = collect([$admin, $author]);

        $categories = collect([
            ['name' => 'Technology', 'description' => 'Software, gadgets and the web.'],
            ['name' => 'Design', 'description' => 'UI, UX and visual design.'],
            ['name' => 'Lifestyle', 'description' => 'Productivity, habits and life.'],
            ['name' => 'Travel', 'description' => 'Places worth seeing.'],
            ['name' => 'Tutorials', 'description' => 'Step-by-step guides.'],
        ])->map(fn ($c) => Category::create($c));

        $tags = collect(['react', 'laravel', 'php', 'javascript', 'css', 'productivity', 'career', 'tips'])
            ->map(fn ($name) => Tag::create(['name' => $name]));

        // 18 published posts + 2 drafts
        Post::factory(18)
            ->recycle($writers)
            ->state(fn () => ['category_id' => $categories->random()->id])
            ->create()
            ->each(function (Post $post) use ($tags, $readers) {
                $post->tags()->attach($tags->random(rand(1, 3))->pluck('id'));

                Comment::factory(rand(0, 4))
                    ->recycle($readers)
                    ->create(['post_id' => $post->id]);
            });

        Post::factory(2)->draft()->create([
            'user_id' => $author->id,
            'category_id' => $categories->first()->id,
        ]);
    }
}
