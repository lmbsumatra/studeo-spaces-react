<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pass_shares', function (Blueprint $table) {
            $table->id('share_id');
            $table->unsignedBigInteger('pass_id');
            $table->unsignedBigInteger('shared_with_customer_id');
            $table->date('share_date');
            $table->timestamps();

            $table->foreign('pass_id')->references('pass_id')->on('passes')->onDelete('cascade');
            $table->foreign('shared_with_customer_id')->references('id')->on('customers')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pass_shares');
    }
};