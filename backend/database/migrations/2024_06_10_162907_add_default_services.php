<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('services')->insert([
            [
                'name' => 'All-day/All-night Pass',
                'duration' => '8AM - 3AM',
                'price' => 250,
                'description' => 'All-day/All-night Pass from 8AM to 3AM',
                'images' => null,
                'count' => 30,
            ],
            [
                'name' => 'GLASSBOX: All-day/All-night Pass',
                'duration' => '8AM - 3AM',
                'price' => 250,
                'description' => 'GLASSBOX: All-day/All-night Pass from 8AM to 3AM',
                'images' => null,
                'count' => 10,
            ],
            [
                'name' => 'GLASSBOX: Night Shift',
                'duration' => '6PM - 6AM',
                'price' => 250,
                'description' => 'GLASSBOX: Night Shift from 6PM to 6AM',
                'images' => null,
                'count' => 10,
            ],
            [
                'name' => 'Prepaid Tipid: 15-day pass',
                'duration' => '15 days',
                'price' => 3000,
                'description' => 'Prepaid Tipid: 15-day pass',
                'images' => null,
                'count' => 30,
            ],
            [
                'name' => 'BarkadAral Room (For 6 people) - 8 hours',
                'duration' => '8 hours',
                'price' => 1500,
                'description' => 'BarkadAral Room for 6 people for 8 hours',
                'images' => null,
                'count' => 1,
            ],
            [
                'name' => 'BarkadAral Room (For 6 people) - 12 hours',
                'duration' => '12 hours',
                'price' => 2000,
                'description' => 'BarkadAral Room for 6 people for 12 hours',
                'images' => null,
                'count' => 1,
            ],
            [
                'name' => 'BarkadAral Room (For 6 people) - 21 hours',
                'duration' => '8AM - 5AM',
                'price' => 3000,
                'description' => 'BarkadAral Room for 6 people for 21 hours from 8AM to 5AM',
                'images' => null,
                'count' => 1,
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to define this method as it's not necessary to rollback these insertions.
    }
};
