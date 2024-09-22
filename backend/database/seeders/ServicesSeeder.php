<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServicesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('services')->insert([
            [
                'name' => 'All-day/All-night Pass',
                'duration' => '8AM - 3AM',
                'price' => 250,
                'description' => 'All-day/All-night Pass from 8AM to 3AM',
                'images' => '/assets/images/services/img_1.png',
                'count' => 30,
                'availability' => 1,
            ],
            [
                'name' => 'GLASSBOX: All-day/All-night Pass',
                'duration' => '8AM - 3AM',
                'price' => 250,
                'description' => 'GLASSBOX: All-day/All-night Pass from 8AM to 3AM',
                'images' => '/assets/images/services/img_2.png',
                'count' => 10,
                'availability' => 1,
            ],
            [
                'name' => 'GLASSBOX: Night Shift',
                'duration' => '6PM - 6AM',
                'price' => 250,
                'description' => 'GLASSBOX: Night Shift from 6PM to 6AM',
                'images' => '/assets/images/services/img_3.png',
                'count' => 10,
                'availability' => 1,
            ],
            [
                'name' => 'Prepaid Tipid: 15-day pass',
                'duration' => '15 days',
                'price' => 3000,
                'description' => 'Prepaid Tipid: 15-day pass',
                'images' => '/assets/images/services/img_4.jpg',
                'count' => 30,
                'availability' => 1,
            ],
            [
                'name' => 'BarkadAral Room (For 6 people) - 8 hours',
                'duration' => '8 hours',
                'price' => 1500,
                'description' => 'BarkadAral Room for 6 people for 8 hours',
                'images' => '/assets/images/services/img_5.jpg',
                'count' => 1,
                'availability' => 1,
            ],
            [
                'name' => 'BarkadAral Room (For 6 people) - 12 hours',
                'duration' => '12 hours',
                'price' => 2000,
                'description' => 'BarkadAral Room for 6 people for 12 hours',
                'images' => '/assets/images/services/img_6.jpg',
                'count' => 1,
                'availability' => 1,
            ],
            [
                'name' => 'BarkadAral Room (For 6 people) - 21 hours',
                'duration' => '8AM - 5AM',
                'price' => 3000,
                'description' => 'BarkadAral Room for 6 people for 21 hours from 8AM to 5AM',
                'images' => '/assets/images/services/img_7.jpg',
                'count' => 1,
                'availability' => 1,
            ],
        ]);
    }
}
