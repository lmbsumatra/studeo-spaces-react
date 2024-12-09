<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class UpdateTypeEnumInNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Update the 'type' enum to the new list of values
        DB::statement("ALTER TABLE notifications CHANGE type type ENUM(
            'cancelbooking',
            'booking',
            'suggestion',
            'request',
            'complaint',
            'feedback',
            'inquiry',
            'message'
        )");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // In the down method, we remove the new values and revert to the old enum list if necessary
        DB::statement("ALTER TABLE notifications CHANGE type type ENUM(
           ('cancelbooking','booking','suggestion','request','complaint','feedback','inquiry','message')

        )");
    }
}
