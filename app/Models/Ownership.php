<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ownership extends Model
{
    protected $table = 'ownerships';
    protected $primaryKey = 'id';
    protected $fillable = [
        'ownership_name',
        'status',
        'created_at',
        'updated_at',
    ];

    public static function createOwnership(array $data)
    {
        return self::create($data);
    }

    public function updateOwnership(array $data)
    {
        return $this->update($data);
    }

    public function scopeNotDeleted($query)
    {
        return $query->where('status', '!=', 'deleted');
    }
}

