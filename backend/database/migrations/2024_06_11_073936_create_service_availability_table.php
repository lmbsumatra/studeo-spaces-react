<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_availability', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_id'); // Add service_id column
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade'); // Add foreign key constraint
            $table->date('date'); // Add date column
            $table->string('name');
            $table->string('duration');
            $table->decimal('price', 8, 2);
            $table->string('images')->nullable();
            $table->text('description')->nullable();
            $table->integer('count')->unsigned();
            $table->tinyInteger('availability')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_availability');
    }
};
