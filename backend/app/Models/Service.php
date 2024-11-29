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
        'service_code',
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

    public function seats()
{
    return $this->hasMany(Seat::class); // Assuming "Seat" is your Seat model
}
}
