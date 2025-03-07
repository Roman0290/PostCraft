<?php

namespace App\Http\Requests;

class UpdatePostRequest extends StorePostRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('post'));
    }

    public function rules(): array
    {
        return parent::rules() + [
            'remove_cover' => ['sometimes', 'boolean'],
        ];
    }
}
