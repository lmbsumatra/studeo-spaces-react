<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'price',
        'date',
        'time',
        'name',
        'email',
        'contact_number',
        'payment_method',
        'refNumber',
        'status',
        'customer_id',
        'pass_type',
        'seat_code',
        'pass_id',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
    public function pass()
    {
        return $this->belongsTo(Pass::class);
    }
}
