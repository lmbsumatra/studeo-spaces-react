<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
        {
            Schema::create('bookings', function (Blueprint $table) {
                $table->id();
                $table->string('service');
                $table->date('date');
                $table->time('time');
                $table->string('name');
                $table->string('email');
                $table->string('contact_number');
                $table->string('payment_method');
                $table->string('refNumber')->unique();
                $table->timestamps();
            });
        }

    public function down()
        {
            Schema::dropIfExists('bookings');
        }
};
