<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceCenter extends Model
{
    protected $table = 'service_centers';
    protected $primaryKey = 'id';
    protected $fillable = [
        'service_center_name',
        'status',
        'created_at',
        'updated_at',
    ];

    public static function createServiceCenter(array $data)
    {
        return self::create($data);
    }

    public function updateServiceCenter(array $data)
    {
        return $this->update($data);
    }

    public function scopeNotDeleted($query)
    {
        return $query->where('status', '!=', 'deleted');
    }
}
