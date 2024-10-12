<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedback'; // Specify the table name

    protected $fillable = [
        'message_id',
        'publish',
    ];

    // Define relationships
    public function message()
    {
        return $this->belongsTo(Message::class, 'message_id');
    }
}
