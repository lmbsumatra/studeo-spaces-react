<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSeatCodeToBookingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Add seat_code column to the bookings table
            $table->string('seat_code')->nullable()->after('payment_method');

            // Optionally, add a foreign key to the 'seats' table if needed
            // $table->foreign('seat_code')->references('seat_code')->on('seats')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Drop the seat_code column if rolling back
            $table->dropColumn('seat_code');
        });
    }
}
