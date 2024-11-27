<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'customer_id',
        'customer_name',
        'message',
        'type',
        'is_read',
        'action_url',
        'is_deleted',
        'related_data_id',
    ];

    // Relationship with the Customer model
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    protected $casts = [
        'is_deleted' => 'boolean',
    ];
}
