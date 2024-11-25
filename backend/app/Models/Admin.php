<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject; // Import JWTSubject contract
use Illuminate\Support\Facades\Hash; // Import the Hash facade

class Admin extends Authenticatable implements JWTSubject // Implement JWTSubject
{
    use HasApiTokens, Notifiable;

    protected $table = 'admins';

    protected $fillable = ['username', 'password', 'security_question', 'security_answer'];

    protected $hidden = [
        'password',
        'remember_token',
        'security_answer', // Hide the security answer to protect sensitive data
        'security_question', // Hide the security question as well if it's hashed
    ];

    /**
     * Mutator to hash password before saving
     */
    public function setPasswordAttribute($value)
    {
        // Hash the password using bcrypt before saving it
        $this->attributes['password'] = bcrypt($value);
    }

    /**
     * Mutator to hash the security answer before saving
     */
    public function setSecurityAnswerAttribute($value)
    {
        // Hash the security answer using bcrypt before saving it
        $this->attributes['security_answer'] = Hash::make($value);
    }


    /**
     * Get the JWT identifier
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Usually, it's the primary key (e.g., id).
    }

    /**
     * Get the custom claims for the JWT
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        // Example: Adding a custom claim (role)
        return [
            'role' => $this->role, // Add role claim if available
        ];
    }
}
