<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('customer_id')->nullable(); // Foreign key to customers table
            $table->string('customer_name')->nullable(); // Customer name, can be null
            $table->text('message'); // Notification message content
            $table->enum('type', [
                'new_booking',
                'booking_confirmation',
                'booking_cancellation',
                'booking_rescheduled',
                'booking_reminder',
                'payment_received',
                'payment_failed',
                'refund_processed',
                'system_alert',
                'feature_update',
                'scheduled_maintenance',
                'customer_registration',
                'customer_feedback',
                'customer_report',
                'special_event',
                'event_reminder',
                'admin_action_required',
                'policy_change',
                'error_alert',
                'warning_message',
                'customer_message',
                'admin_add_service',
                'admin_edit_service',
                'admin_delete_service',
                'admin_login',
                'admin_logout'
                
            ]); // Type of notification
            $table->boolean('is_read')->default(0); // Read status, defaults to unread
            $table->string('action_url')->nullable(); // Optional URL for an action
            $table->boolean('is_deleted')->default(0); // Soft delete flag
            $table->timestamps(); // Created at and updated at

            // Set foreign key constraint
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
