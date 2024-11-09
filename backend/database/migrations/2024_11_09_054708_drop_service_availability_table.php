<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropServiceAvailabilityTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Drop the service_availability table
        Schema::dropIfExists('service_availability');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // If you want to rollback the migration, recreate the table.
        Schema::create('service_availability', function (Blueprint $table) {
            $table->id();
            $table->boolean('available')->default(true); // Add any other columns that existed
            $table->timestamps();
        });
    }
}
