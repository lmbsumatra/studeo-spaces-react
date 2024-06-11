<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceAvailability extends Model
{
    use HasFactory;

    protected $table = 'service_availability'; // Explicitly specify the table name

    protected $fillable = ['service_id', 'date', 'available_seats'];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
