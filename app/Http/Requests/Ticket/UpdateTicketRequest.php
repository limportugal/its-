<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action_taken' => 'required|string|min:10|max:510',
            'attachment' => 'nullable|file|mimes:png,jpg,jpeg,pdf|max:10240', // 10MB max
        ];
    }
}
