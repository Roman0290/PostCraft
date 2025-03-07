<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    public function definition(): array
    {
        $paragraphs = fn (int $n) => implode("\n\n", fake()->paragraphs($n));

        $body = $paragraphs(2)
            ."\n\n## ".rtrim(fake()->sentence(4), '.')."\n\n"
            .$paragraphs(2)
            ."\n\n> ".fake()->sentence(12)."\n\n"
            ."- ".fake()->sentence(6)."\n- ".fake()->sentence(6)."\n- ".fake()->sentence(6)."\n\n"
            ."## ".rtrim(fake()->sentence(3), '.')."\n\n"
            .$paragraphs(3);

        return [
            'user_id' => User::factory(),
            'title' => rtrim(fake()->sentence(fake()->numberBetween(4, 8)), '.'),
            'excerpt' => fake()->sentence(20),
            'body' => $body,
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => ['status' => 'draft', 'published_at' => null]);
    }
}
