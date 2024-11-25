<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PassShare extends Model
{
    protected $primaryKey = 'share_id';
    
    protected $fillable = [
        'pass_id',
        'shared_with_customer_id',
        'share_date',
        'name',
        'email',  
        'contact'  
    ];

    protected $casts = [
        'share_date' => 'date'
    ];

    // Relationship with Pass
    public function pass()
    {
        return $this->belongsTo(Pass::class, 'pass_id', 'pass_id');
    }

    // Relationship with Customer (who the pass was shared with)
    public function sharedWithCustomer()
    {
        return $this->belongsTo(Customer::class, 'shared_with_customer_id', 'id');
    }
}