<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isSelf = $request->user('sanctum')?->id === $this->id;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'bio' => $this->bio,
            // Private fields are only shown to the user themselves
            'email' => $this->when($isSelf, $this->email),
            'is_admin' => $this->when($isSelf, (bool) $this->is_admin),
            'posts_count' => $this->whenCounted('posts'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
