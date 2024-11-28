<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        Admin::create([
            'username' => 'admin123',
            'password' => 'newpassword',
            'security_question' => 'What was the name of your elementary school?',
            'security_answer' => 'school'
        ]);
    }
}
