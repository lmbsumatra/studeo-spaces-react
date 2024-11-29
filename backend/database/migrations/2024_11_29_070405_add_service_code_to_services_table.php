<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddServiceCodeToServicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Check if the 'service_code' column already exists
        if (!Schema::hasColumn('services', 'service_code')) {
            Schema::table('services', function (Blueprint $table) {
                $table->string('service_code'); // Add the 'service_code' column if it doesn't exist
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Check if the 'service_code' column exists before dropping it
        if (Schema::hasColumn('services', 'service_code')) {
            Schema::table('services', function (Blueprint $table) {
                $table->dropColumn('service_code');
            });
        }
    }
}
