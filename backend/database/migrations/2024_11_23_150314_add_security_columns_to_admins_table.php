<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->string('security_question')->nullable();
            $table->string('security_answer')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->dropColumn('security_question');
            $table->dropColumn('security_answer');
        });
    }
};    
