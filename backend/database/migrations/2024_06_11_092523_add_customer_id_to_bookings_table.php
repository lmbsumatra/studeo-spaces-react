<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Add the foreign key column and create the foreign key
        Schema::table('bookings', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_id')->after('id');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });
    }

    public function down()
    {
        // SQLite workaround: To drop a foreign key constraint and column
        // Recreate the bookings table without the foreign key

        // If the temporary table already exists, drop it
        Schema::dropIfExists('bookings_temp');

        // Create a new temporary table with all columns from the original bookings table
        Schema::create('bookings_temp', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_id');
            $table->decimal('price', 10, 2);
            $table->date('date');
            $table->time('time');
            $table->string('name');
            $table->string('email');
            $table->string('contact_number');
            $table->string('payment_method');
            $table->string('refNumber');
            $table->string('status');
            $table->timestamps();
            $table->unsignedBigInteger('customer_id'); // Include the customer_id column as well
        });

        // Copy the data over from the old bookings table to the new one
        DB::table('bookings')->get()->each(function ($booking) {
            DB::table('bookings_temp')->insert((array) $booking);
        });

        // Drop the old bookings table
        Schema::drop('bookings');

        // Rename the new table to the original name
        Schema::rename('bookings_temp', 'bookings');
    }
};
