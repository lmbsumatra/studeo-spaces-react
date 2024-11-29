<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'seat_code',  
        'service_id',
        'is_booked',
        'floor_number',        
        // 'reservation_id' // e.g., Links to a reservation or booking
    ];

    /**
     * Relationship with Service (if applicable).
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
