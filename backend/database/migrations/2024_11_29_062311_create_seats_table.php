<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('seats', function (Blueprint $table) {
        $table->id();
        $table->string('seat_code');
        $table->foreignId('service_id')->constrained()->onDelete('cascade');
        $table->boolean('is_booked')->default(false);
        $table->integer('floor_number'); // New column for floor number
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seats');
    }
}
