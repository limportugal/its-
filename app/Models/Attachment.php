<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class Attachment extends Model
{
    use HasUuid;

    protected $table = 'attachments';
    protected $primaryKey = 'id';

    protected $fillable = [
        'uuid',
        'user_id',
        'category',
        'original_name',
        'file_path',
        'mime_type',
        'attachable_type',
        'attachable_id',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // USE UUID FOR ROUTE MODEL BINDING
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function attachable()
    {
        return $this->morphTo();
    }
}
