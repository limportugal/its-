<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $table = 'companies';
    protected $primaryKey = 'id';
    protected $fillable = [
        'company_name',
        'status',
        'created_at',
    ];

    public static function createCompany(array $data)
    {
        return self::create($data);
    }

    public function updateCompany(array $data)
    {
        return $this->update($data);
    }

    // HAS MANY RELATIONSHIP WITH TICKET (ONE-TO-MANY)
    public function ticket()
    {
        return $this->hasMany(Ticket::class, 'company_id');
    }

    public function scopeNotDeleted($query)
    {
        return $query->where('status', '!=', 'deleted');
    }
}
