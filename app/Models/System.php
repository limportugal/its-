<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class System extends Model
{
    protected $table = 'systems';
    protected $primaryKey = 'id';
    protected $fillable = [
        'created_at',
        'system_name',
        'status',
        'uuid',
        "updated_at",
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = Str::uuid();
            }
        });
    }
    // CREATE SYSTEM 
    public static function createSystem(array $data)
    {
        return self::create($data);
    }

    // UPDATE SYSTEM
    public function updateSystem(array $data)
    {
        return $this->update($data);
    }

    // HAS MANY RELATIONSHIP WITH TICKET (ONE-TO-MANY)
    public function ticket()
    {
        return $this->hasMany(Ticket::class, 'system_id');
    }

    // HAS MANY RELATIONSHIP WITH CATEGORY (ONE-TO-MANY)
    public function category()
    {
        return $this->hasMany(Category::class, 'system_id');
    }

    public function scopeNotDeleted($query)
    {
        return $query->where('status', '!=', 'deleted');
    }

    // FIND SYSTEM BY UUID
    public static function findByUuid($uuid)
    {
        return self::where('uuid', $uuid)->first();
    }

    // GET SYSTEM ID BY UUID
    public static function getIdByUuid($uuid)
    {
        $system = self::where('uuid', $uuid)->first();
        return $system ? $system->id : null;
    }

    // GENERATE SLUG FROM SYSTEM NAME
    public function getSlugAttribute()
    {
        return Str::slug($this->system_name);
    }

    // FIND SYSTEM BY SLUG
    public static function findBySlug($slug)
    {
        return self::whereRaw("LOWER(REPLACE(REPLACE(REPLACE(system_name, ' ', '-'), '_', '-'), '.', '-')) = ?", [strtolower($slug)])
            ->first();
    }

    // FIND SYSTEM BY SLUG AND UUID
    public static function findBySlugAndUuid($slug, $uuid)
    {
        return self::where('uuid', $uuid)
            ->whereRaw("LOWER(REPLACE(REPLACE(REPLACE(system_name, ' ', '-'), '_', '-'), '.', '-')) = ?", [strtolower($slug)])
            ->first();
    }
}
