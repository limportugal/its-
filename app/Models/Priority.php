<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Priority extends Model
{
    protected $table = 'priorities';
    protected $primaryKey = 'id';
    protected $fillable = [
        'priority_name',
        'description',
        'status',
        'created_at',
        'updated_at',
    ];

    //CREATE NEW PRIORITY
    public function createPriority($data)
    {
        return $this->create($data);
    }

    //UPDATE PRIORITY
    public function updatePriority($id, $data)
    {
        return $this->find($id)->update($data);
    }

    public function scopeLatest($query)
    {
        return $query->orderBy('created_at', 'desc')->orderBy('updated_at', 'desc');
    }

    //DELETE PRIORITY
    public function deletePriority($id)
    {
        return $this->find($id)->delete();
    }

    // RELATIONSHIP BETWEEN PRIORITY AND TICKET
    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'priority_id',);
    }

    public function scopeNotDeleted($query)
    {
        return $query->where('status', '!=', 'deleted');
    }
}
