<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

/**
 * Generates a unique slug from a source attribute when the model is created.
 * Models can override slugSource() to pick which attribute is slugged.
 */
trait HasSlug
{
    protected static function bootHasSlug(): void
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = $model->uniqueSlug($model->{$model->slugSource()});
            }
        });
    }

    protected function slugSource(): string
    {
        return 'name';
    }

    public function uniqueSlug(string $value): string
    {
        $base = Str::slug($value) ?: Str::lower(Str::random(8));
        $slug = $base;
        $i = 2;

        while (static::where('slug', $slug)->whereKeyNot($this->getKey())->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
