<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'service',
        'date',
        'time',
        'name',
        'email',
        'contact_number',
        'payment_method',
        'refNumber'
    ];
}
