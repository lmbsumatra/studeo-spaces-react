<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMessageIdToNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('notifications', function (Blueprint $table) {
            // Adding the related_data_id column to the notifications table
            $table->unsignedBigInteger('related_data_id')->nullable()->after('id'); // Adjust 'after' position as needed

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notifications', function (Blueprint $table) {
            // Drop the foreign key constraint and the column
            $table->dropForeign(['related_data_id']);
            $table->dropColumn('related_data_id');
        });
    }
}
