<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeedbackTable extends Migration
{
    public function up()
    {
        Schema::create('feedback', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID
            $table->foreignId('message_id')->constrained()->onDelete('cascade'); // Foreign key to messages
            $table->boolean('publish')->default(false); // Whether the feedback is published
            $table->timestamps(); // created_at and updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('feedback');
    }
}
