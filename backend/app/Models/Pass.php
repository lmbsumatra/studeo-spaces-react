<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pass extends Model
{
    protected $primaryKey = 'pass_id';
    
    protected $fillable = [
        'customer_id',
        'total_days',
        'remaining_days',
        'total_bullets',
        'remaining_bullets',
        'is_shared',
        'reference_number'
    ];

    // Relationship with Customer
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    // Relationship with PassShare
    public function shares()
    {
        return $this->hasMany(PassShare::class, 'pass_id');
    }

    // Helper method to check if pass is valid
    public function isValid()
    {
        return $this->remaining_days > 0 && $this->remaining_bullets > 0;
    }

    // Helper method to use one day of the pass
    public function useDay()
    {
        if ($this->isValid()) {
            $this->remaining_days--;
            $this->remaining_bullets--;
            $this->save();
            return true;
        }
        return false;
    }
}