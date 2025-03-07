<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user('sanctum');

        return [
            'id' => $this->id,
            'body' => $this->body,
            'author' => new UserResource($this->whenLoaded('author')),
            'can_delete' => $user ? $user->can('delete', $this->resource) : false,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
