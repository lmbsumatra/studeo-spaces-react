<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('passes', function (Blueprint $table) {
            $table->id('pass_id');
            $table->foreignId('customer_id')->constrained('customers');
            $table->integer('total_days');
            $table->integer('remaining_days');
            $table->integer('total_bullets');
            $table->integer('remaining_bullets');
            $table->boolean('is_shared');
            $table->string('reference_number')->unique();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('passes');
    }
};