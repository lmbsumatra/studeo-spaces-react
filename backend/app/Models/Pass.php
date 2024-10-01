<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pass extends Model
{
    protected $primaryKey = 'pass_id';
    protected $fillable = [
        'customer_id', 'total_days', 'remaining_days', 'total_bullets', 'remaining_bullets', 'is_shared'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function shares()
    {
        return $this->hasMany(PassShare::class, 'pass_id');
    }
}