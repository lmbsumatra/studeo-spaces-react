<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    // Define the table if it doesn't follow Laravel's naming conventions
    // protected $table = 'services';

    protected $fillable = [
        'name',
        'duration',
        'price',
        'images',
        'description',
        'count',
        'availability',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function availability()
    {
        return $this->hasMany(ServiceAvailability::class);
    }
}
