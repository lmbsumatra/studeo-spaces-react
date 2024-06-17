<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_availability', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('duration');
        $table->decimal('price', 8, 2);
        $table->string('images')->nullable();
        $table->text('description')->nullable();
        $table->integer('count')->unsigned();
        $table->tinyInteger('availability')->default(0); // Add this line
        $table->timestamps();
        $table->check('count >= 0'); // Add this line for constraint
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_availability');
    }
};
