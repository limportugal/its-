<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    protected $table = 'categories';
    protected $primaryKey = 'id';
    protected $fillable = [
        'category_name',
        'system_id',
        'status',
    ];

    protected $hidden = [
        'system_id',
    ];

    // CREATE CATEGORY (Static Method)
    public static function createCategory(array $data)
    {
        return self::create($data);
    }

    // UPDATE CATEGORY (Instance Method)
    public function updateCategory(array $data)
    {
        return $this->update($data);
    }

    public function scopeLatest($query)
    {
        return $query->orderBy('created_at', 'desc')->orderBy('updated_at', 'desc');
    }

    public function scopeNotDeleted($query)
    {
        return $query->where('status', '!=', 'deleted');
    }

    // BELONGS TO RELATIONSHIP WITH SYSTEM (MANY-TO-ONE)
    public function system(): BelongsTo
    {
        return $this->belongsTo(System::class, 'system_id');
    }

    // HAS MANY RELATIONSHIP WITH TICKETS (ONE-TO-MANY)
    public function tickets(): BelongsToMany
    {
        return $this->belongsToMany(Ticket::class, 'ticket_categories')
            ->withTimestamps();
    }
}
