<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreType extends Model
{
    protected $table = 'store_types';
    protected $primaryKey = 'id';
    protected $fillable = [
        'store_type_name',
        'status',
        'created_at',
        'updated_at',
    ];

    public static function createStoreType(array $data)
    {
        return self::create($data);
    }

    public function updateStoreType(array $data)
    {
        return $this->update($data);
    }

    public function scopeNotDeleted($query)
    {
        return $query->where('status', '!=', 'deleted');
    }
}

