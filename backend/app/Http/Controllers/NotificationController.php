<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{

    public function index(Request $request)
{
    // Fetch all notifications
    $notifications = Notification::where('is_deleted', false) // Optionally filter out deleted notifications
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($notifications);
}

    public function createNotification(Request $request)
    {
        Notification::create([
            'customer_id' => $request->input('customer_id', null),
            'customer_name' => $request->input('customer_name', null),
            'message' => $request->input('message'),
            'type' => $request->input('type', 'message'), // Default to 'message'
            'action_url' => $request->input('action_url', null),
            'related_data_id' => $request->input('related_data_id', null)
        ]);

        return response()->json(['message' => 'Notification created successfully.']);
    }

    public function softDelete(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);
        $notification->is_deleted = true;
        $notification->save();

        return response()->json(['message' => 'Notification marked as deleted.']);
    }
}
